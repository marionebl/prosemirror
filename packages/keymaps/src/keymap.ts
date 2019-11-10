// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractFunctionArguments<Fn> = Fn extends (...args: infer P) => any ? P : never;
type UnionFromTuple<T> = T extends (infer U)[] ? U : never;
type Enum<T extends object> = T[keyof T];
const Enum = <T extends string[]>(...args: T) => {
  return Object.freeze(
    args.reduce((acc, next) => {
      return {
        ...acc,
        [next]: next,
      };
    }, Object.create(null)) as { [P in UnionFromTuple<typeof args>]: P },
  );
};

export const Mod = Enum('Shift', 'Alt', 'Ctrl', 'Meta', 'Mod');
export type Mod = Enum<typeof Mod>;

export const KeyCode = Enum(
  'KeyA',
  'KeyB',
  'KeyC',
  'KeyD',
  'KeyE',
  'KeyF',
  'KeyG',
  'KeyH',
  'KeyI',
  'KeyJ',
  'KeyK',
  'KeyL',
  'KeyM',
  'KeyN',
  'KeyO',
  'KeyP',
  'KeyQ',
  'KeyR',
  'KeyR',
  'KeyS',
  'KeyT',
  'KeyU',
  'KeyV',
  'KeyW',
  'KeyX',
  'KeyY',
  'KeyZ',
  'Enter',
  'Tab',
);
export type KeyCode = Enum<typeof KeyCode>;

export interface KeymapHandler<T extends Function> {
  id: string;
  handler: T;
  priority?: number;
}

const isMac = () =>
  typeof window.navigator !== 'undefined' ? /Mac/.test(window.navigator.platform) : false;

const isMod = (mod: string): mod is Mod => Object.values(Mod).indexOf(mod as Mod) !== -1;

const isKey = (key: string): key is KeyCode =>
  Object.values(KeyCode).indexOf(key as KeyCode) !== -1;

const defaultCompare = (left: string, right: string) => (left > right ? 1 : right < left ? -1 : 0);

const compareKeys = (left: string, right: string): number => {
  // If are of the same type do a default comparison
  if ((isMod(left) && isMod(right)) || (isKey(left) && isKey(right))) {
    return defaultCompare(left, right);
  }
  // Left is a mod, and the Mod is always less than any key
  if (isMod(left)) {
    return -1;
  }

  // Right is the mod so left is greater than right
  return 1;
};

const getKeymapIdFromEvent = (event: KeyboardEvent): string => {
  const keys = [event.code];
  if (event.ctrlKey) {
    keys.push(Mod.Ctrl);
  }
  if (event.altKey) {
    keys.push(Mod.Alt);
  }
  if (event.metaKey) {
    keys.push(Mod.Meta);
  }
  if (event.shiftKey) {
    keys.push(Mod.Shift);
  }

  return keys.sort(compareKeys).join('-');
};

const createKeymapId = (keys: (KeyCode | Mod)[]): string => {
  return keys
    .map(key => {
      if (key === Mod.Mod) {
        return isMac() ? Mod.Meta : Mod.Ctrl;
      }
      return key;
    })
    .sort(compareKeys)
    .join('-');
};

export class Keymap<T extends Function> {
  static merge<T extends Function>(left: Keymap<T>, right: Keymap<T>): Keymap<T> {
    const keymap = new Keymap<T>();

    const addToKeymap = (final: Keymap<T>, keymapToAdd: Keymap<T>) => {
      for (const [id, handlers] of keymapToAdd._handlers.entries()) {
        const keys = id.split('-') as (KeyCode | Mod)[];
        for (const handler of handlers) {
          final.add(keys, handler);
        }
      }
    };

    addToKeymap(keymap, left);
    addToKeymap(keymap, right);

    return keymap;
  }

  private _handlers = new Map<string, KeymapHandler<T>[]>();

  add(keys: (KeyCode | Mod)[], handler: KeymapHandler<T>): this {
    const keymapId = createKeymapId(keys);
    const handlers = this._handlers.get(keymapId) || [];
    if (handlers.some(({ id }) => id === handler.id)) {
      throw new Error('There is already an handler with this id.');
    }
    handlers.push(handler);

    this._handlers.set(
      keymapId,
      // Sort by priority
      handlers.sort((a, b) => (b.priority || 0) - (a.priority || 0)),
    );

    return this;
  }

  handle(event: KeyboardEvent, ...args: ExtractFunctionArguments<T>): boolean {
    const id = getKeymapIdFromEvent(event);
    const handlers = this._handlers.get(id);
    if (!handlers) {
      return false;
    }

    let wasHandled = false;

    const iter = handlers.values();
    let result = iter.next();
    while (!result.done) {
      const handler: KeymapHandler<T> = result.value;
      if (handler.handler(...args)) {
        wasHandled = true;
        break;
      }
      result = iter.next();
    }

    return wasHandled;
  }

  has(keys: (Mod | KeyCode)[]): boolean {
    const id = createKeymapId(keys);
    return this._handlers.has(id);
  }

  info(): Record<string, string[]> {
    const info: Record<string, string[]> = {};

    for (const [key, handlers] of this._handlers) {
      info[key] = handlers.map(handler => handler.id);
    }

    return info;
  }
}
