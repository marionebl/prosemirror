/* eslint-disable @typescript-eslint/no-explicit-any */

import { DOMOutputSpec, Mark, Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import {
  Children,
  cloneElement,
  createElement,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';

import { DOMSerializer, MarkComponentProps, NodeComponentProps } from './types';

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
): { element: ReactElement; handleChild: boolean } {
  if (typeof structure === 'string') {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore React support string but type is not updated
      element: structure,
      handleChild: false,
    };
  }

  if (isNode(structure)) {
    throw new Error('Prosemirror React View it doesnt support plain dom nodes yet.');
  }

  // Casting to custom implementation to make happy typescript
  const typedStructure = structure as CustomDOMOutputSpecArray;
  // We have a DOM Spec Array
  const elementType = typedStructure[0];
  let maybeProps: Record<string, any> | null = null;
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
        handleChild: true,
      };
    } else {
      const { element: childElement, handleChild } = _toReactElement(child, childrenElement);
      childWasHandled = childWasHandled || handleChild;
      children.push(childElement);
    }
  }
  return {
    element: createElement(elementType, maybeProps, ...children),
    handleChild: childWasHandled,
  };
}

export function toReactElement(
  structure: DOMOutputSpec,
  childrenElement?: ReactNode,
): ReactElement {
  const { element, handleChild } = _toReactElement(structure, childrenElement);
  if (!handleChild) {
    if (Children.count(childrenElement) === 0) {
      return element;
    }
    const children = [childrenElement];
    if (element.props && element.props.children) {
      children.push(element.props.children);
    }
    return cloneElement(element, undefined, ...children);
  }
  return element;
}

function gatherToDOM<Type extends Mark | ProsemirrorNode>(
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
  const result = gatherToDOM<ProsemirrorNode>(schema.nodes);
  if (!result.text) {
    result.text = (node: ProsemirrorNode) => node.text as string;
  }
  return result;
}

function marksFromSchema(schema: Schema) {
  return gatherToDOM<Mark>(schema.marks);
}

function createNodeComponent(
  name: string,
  toDom?: ProsemirrorNode['type']['spec']['toDOM'],
): FunctionComponent<NodeComponentProps> {
  const Component: FunctionComponent<NodeComponentProps> = ({ node, children }) => {
    if (!toDom) {
      return null;
    }
    const spec = toDom(node);
    return toReactElement(spec, children);
  };

  Component.displayName = name;

  return Component;
}

function createMarkComponent(
  name: string,
  toDom?: Mark['type']['spec']['toDOM'],
): FunctionComponent<MarkComponentProps> {
  const MarkComponent: FunctionComponent<MarkComponentProps> = ({ mark, inline, children }) => {
    if (!toDom) {
      return null;
    }
    const spec = toDom(mark, inline);
    return toReactElement(spec, children);
  };

  MarkComponent.displayName = name;

  return MarkComponent;
}

export function createDomSerializer<S extends Schema>(schema: S): DOMSerializer<S> {
  const nodes = nodesFromSchema(schema);
  const marks = marksFromSchema(schema);

  const nodeComponentsCache = new Map<string, FunctionComponent<NodeComponentProps>>();
  const markComponentsCache = new Map<string, FunctionComponent<MarkComponentProps>>();

  for (const [nodeName, toDom] of Object.entries(nodes)) {
    const NodeComponent = createNodeComponent(nodeName, toDom);
    nodeComponentsCache.set(nodeName, NodeComponent);
  }

  for (const [markName, toDom] of Object.entries(marks)) {
    const MarkComponent = createMarkComponent(markName, toDom);
    markComponentsCache.set(markName, MarkComponent);
  }

  return {
    getNodeComponent(node): FunctionComponent<NodeComponentProps> {
      const NodeComponent = nodeComponentsCache.get(node.type.name);
      if (!NodeComponent) {
        throw new Error('No node component found');
      }
      return NodeComponent;
    },
    getMarkComponent(mark): FunctionComponent<MarkComponentProps> {
      const MarkComponent = markComponentsCache.get(mark.type.name);
      if (!MarkComponent) {
        throw new Error('No mark component found');
      }
      return MarkComponent;
    },
  };
}
