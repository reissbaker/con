some general notes:

try to make the language constructs use simple, varied english. for example,
prefer `macro` to `defmacro`, `type` to `deftype`, etc. strive to make the
functions take the simplest, least-powerful objects: a type should take a
struct, not have special syntax or a sexpr dsl. where possible, keep function
APIs similar — especially if the functions perform similar behavior (`import`
and `let` both add things to the scope, for example, so they should be
structured similarly). respect programmers' time in learning your language.

use friendly names and semantics. ruby is friendly; use `def` for your
functions. don't overload terminology from other languages with different
semnatics: for example, use `typeclass` rather than `class`, because `class` in
other languages means something totally different.

call it null, not unit. everyone knows null and it means the same thing.

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

    (with {
        x: 10
        y: 20
      } (+ x y))

    (import {
        ast: './ast'
        ir:  './ir'
      })

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

    (def fn [ (Numeric x) ]
      ( ... ))

to upcast/hide the type of an implementation detail, rather than annotating the
function directly, annotate the body:

    (def fn [ (Numeric x) ]
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

    (import [
        (package 'express')
        (package 'con')
        (package 'html-parser')
        (package './some-file')
        (package './other-file' { as: 'some-name' })
      ])

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
