const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const OUTPUT_PATH = path.join(__dirname, 'dist');

const copyStatics = {
    forStaticDir: [
        {
            from: path.resolve(
                './src/img/'
            ),
            to: path.join(__dirname, 'dist/img/')
        },{
            from: path.resolve(
                './node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
            ),
            to: path.join(__dirname, 'dist', 'vendor')
        },{
            from: path.resolve(
                './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'
            ),
            to: path.join(__dirname, 'dist', 'vendor')
        },{
            from: path.resolve(
                './node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-ce.js'
            ),
            to: path.join(__dirname, 'dist', 'vendor', 'bundles')
        },{
            from: path.resolve(
                './node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js'
            ),
            to: path.join(__dirname, 'dist', 'vendor', 'bundles')
        },{
            from: path.resolve(
                './node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf.js'
            ),
            to: path.join(__dirname, 'dist', 'vendor', 'bundles')
        },{
            from: path.resolve(
                './node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd.js'
            ),
            to: path.join(__dirname, 'dist', 'vendor', 'bundles')
        },{
            from: path.resolve(
                './node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
            ),
            to: path.join(__dirname, 'dist', 'vendor')
        },{
            from: path.resolve(
                './node_modules/lit/polyfill-support.js'
            ),
            to: path.join(__dirname, 'dist', 'vendor')
        }

    ]
};

module.exports = (env) => {
    const DEBUG = env.NODE_ENV === 'development';

    const baseConfig = {
        entry: {
            main: './src/js/main.js'
        },
        output: {
            filename: '[name].[contenthash].js',
            chunkFilename: '[name].[chunkhash].js',
            path: OUTPUT_PATH,
            publicPath: ''
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],

        },
        optimization: {
            minimize: true
        },

        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({ patterns: copyStatics.forStaticDir }),
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: 'true',
                __VUE_PROD_DEVTOOLS__: 'false',
                __PACKAGE_VERSION__: env.__PACKAGE_VERSION__ ? JSON.stringify(env.__PACKAGE_VERSION__) : JSON.stringify('develop'),
                __SKIP_MOD_ESCAPE_KEY__: env.__SKIP_MOD_ESCAPE_KEY__ ? env.__SKIP_MOD_ESCAPE_KEY__ : true,
                __USE_MARKER_IO__ : env.__USE_MARKER_IO__ ? env.__USE_MARKER_IO__ : false,
                __COMPRESSION_LEVEL__: env.__COMPRESSION_LEVEL__ ? env.__COMPRESSION_LEVEL__ : 0
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[chunkhash].css',
                chunkFilename: '[name].[chunkhash].css'
            }),

            new HtmlWebpackPlugin({
                filename: path.resolve(OUTPUT_PATH, 'index.html'),
                template: path.resolve('./src/index.html'),
                title: "WS-CHAT",
                inject: false,
                minify: true
            }),
            new FaviconsWebpackPlugin({
                logo: './src/img/logo.png',
                mode: 'webapp',
                inject: true,
                favicons: {
                    appName: 'ws-chat',
                    appDescription: 'ws-chat',
                    developerName: '',
                    developerURL: '', // prevent retrieving from the nearest package.json
                    background: '#fff',
                    theme_color: '#ed1b2e',
                }
            }),

        ],
        devtool: 'source-map',
        stats: { errorDetails: true },
        module: {
            rules: [
                {
                    test: /\.highlight\.js$/,
                    use: ['script-loader']
                },{
                    test: /\.js$/,
                    exclude: /[\\/]node_modules[\\/](?!(lit-element|lit-html|compress-json)[\\/]).*/,

                    use: ['babel-loader']
                },{
                    test: /\.ts$/,
                    exclude: /[\\/]node_modules[\\/](?!(lit-element|lit-html|compress-json)[\\/]).*/,

                    use: ['babel-loader', 'ts-loader'],
                },{
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 2
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        "sass-loader"
                    ]
                },{
                    test: /\.(woff2?|ttf|eot|otf|svg)(\?.*)?$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]'
                            }
                        }
                    ]
                },{
                    test: /\.(png|jpe?g|gif|ico|svg)$/i,
                    exclude: /\/fonts\//,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]'
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                disable: DEBUG
                            }
                        }
                    ]
                }
            ]
        }
    };

    const productionConfig = {
        ...baseConfig, ...{
            mode: 'production',
            plugins: [].concat(baseConfig.plugins, [

                new CssoWebpackPlugin(),
            ])
        }
    };

    const developmentConfig = {
        ...baseConfig, ...{
            mode: 'development',
            optimization: {
                minimize: false
            },
            watchOptions: {
                poll: false,
                ignored: ['node_modules/**', 'test/**']
            },
            devServer: {
                hot: false,
                liveReload: true,
                open: true,
                historyApiFallback: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
                },
                host: '0.0.0.0',
                port: '8000'
            }
        }
    };

    switch (env.NODE_ENV) {
        case 'production':
            return productionConfig;

        default:
            return developmentConfig;
    }
};
