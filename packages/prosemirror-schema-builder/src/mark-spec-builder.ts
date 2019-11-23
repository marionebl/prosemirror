import { MarkSpec } from '@marduke182/prosemirror-utils';

import { BuilderBase, ExcludesFromSchema } from './types';
import { isMarkExcluded } from './helpers';

export type BaseMarkSpec<Attrs> = Omit<MarkSpec<Attrs>, 'excludes'>;

export type BuilderMarkSpec<Attrs = {}> = BaseMarkSpec<Attrs> & {
  excludes?: string[];
};

export function createMarkSpecBuilder<Name extends string, Attrs = {}>(
  name: Name,
  spec: BuilderMarkSpec<Attrs> = {},
): BuilderBase<Name, MarkSpec<Attrs>> {
  return {
    getName: (): Name => name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build(excludes?: ExcludesFromSchema<any, any>): MarkSpec<Attrs> | null {
      if (isMarkExcluded(name, excludes)) {
        return null;
      }

      const excludedMarks =
        spec.excludes &&
        spec.excludes.filter(excludedName => !isMarkExcluded(excludedName, excludes));

      return {
        ...spec,
        excludes: excludedMarks && excludedMarks.length > 0 ? excludedMarks.join(' ') : undefined,
      };
    },
  };
}
