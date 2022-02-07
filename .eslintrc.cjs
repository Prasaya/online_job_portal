module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    ignorePatterns: [
        '/src/client/**', '**/node_modules/**',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended', 'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script',
    },
    rules: {
        indent: [
            'error', 4,
        ],
        'linebreak-style': [
            'error', 'unix',
        ],
        quotes: [
            'error', 'single',
        ],
        semi: [
            'error', 'always',
        ],
        'consistent-return': 'off',
        curly: [
            'error', 'all',
        ],
        'arrow-body-style': [
            'error', 'always',
        ],
        camelcase: [
            'error', { properties: 'always' },
        ],
        'dot-notation': [
            'error', { allowPattern: '^[a-z]+(_[a-z]+)+$' },
        ],
        'default-case': 'error',
        eqeqeq: 'error',
        // layout
        'array-bracket-newline': [
            'error', {
                multiline: true,
                minItems: 2,
            },
        ],
        'array-bracket-spacing': [
            'error', 'never',
        ],
        'array-element-newline': [
            'error', { minItems: 2 },
        ],
        'arrow-parens': [
            'error', 'always',
        ],
        'arrow-spacing': [
            'error', {
                before: true,
                after: true,
            },
        ],
        'block-spacing': [
            'error', 'always',
        ],
        'brace-style': [
            'error', '1tbs',
        ],
        'comma-dangle': [
            'error', {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'never',
                exports: 'never',
                functions: 'never',
            },
        ],
        'comma-spacing': [
            'error', {
                before: false,
                after: true,
            },
        ],
        'comma-style': [
            'error', 'last',
        ],
        'eol-last': [
            'error', 'always',
        ],
        'func-call-spacing': [
            'error', 'never',
        ],
        'function-call-argument-newline': [
            'error', 'consistent',
        ],
        'function-paren-newline': [
            'error', 'multiline',
        ],
        'key-spacing': 'error',
        'keyword-spacing': 'error',
        'max-len': [
            'warn', { code: 100 },
        ],
        'max-statements-per-line': [
            'warn', { max: 1 },
        ],
        'no-mixed-spaces-and-tabs': 'error',
        'no-multiple-empty-lines': 'warn',
        'no-trailing-spaces': 'warn',
        'object-curly-newline': [
            'error', {
                multiline: true,
                minProperties: 2,
            },
        ],
        'object-curly-spacing': [
            'warn', 'always',
        ],
    },
    globals: {
        require: true,
        module: true,
    },
};
