/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ExcludesFromSchema<N = any, M = any> {
  nodes?: N[];
  marks?: M[];
}

export interface BuilderBase<Name extends string, Build, N = any, M = any> {
  getName(): Name;
  build(excludes?: ExcludesFromSchema<N, M>): Build | null;
}
