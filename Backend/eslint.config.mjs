import js from '@eslint/js';

export default [
  js.configs.recommended,

  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'eslint.config.js',
      'src/tests/**/*.js',
      'jest.config.js'
    ]
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },

    rules: {
      'no-duplicate-imports': 'error',

      'no-console': ['error', { allow: ['warn', 'error'] }],

      'dot-notation': 'error',

      'prefer-const': 'error',

      eqeqeq: ['error', 'always'],

      'max-depth': ['warn', 4],

      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error'
    }
  }
];