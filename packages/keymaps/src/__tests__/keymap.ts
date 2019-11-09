import { Keymap, Mod, KeyCode } from '../keymap';

type Command = () => boolean;

function setup() {
  const boldWithPriority = jest.fn();
  const bold = jest.fn();
  const enterKeymap = new Keymap<Command>();
  const modBKeymap = new Keymap<Command>();
  enterKeymap
    .add([KeyCode.Enter], {
      id: 'default.new.paragraph',
      handler: jest.fn(),
    })
    .add([KeyCode.Enter], {
      id: 'default.split.list',
      handler: jest.fn(),
    });
  modBKeymap
    .add([Mod.Mod, KeyCode.KeyB], {
      id: 'default.id.bold',
      handler: bold,
    })
    .add([Mod.Mod, KeyCode.KeyB], {
      id: 'default.id.bold.with.priority',
      handler: boldWithPriority,
      priority: 10,
    });

  return {
    enterKeymap,
    modBKeymap,
    mocks: {
      bold,
      boldWithPriority,
    },
  };
}

describe('Keymap', () => {
  let modBKeymap: Keymap<Command>;
  let enterKeymap: Keymap<Command>;
  let boldMock: jest.MockedFunction<Command>;

  let boldMockWithPriority: jest.MockedFunction<Command>;

  beforeEach(() => {
    jest
      // @ts-ignore
      .spyOn(global.window.navigator, 'platform', 'get')
      .mockImplementation(() => 'Mac asd');
    ({
      enterKeymap,
      modBKeymap,
      mocks: { bold: boldMock, boldWithPriority: boldMockWithPriority },
    } = setup());
  });

  test('should invoke bold mock', () => {
    modBKeymap.handle({ metaKey: true, code: 'KeyB' } as KeyboardEvent);
    expect(boldMock).toHaveBeenCalled();
  });

  test('should no invoke bold when a high priority handler was resolved before', () => {
    boldMockWithPriority.mockImplementationOnce(() => true);

    modBKeymap.handle({ ctrlKey: true, code: 'KeyB' } as KeyboardEvent);
    expect(boldMock).not.toHaveBeenCalled();
  });

  test('should merge both keymaps', () => {
    const merge = Keymap.merge(enterKeymap, modBKeymap);

    expect(merge.has([KeyCode.Enter])).toBe(true);
    expect(merge.has([Mod.Mod, KeyCode.KeyB])).toBe(true);
  });

  test('should return an info object', () => {
    const merge = Keymap.merge(enterKeymap, modBKeymap);

    expect(merge.info()).toEqual({
      Enter: ['default.new.paragraph', 'default.split.list'],
      'Meta-KeyB': ['default.id.bold.with.priority', 'default.id.bold'],
    });
  });
});
