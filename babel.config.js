module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                debug: false,
                modules: false,
                targets: ['ie 11'],
                loose: true
            }
        ]
    ],

    plugins: [
        "@fpipita/babel-plugin-css-tag-postcss",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-optional-chaining",
        "@babel/plugin-transform-classes",
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-proposal-private-property-in-object", { "loose": false }],
        ["@babel/plugin-proposal-private-methods", { "loose": false }],
        "@babel/plugin-transform-spread"
    ]
};

