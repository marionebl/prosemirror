/* eslint-disable @typescript-eslint/no-explicit-any */

import { DOMOutputSpec, Mark, Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import {
  Children,
  cloneElement,
  ComponentType,
  createElement,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';

import { PMEditorProps } from '../types';
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

interface ToReactMethods<Type extends Mark | ProsemirrorNode> {
  deprecatedToDom?: Type['type']['spec']['toDOM'];
  toReact?: ToReact<Type>;
}

// interface EditorPropsWithReact<S extends Schema> = CustomEditor<S>

function gatherToDom<Type extends Mark<S> | ProsemirrorNode<S>, S extends Schema>(
  types: Record<string, Type['type']>,
  plugins?: Plugin<S>[],
): Record<string, ToReactMethods<Type>> {
  const result: Record<string, ToReactMethods<Type>> = {};
  for (const name in types) {
    if (Object.hasOwnProperty.call(types, name)) {
      const toDOM = types[name].spec.toDOM;
      // const toReact = obj[name].spec.toReact as ToReact<Type>;
      result[name] = {};
      if (toDOM) {
        result[name].deprecatedToDom = toDOM;
      }
      //
      // if (toReact) {
      //   result[name].toReact = toReact;
      // }
    }
  }

  if (plugins) {
    for (const plugin of plugins) {
      const { toReact } = plugin.props as PMEditorProps;
      if (toReact) {
        // Check the toReact function passed by this plugin
        for (const name in toReact) {
          // Check if actually exist in our type data
          if (Object.hasOwnProperty.call(types, name) && Boolean(types[name])) {
            if (!result[name]) {
              result[name] = {};
            }
            if (!result[name].toReact) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              result[name].toReact = toReact[name];
            }
          }
        }
      }
    }
  }

  return result;
}

function nodesFromSchema<S extends Schema>(schema: S, plugins?: Plugin<S>[]) {
  const result = gatherToDom<ProsemirrorNode, S>(schema.nodes, plugins);
  // If i dont get any render method for text, I need to create a new one
  if (!result.text.toReact && !result.text.deprecatedToDom) {
    result.text = {
      deprecatedToDom: (node: ProsemirrorNode) => node.text as string,
    };
  }
  return result;
}

function marksFromSchema<S extends Schema>(schema: S, plugins?: Plugin<S>[]) {
  return gatherToDom<Mark, S>(schema.marks, plugins);
}

type ToReact<T extends Mark | ProsemirrorNode> = T extends Mark
  ? MarkComponentType
  : NodeComponentType;
export type PropsWithNode<P> = P & NodeComponentProps;
export type PropsWithMark<P> = P & MarkComponentProps;
export type NodeComponentType<P = {}> = ComponentType<PropsWithNode<P>>;
export type MarkComponentType<P = {}> = ComponentType<PropsWithMark<P>>;

function createNodeComponent<P = {}>(
  name: string,
  toReactMethods: ToReactMethods<ProsemirrorNode>,
): FunctionComponent<PropsWithNode<P>> {
  const Component: FunctionComponent<PropsWithNode<P>> = ({ node, children: _children }) => {
    const { deprecatedToDom, toReact } = toReactMethods;
    // Need to assure at least 1 children for block nodes
    let children = _children;
    if (node.isBlock && Children.count(_children) === 0) {
      children = createElement('br');
    }
    // if toReact exist pass use that component
    if (toReact) {
      return createElement(toReact, { node }, children);
    }

    if (deprecatedToDom) {
      const spec = deprecatedToDom(node);

      return toReactElement(spec, children);
    }

    return null;
  };

  Component.displayName = name;

  return Component;
}

function createMarkComponent(
  name: string,
  toReactMethods: ToReactMethods<Mark>,
): FunctionComponent<MarkComponentProps> {
  const MarkComponent: FunctionComponent<MarkComponentProps> = ({ mark, inline, children }) => {
    const { deprecatedToDom, toReact } = toReactMethods;
    if (!deprecatedToDom && !toReact) {
      return null;
    }

    // if toReact is pass use that component
    if (toReact) {
      return createElement(toReact, null, children);
    }

    const spec = deprecatedToDom!(mark, inline);
    return toReactElement(spec, children);
  };

  MarkComponent.displayName = name;

  return MarkComponent;
}

export function createDomSerializer<S extends Schema>(
  schema: S,
  plugin?: Plugin<S>[],
): DOMSerializer<S> {
  const nodes = nodesFromSchema(schema, plugin);
  const marks = marksFromSchema(schema, plugin);

  const nodeComponentsCache = new Map<string, FunctionComponent<NodeComponentProps>>();
  const markComponentsCache = new Map<string, FunctionComponent<MarkComponentProps>>();

  for (const [nodeName, toReactMethods] of Object.entries(nodes)) {
    const NodeComponent = createNodeComponent(nodeName, toReactMethods);
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
