// This is only basic styles for typescript for react need to extend this
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins:  [
    'react'
  ],
  rules: {
    "react/jsx-uses-react": ["error"]
  },
  settings: {
    react: {
      pragma: 'createElement'
    },
  },
};
