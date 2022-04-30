module.exports = {
  root: true,
  env: {
    jest: true,
    node: true,
  },
  ignorePatterns: ['node_modules', '**/node_modules', 'public', 'jest.config.ts', '**/*.js'],
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: './',
      },
      rules: {
        'import/no-unresolved': 'error',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        'import/extensions': 'off',
      },
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts"]
        },
        "import/resolver": {
          webpack: {
            config: '../../webpack.config.js'
          },
          typescript: {
            alwaysTryTypes: true,
            project: [
              "./tsconfig.json"
            ]
          }
        }
      }
    },
  ],
  rules: {
    'array-callback-return': ['error', { checkForEach: true }],
    'no-await-in-loop': 'warn',
    'no-constructor-return': 'error',
    'no-duplicate-imports': 'warn',
    'no-promise-executor-return': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'warn',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'warn',
    'no-use-before-define': 'error',
    'require-atomic-updates': 'error',

    'block-scoped-var': 'error',
    camelcase: 'error',
    'consistent-return': 'error',
    'default-case': 'error',
    'default-case-last': 'error',
    'default-param-last': 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    'no-console': 'warn',
    'no-else-return': 'warn',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-sequences': 'error',
    'no-shadow': 'error',
    'no-undefined': 'error',
    'no-var': 'error',
    radix: 'error',

    'no-extra-semi': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-unexpected-multiline': 'off',
  },
  globals: {
    require: true,
    module: true,
  },
};
