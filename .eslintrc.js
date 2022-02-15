module.exports = {
  root: true,
  env: {
    jest: true,
    node: true,
  },
  ignorePatterns: [
    '/src/client/',
    '/src/client/**',
    '**/node_modules/**',
    '/dist/',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@root', './src'],
          ['@middleware', './src/middleware'],
          ['@models', './src/models'],
          ['@routes', './src/routes'],
          ['@utils', './src/utils'],
          ['@typings', './src/typings'],
        ],
        extensions: ['.ts', '.js'],
      },
    },
  },
  rules: {
    'import/extensions': ['warn', 'never'],
    'import/order': 'off',
    'array-callback-return': ['error', { checkForEach: true }],
    'no-await-in-loop': 'warn',
    'no-constructor-return': 'error',
    'no-duplicate-imports': 'warn',
    'no-self-compare': 'error',
    'no-template-curly-string': 'warn',
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
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
  },
  globals: {
    require: true,
    module: true,
  },
};
