/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOMOutputSpec, Mark, Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import {
  Children,
  cloneElement,
  createElement,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react';

import { DOMSerializer } from './types';

type Props = Record<string, any>;
type DOMOutputSpecChild = DOMOutputSpec | 0;
type CustomDOMOutputSpecArray = [
  string,
  DOMOutputSpecChild | { [attr: string]: string } | undefined,
  ...DOMOutputSpecChild[],
];

function isProp(props: any): props is Props {
  return props && typeof props === 'object' && props.nodeType == null && !Array.isArray(props);
}

function isNode(node: any): node is Node {
  return node.nodeType != null;
}
// Based on: https://github.com/ProseMirror/prosemirror-model/blob/0ad6b98c26218a4324767361a6f83a5837c4496e/src/to_dom.js#L119
function _toReactElement(
  structure: DOMOutputSpec,
  childrenElement?: ReactNode,
): { element: ReactElement; handledChild: boolean } {
  if (typeof structure === 'string') {
    return {
      element: createElement('span', null, structure),
      handledChild: false,
    };
  }

  if (isNode(structure)) {
    throw new Error('Prosemirror React View it doesnt support plain dom nodes.');
  }

  // Casting to custom implementation to make happy typescript
  const typedStructure = structure as CustomDOMOutputSpecArray;
  // We have a DOM Spec Array
  const elementType = typedStructure[0];
  let maybeProps: Record<string, any> | null = {};
  let start = 1;
  if (isProp(typedStructure[1])) {
    start = 2;
    maybeProps = typedStructure[1];
  }

  const children: JSX.Element[] = [];
  let childWasHandled = false;
  for (let i = start; i < typedStructure.length; i++) {
    const child = typedStructure[i] as DOMOutputSpecChild;
    if (child === 0) {
      if (i < typedStructure.length - 1 || i > start)
        throw new RangeError('Content hole must be the only child of its parent node');
      return {
        element: createElement(elementType, maybeProps, childrenElement),
        handledChild: true,
      };
    } else {
      const { element: childElement, handledChild } = _toReactElement(child, childrenElement);
      childWasHandled = childWasHandled || handledChild;
      children.push(childElement);
    }
  }
  return {
    element: createElement(elementType, maybeProps, ...children),
    handledChild: childWasHandled,
  };
}

export function toReactElement(
  structure: DOMOutputSpec,
  childrenElement?: ReactNode,
): ReactElement {
  const { element, handledChild } = _toReactElement(structure, childrenElement);

  // TODO: Think in a better way to assure the children was handled only once.
  if (!handledChild) {
    const props = {};
    // No children
    if (Children.count(childrenElement) === 0) {
      return cloneElement(element, props);
    }
    const children = [childrenElement];
    if (element.props && element.props.children) {
      children.push(element.props.children);
    }
    return cloneElement(element, props, ...children);
  }
  return element;
}

function gatherToDOM<Type extends Mark | ProseMirrorNode>(
  obj: Record<string, Type['type']>,
): Record<string, Type['type']['spec']['toDOM']> {
  const result: Record<string, Type['type']['spec']['toDOM']> = {};
  for (const name in obj) {
    if (Object.hasOwnProperty.call(obj, name)) {
      const toDOM = obj[name].spec.toDOM;
      if (toDOM) result[name] = toDOM;
    }
  }
  return result;
}

function nodesFromSchema(schema: Schema) {
  const result = gatherToDOM<ProseMirrorNode>(schema.nodes);
  if (!result.text) {
    result.text = (node: ProseMirrorNode) => node.text as string;
  }
  return result;
}

function marksFromSchema(schema: Schema) {
  return gatherToDOM<Mark>(schema.marks);
}

export function createDomSerializer<S extends Schema>(schema: S): DOMSerializer<S> {
  const nodes = nodesFromSchema(schema);
  const marks = marksFromSchema(schema);

  return {
    serializeNode(node) {
      return forwardRef<Node, PropsWithChildren<{}>>((props, ref) => {
        const toDom = nodes[node.type.name];
        if (!toDom) {
          return null;
        }
        const spec = toDom(node);
        const element = toReactElement(spec, props.children);

        const clonedElement = cloneElement(element, { ref });
        return clonedElement;
      });
    },
    serializeMark(mark, inline) {
      return forwardRef<any, any>(({ children }, ref) => {
        const toDom = marks[mark.type.name];
        if (!toDom) {
          return null;
        }
        const spec = toDom(mark, inline);
        const element = toReactElement(spec, children);
        return cloneElement(element, { ref });
      });
    },
  };
}
