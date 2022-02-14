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
    plugins: [
        '@typescript-eslint',
        'import',
    ],
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
                    [
                        '@root',
                        './src',
                    ],
                    [
                        '@middleware',
                        './src/middleware',
                    ],
                    [
                        '@models',
                        './src/models',
                    ],
                    [
                        '@routes',
                        './src/routes',
                    ],
                    [
                        '@utils',
                        './src/utils',
                    ],
                    [
                        '@typings',
                        './src/typings',
                    ],
                ],
                extensions: [
                    '.ts',
                    '.js',
                ],
            },
        },
    },
    rules: {
        'import/extensions': [
            'warn',
            'never',
        ],
        'array-callback-return': [
            'error',
            { checkForEach: true },
        ],
        'no-constructor-return': 'error',
        'no-unmodified-loop-condition': 'error',
        'require-atomic-updates': 'error',
        'array-bracket-newline': [
            'error',
            { multiline: true },
        ],
        'array-element-newline': [
            'error',
            { minItems: 2 },
        ],
        'function-call-argument-newline': [
            'error',
            'always',
        ],
        indent: [
            'error',
            4,
        ],
        'max-len': [
            'warn',
            { code: 120, ignoreComments: true, ignoreUrls: true },
        ],
        'max-statements-per-line': [
            'warn',
            { max: 1 },
        ],
        'multiline-ternary': [
            'error',
            'always',
        ],
        'no-extra-parens': 'off',
        '@typescript-eslint/no-extra-parens': 'warn',
        'object-curly-newline': [
            'error',
            { multiline: true },
        ],
        'object-property-newline': 'error',
        'no-eq-null': 'error',

    },
    globals: {
        require: true,
        module: true,
    },
};
