module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        es6: true,
        node : true
    },
    extends: 'airbnb-base',
    // add your custom rules here
    'rules': {
        'import/extensions': ['error', 'always', {
            'js': 'never',
            'jsx': 'never'
        }],
        "no-unused-vars": 0,
        "no-useless-constructor": 0,
        "no-useless-escape": 0,
        "class-methods-use-this": "off",
        "comma-dangle": ["error", "only-multiline"],
        "eol-last" : ["error", "never"],
        "indent": ["error", 4, {
            "SwitchCase": 1
        }],
        "global-require": 0,
        "import/prefer-default-export": 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}