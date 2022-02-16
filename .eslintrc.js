module.exports = {
  root: true,
  env: {
    jest: true,
    node: true,
  },
  ignorePatterns: [
    'node_modules',
    '**/node_modules',
    '/src/client',
    '/src/public',
    '/dist',
  ],
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  overrides: [
    {
      files: ['src/**/*.js', 'src/**.*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'import'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
  rules: {
    'array-callback-return': ['error', { checkForEach: true }],
    'no-await-in-loop': 'warn',
    'no-constructor-return': 'error',
    'no-duplicate-imports': 'warn',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'warn',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'warn',
    'no-use-before-define': 'error',
    'require-atomic-updates': 'error',

    camelcase: 'error',
    'consistent-return': 'error',
    'default-case': 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    'no-eq-null': 'error',

    'no-extra-semi': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-unexpected-multiline': 'off',
  },
  globals: {
    require: true,
    module: true,
  },
};
