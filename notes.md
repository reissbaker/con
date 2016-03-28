some general notes:

try to make the language constructs use simple, varied english. for example,
prefer `macro` to `defmacro`, `type` to `deftype`, etc. strive to make the
functions take the simplest, least-powerful objects: a type should take a
struct, not have special syntax or a sexpr dsl. prefer transforms over option
structs or other configuration. where possible, keep function APIs similar —
especially if the functions perform similar behavior (`import` and `let` both
add things to the scope, for example, so they should be structured similarly).
respect programmers' time in learning your language.

use friendly names and semantics. ruby is friendly; use `def` for your
functions. don't overload terminology from other languages with different
semnatics: for example, use `typeclass` rather than `class`, because `class` in
other languages means something totally different.

call it null, not unit. everyone knows null and it means the same thing. or
nil, it's a nice word.

reduce the numbers of ways to do things — lean on macros for metaprogramming
the compiler. for example, use regular structs for setting variables in `with`
blocks, allowing you to also use `with` on struct objects created elsewhere at
macro-time, like package objects.

strings should be length-prefixed UTF-8. convert strings from UTF-16 to UTF-8
and back at the JavaScript border. make sure to have unit tests for proper
non-Latin-character support (and emoji). have standard library functions for
grapheme clusters, code points, etc. no such thing as a "char" — if you want
that, use a byte.

the `con run` command should use the interpreter — don't bother compiling and
then running the compiled stuff. you can also make test runs quick to start
that way. `con run`, like `import`, can take either relative paths to files —
in which case it runs the files — or package names, in which case it runs the
code in the exe/ folder of the package.

    con run cluster start # looks for con_packages/cluster/exe/start.con
    con run cluster stop  # looks for con_packages/cluster/exe/stop.con
    con run cluster       # looks for con_packages/cluster/exe/main.con
    con run ./code.con    # looks for ./code.con
    con run               # looks for ./exe/main.con



You should switch the weird `with` and `import` syntax to use structs instead of
vectors and tuples once you have struct support. Much nicer to read:

    (with {x: 10
           y: 20}
           (+ x y))

    (import {ast: './ast'
             ir:  './ir'})

Get structs working sooner rather than later. Don't need runtime support to
support them in `with`.

Actually, no... This has the weird behavior of let vs letrec in Scheme, where
the later assignments can't depend on earlier ones. Keep the existing syntax
(but call `with` `let`), have `with` and `using` be special things that take
structs.



Support "fake-OO" calling convention:

    (object#fn-name ...)

Is just syntax sugar for:

    (fn-name object ...)



you have to macroexpand prior to lowering. otherwise macros are a huge PITA.
(aka, macroexpand within the lower() calls, but prior to doing any actual
lowering.)



type constraints for functions should be inline:

    (def fn [(Numeric x)]
      ( ... ))

to upcast/hide the type of an implementation detail, rather than annotating the
function directly, annotate the body:

    (def fn [(Numeric x)]
      (Numeric
        ( ... )))

the (Type x) calls in argument lists *narrow* types — that is, they enforce
that the type of the argument passed to the function must be a subset of what
would have previously been inferred as allowable, and prevents
otherwise-"valid" (at least, valid according to the type inference algorithm)
types from being passed — whereas outside of argument lists they broaden types,
preventing the type inference algorithm from making deductions based on the
concrete implementations used and instead forcing it to use the higher-level,
more abstract type.

the (Type x) calls should generate TypedBody nodes. ArgLists should accept
either Reference nodes, or TypedBody nodes where the body is a reference.



for compile-time malloc() with types, have a `claim-type` function that asserts
to the type system that a given pointer point to a value of the given type.
This is assertion is *compile-time*, not runtime, and is never checked at
runtime. Assuming a correct malloc, this guarantee will always be true;
however, calling it yourself is certainly dangerous business. Probably only
allowed inside a `(with danger ...)` block.

(As an aside, having `with` be the primary variable exposer and take in
ordinary structs is really proving to be a nice idea given how closely this
maps to Rust's special `unsafe` block syntax. Should special-case the `use`
method to make sure you can never dump the danger variables into global scope,
since that makes it too easy to hide dangerous stuff from human eyes. Also,
make sure to use the `danger` package exports as reserved words, so that people
can't reimplement a `danger` package drop-in that allows dangerous stuff
without the (rudimentary) safety checks.)

This primitive, though, also allows for very fast parsers to be built that e.g.
parse a JSON string into an appropriate structure in memory of the given type
and then guarantee to the compiler that the resulting block of memory
represents that type. Assuming the JSON parser correctly configures the block
of memory this is a "safe" claim, albeit not one checked by the type system; it
has the potential to be faster than RTTI because you only have to walk through
the JSON's structure once (whereas parse into unknown blob and then RTTI it
requires a second walkthrough for the RTTI).

Arrays of memory should be the same as structs; e.g. they are length-prefixed.
This means you can RTTI any array of memory.

You should also have an RTTI system that is similar to `claim-type` but
actually does validation, for safety. Maybe you can call it `assert-type`,
since it's like a C assertion in that it checks the claim at runtime and throws
an error (returns an error, in con's case) if the claim isn't true.

Only lazily instantiate the RTTI checkers: don't build them for every type.
RTTI is rarely needed, and constructing the checker is relatively expensive
even if it gets tree-shaken out later.



reserve the _ variable for pattern matching.



try to make the language tail-recursive. not sure how to do this off the top of
my head, assuming that asm isn't already tail-recursive with respect to
primitives; is auto-trampolining possible? can you manually implement a stack in
the memory array and translate calls into something that uses that instead of
regular functions? ergh.

actually, manual transformation isn't too hard. have a function that takes a
pointer to the stack, and uses the correct vars from the stack to do its thing.
replace all calls to the recursive cases with iteration (i.e. modify the stack
pointers to point to the new input and then call `next` or equivalent), and then
iteratively call the body until it stops hitting the recursive cases. this also
requires manually push()-ing and pop()-ing the stack at the beginning of every
function and at every exit point, although tbh to do pointers to objects on the
stack you need that anyway.



consider making function and (global) variable symbol lookup happen at runtime,
at least in debug builds, as opposed to burning the calls and accesses in. this
is slower but allows hot code reloading: you load the recompiled code and then
point the symbols in the symbol table at any modified functions / variable
definitions. also allows debuggers to be built relatively easily.

debug builds should be optional — the default should be production builds.
using a debugger is actually kinda rare (printf debugging is pretty quick and
easy comparatively), so don't leave the your-code-is-now-way-slower footgun on
by default.



references to imported functions should look like:

    pkg-name.fn-name

this means that packages are regular structs, accessible at macro / compile
time. easy to build more expressive primitives that work with packages: e.g.
`with` would work both with a struct, and with a package.

import should be as follows:

    (import [(package 'express')
             (package 'express')
             (package 'html-parser')
             (package './some-file')
             (as 'some-name' (package './other-file'))])

relative path imports are assigned their base file name, if it's possible. if
it's not possible (invalid characters or the name is already taken), throw an
error.

don't support index files for relative paths (e.g. `index.con` being the
"default" for a subdirectory). this promotes fake, "cleanup"-style work of
maintaining long lists of re-exports in a file that must be updated every time
some other file in the directory changes. since types are cheap and concise,
promote multiple types per file using the file as the logical unit of
intra-package namespacing rather than nested subdirectories.

idea: import entire directories, and each function is namespaced as:

    dir-name.file-base-name.fn-name

if you import using the array or string form, then just:

    file-base-name.fn-name

this is great and basically how java does it. steal this.



for exporting, use `public`, `package`, `protected`, `private` modifiers a la
every language. `private` is default if nothing is specified. Probably should
not even define `private`, since it does nothing.

    (public def hello-world []
      (println 'hello world'))

Make sure that it's possible to use public defs and macros — if there are
nominal types specified whose packaging isn't public (or rather, is
more-restrictive than the function, so that this correctness check is possible
for `package`, `protected`, and `private` too), throw a type error.



for package server, does two things:

1. Maintains a list of currently-active torrent seeds
2. Provides URLs to download each chunk from a cache, if there are no seeds.

this means you need extremely small amounts of data usage (most stuff is from
cache!) and yet you don't even have to pay the cache provider much. even the
cache is protected from thundering herds, because once a herd starts getting
chunks they'll seed each other and skip cache. make sure not to download chunks
from cache sequentially, or else the herd will stampede the cache since nothing
will ever have the next full chunk. have the server randomize the order and the
clients follow the server's ordering sequentially, with instructions on how to
piece everything back together again at the end.

have the compiler-server be able to navigate the AST given a starting location:
e.g. up a level, down a level, next, prev. this makes implementing these kinds
of specialized motion commands much easier cross-editor.

might be nice to write some annotation macros, so that a programmer can e.g.
assert that their function is actually tail-recursive.



package server should also host docs. any package hosted by the package server
should have docs auto-generated for it and accessible on the web.



include a repl and a debugger in the `con` program as well.



support named arguments for functions that are expanded to normal, positional
function calls at compile-time. this works because you never have raw structs
at runtime: you have typed pointers created from `new` taking a struct.



Swap the [] and () in `let` and `import`. It makes macro usage confusing. TBD:
should it just be entirely vectors? That makes the most sense, but feels wrong
for some reason. Probably feels weird because of the array-of-arrays for a
single var decl: maybe have it so that you can either have an array of arrays,
or a single two-element array of var-name and value.



The `typeclass` function is an interface to the lambda-cross multimap type
system. Typeclasses represent a named type scope, and you can define functions
within that scope using lambda-cross multimap type definitions.

You call the functions by referencing the typeclass itself; e.g.

    (Monad.bind monadic-object (-> [x] (+ x 1)))

The `use` and `with` functions must understand typeclass scopes and work with
them, such that the methods are in scope without referencing the typeclass if
you use either of those two methods.

Probably `return` should be called `create` or sth less confusing. `Monad.of`,
maybe?

This gets rid of the awkwardness of lambda-cross non-determinism when
confronted with multiple values in the same scope that are ambiguously typed
(e.g. `y` is either the function `y(Int, Int) { ... }` or the function
`y(Rational, Rational) { ... }` and where the bodies are different, and is
called with `a` and `b` which are both Ints and Rationals). Since typeclasses
can only contain function definitions, the values always disambiguate the
functions — there is no interface to the multimap scope for values.

But — hmmm. What about functions that operate on functions? Probably can
disambiguate eventually, since they'll necessarily be eventually doing
*something* with values (or else never actually called). Do this by making
multimap function definitions lazy: only actually instantiate them when you see
them called.

Nvm, also `def` should hook into lambda-cross multimaps. Otherwise can't unify
basic things like:

   (def add-five [x]
     (+ x 5))

As soon as you pass a float and an int, compiler's all: yo wtf, you can't do
that.

No, that's not true, you don't need multimaps for unification of that: there's
only a single function body. for that you just generate versions of the fn for
every concrete type passed in, and throw if the type doesn't work with the
functions referenced. Multimaps are only needed when there are different
function bodies for different types.



need an "and" type that composes typeclasses, structural types. so you can say
something must fit these two typeclasses, or these two structural types, or
this combo of structural types and typeclasses... basically, anything the type
system can infer implicitly you should have an explicit hook for as well.

should ban combining nominal types with anything else, because, well... you've
already demanded the most strict thing possible, which is a nominal type.

well, no, don't ban them, since then nominal types can't get passed as params in
certain cases (if the params will be &-ed together).



Structural typing is super useful. But structural *subtyping* is tricky with
tree-shaking and typeclass specialization: you have to have a vtable, and it
might be tricky to figure out which functions actually are going to get called.
Maybe you could track which functions call others with subtype types? Find the
concrete types that need to be virtualized in that function and only include
the functions that get called dynamically inside the subtype function.

Sounds like subtypes should be a later feature, distinct from regular
structural types since they're more complicated (and have different perf
characteristics, since a vtable gets involved). "Structural type" vs
"interface"?

Jeez, structural typing with typeclasses in general sounds annoying, since the
typeclass functions are by definition not namespaced (they specialize a name to
a type). If someone else in a different library lays claim to a set of fields
that you also want to specialize a typeclass for, you're boned.

Maybe structural types aren't a workable idea for this kind of type system.
Instead use Rust-style nominal types + record instantiation.

Nah, you can have structural types: you just can't use them for typeclass
specialization (it makes no sense). Anything passed to a function that takes a
structural type gets a pointer to its function table passed along with it, and
the calls are virtual fn calls. Don't call structural types "types," call them
interfaces or something. The function's inferred type when using a
structurally-typed param and containing a call to a typeclass method is "an
argument matching subtype X and that has a function defined for it in typeclass
Y."

This does mean you need Rust-style nominal instantiation in general, although
the default "Object" or w/e class could have the "Object" name left out
optionally, so you get inline JSON-style instantiation for basic
structs/records.



You should have syntax for accessing a field on an optional object if it exists
and otherwise returning null. That makes null checks much less painful. Prob
just use the Swift-style ?. operator:

    object?.field?.field

Similarly, a ? at the end of a type should be syntax for defining it as
Optional<Type>.

Ditto for !. and ! with Result, like Rust. The equivalent ?# and !# syntaxes
should work as well.

Should ban those operators from function names, unlike Ruby. Would be too
confusing to use both.



A guard function a la Swift's guard keyword would be cool. Have it work
explicitly with Optionals, as opposed to Swift's "truthiness" checking. After a
guard statement, the variable's type should have the option unwrapped. This
should also work with `if`s that are guaranteed to exit from the block (e.g.
will definitely execute a return, throw, etc). Also should work with booleans,
bc, y'know.


type system should track mutability — not just mutability in the sense of "can
this variable be bound to something else," but also in the Ruby-style `freeze`
sense. default is frozen.



consider the type system as a constraint system. you have various type objects
which may be constrained, either to RealizedTypes (e.g. Int32, whatever) or can
be constrained by the typeclass methods that need to exist for them, or can be
constrained by the functions that need to be able to be called on them.



how much of the memory allocation system can you guarantee at compile time
(e.g. have a "type" system for)? for example, could you have a function like:

   (region
     (your-code-goes-here ...))

that statically guarantees no memory escapes the region?



def, macro, val, type should all be lazily-evaluated. calls are eagerly
evaluated: to call a thing, it must already be defined, and calling it means
that it is immediately called (and possibly forced to evaluate, if the
definition hadn't yet been). the niceties of haskell's laziness for defining
stuff, without making debugging and optimization mind-bending.

like rust, types can self-refer only in terms of pointers: you can't have
recursive definitions without pointers, because otherwise the object is of
unknown (and, well, infinite) size.



similar to Go, pointers should be implicitly dereferenced when using
dot-accessors. for example, x.y should retrieve the value of y if y is an
unboxed value, and should retrieve the value stored at memory location y if y
is a pointer.



Add two more variants of comments:

1. `//` and `/* ... */`
2. `/- ... -/`

The former are for doc-comments a la the `///` syntax from Rust, and the latter
is for file-level comments and may only appear at the beginning of a file (sort
of similar to `//!` from Rust, but more restricted).

