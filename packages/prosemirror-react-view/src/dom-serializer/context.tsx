import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { Schema } from 'prosemirror-model';
import { createDomSerializer } from './dom-serializer';
import { DOMSerializer } from './types';

const DOMSerializerDummy: DOMSerializer = {
  serializeNode: () => () => <>You need to create a DOM serializer</>,
  serializeMark: () => () => <>You need to create a DOM serializer</>
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

export const DOMSerializerProvider: FunctionComponent<Props> = ({ schema, children }) => {
  const domSerializer = useDOMSerializerFromSchema(schema);
  if (!domSerializer) {
    return null;
  }
  return <Context.Provider value={domSerializer}>{children}</Context.Provider>;
};

export const useDOMSerializer = () => useContext(Context);
