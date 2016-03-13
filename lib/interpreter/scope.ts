'use strict';

import { Value } from './value';

// TODO: Make this class generic, so it can be reused for Ref node tracking for the compiler,
// tree-shaker, and unused value warning generator.

export class ScopeTree {
  protected _parent: ScopeTree = null;
  private _children: ScopeTree[] = [];
  private _symbols: { [ symbol: string ]: Value } = {};

  set(symbol: string, value: Value): Value {
    this._symbols[symbol] = value;
    return value;
  }

  lookup(symbol: string): Value {
    const value = this._symbols[symbol];
    if(value) return value;
    if(this._parent) return this._parent.lookup(symbol);
    return null;
  }

  child(): ScopeTree {
    const child = new ScopeTree();
    child._parent = this;
    this._children.push(child);
    return child;
  }
}
