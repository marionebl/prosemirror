const { defaults: tsjPreset } = require('ts-jest/presets');
const packageName = require('./package.json').name.split('@marduke182/').pop();

module.exports = {
  transform: {
    ...tsjPreset.transform,
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  testMatch: ['**/__tests__/*.+(ts|tsx|js)'],
  modulePaths: [
    `<rootDir>/src/`,
  ],
  moduleDirectories: [
    'node_modules',
  ],
  name: packageName,
  displayName: packageName,
  rootDir: './',
};
