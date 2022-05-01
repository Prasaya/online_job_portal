module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
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
    }
};
