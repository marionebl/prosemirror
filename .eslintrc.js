// This is only basic styles for typescript for react need to extend this
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  settings: {
    'import/resolver': {
      // use a glob pattern
      typescript: {
        alwaysTryTypes: true,
        directory: './packages/*/tsconfig.json',
      },
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ['import', 'simple-import-sort'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    '@typescript-eslint/explicit-function-return-type': 'off', // Revisit this rule oin the future right now is a pain in the...
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/camelcase': 'off',
    // import plugin
    'import/no-unresolved': 'off',
    'import/named': 2,
    'import/no-cycle': 2,
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external', 'internal'], ['sibling', 'parent'], 'index'],
        'newlines-between': 'always',
      },
    ],
    // simple-import-sort
    "simple-import-sort/sort": "error"
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-var-requires': ['error'],
      },
    },
  ],
};
