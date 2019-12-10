import { Schema } from 'prosemirror-model';
import React, {
  createContext,
  memo,
  NamedExoticComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { createDomSerializer } from './dom-serializer';
import { DOMSerializer } from './types';

const DOMSerializerDummy: DOMSerializer = {
  getNodeComponent: () => () => <>You need to create a DOM serializer</>,
  getMarkComponent: () => () => <>You need to create a DOM serializer</>,
};

const Context = createContext<DOMSerializer>(DOMSerializerDummy);

interface Props {
  schema: Schema;
}
const useDOMSerializerFromSchema = <S extends Schema>(schema: S): DOMSerializer<S> | null => {
  const [domSerializer, setDomSerializer] = useState<DOMSerializer<S> | null>(null);

  useEffect(() => {
    setDomSerializer(createDomSerializer(schema));
  }, [schema]);

  return domSerializer;
};

export const DOMSerializerProvider: NamedExoticComponent<PropsWithChildren<Props>> = memo(
  ({ schema, children }) => {
    const domSerializer = useDOMSerializerFromSchema(schema);
    if (!domSerializer) {
      return null;
    }
    return <Context.Provider value={domSerializer}>{children}</Context.Provider>;
  },
);

DOMSerializerProvider.displayName = 'DOMSerializerProvider';
export const useDOMSerializer = () => useContext(Context);
