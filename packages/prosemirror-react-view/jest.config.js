const packageName = require('./package.json')
  .name.split('@marduke182/')
  .pop();

module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      extends: './babel.config.js',
      diagnostics: false,
    },
  },
  testMatch: ['**/__tests__/*.+(ts|tsx|js)'],
  modulePaths: [`<rootDir>/src/`],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleDirectories: ['node_modules'],
  name: packageName,
  displayName: packageName,
  rootDir: './',
};
