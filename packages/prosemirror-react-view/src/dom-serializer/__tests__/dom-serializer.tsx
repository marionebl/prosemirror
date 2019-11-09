import { toReactElement } from '../dom-serializer';
import React from 'react';

describe('dom serializer', () => {
  describe('toReactElement', () => {
    const Text = () => <>foo</>;
    test('should create a paragraph', () => {
      expect(toReactElement(['p', 0], <Text />)).toEqual(
        <p>
          <Text />
        </p>,
      );
    });

    test('should create a link', () => {
      expect(toReactElement(['a', { href: 'http://google.com'}], <Text />)).toEqual(
        <a href="http://google.com">
          <Text />
        </a>,
      );
    });

  });
});
