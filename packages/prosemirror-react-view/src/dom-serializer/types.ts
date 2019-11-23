import { Mark, Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import {
  ComponentType,
  ForwardRefExoticComponent,
  NamedExoticComponent,
  PropsWithChildren,
  PropsWithoutRef,
  RefAttributes,
} from 'react';

type ForwardRef<T = any, P = {}> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DOMSerializer<S extends Schema = any> {
  serializeNode(node: ProsemirrorNode<S>): ForwardRef<any, PropsWithChildren<{}>>;

  serializeMark(mark: Mark<S>, inline: boolean): ComponentType | NamedExoticComponent;
}
