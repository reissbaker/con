'use strict';

import { AstNode } from './ast-node';

export abstract class IntermediateNode extends AstNode {
  private _children: AstNode[] = [];

  addChild<T extends AstNode>(node: T): T {
    this._children.push(node);
    node.parent = this;
    return node;
  }

  overwriteChildren(children: AstNode[]) {
    this._children = children;
    this._children.forEach((child) => {
      child.parent = this;
    });
    return children;
  }

  get children() {
    return this._children;
  }

  protected addClonesOf(children: AstNode[]) {
    children.forEach((child) => {
      this.addChild(child.clone());
    });
  }
}
