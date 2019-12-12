module.exports = () => {
  return {
    // default config
    preset: 'ts-jest',
    globals: {
      'ts-jest': {
        diagnostics: false,
      },
    },
    testMatch: ['**/src/**/__tests__/*.+(ts|tsx|js)', '**/src/**/*.test.+(ts|tsx|js)'],
    moduleDirectories: ['node_modules'],
  };
};
