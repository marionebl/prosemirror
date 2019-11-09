/* @jsx createElement */
import { createElement, docBuilders } from '../index';

const { doc, p, a, h1, ol, li } = docBuilders;

describe('create element', () => {
  test('created same document with jsx or doc builder', () => {
    expect(
      <doc>
        <h1>Hello world</h1>
        <p>
          Hello World <a href={'google'}>Hello World</a>
        </p>
        <ol>
          <li>
            Hello World
            <ol>
              <li>Hello World</li>
            </ol>
          </li>
        </ol>
      </doc>,
    ).toEqual(
      doc(
        h1('Hello world'),
        p('Hello World ', a({ href: 'google' }, 'Hello World')),
        ol(li('Hello World', ol(li('Hello World')))),
      ),
    );
  });
});
