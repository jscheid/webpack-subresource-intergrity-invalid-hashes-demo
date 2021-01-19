let path = require('path')

let { CleanWebpackPlugin } = require('clean-webpack-plugin')
let CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
let { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity')
let WebpackAssetsManifest = require('webpack-assets-manifest')

let cssnanoConfig = require('./cssnano.config')

let srcDir = path.resolve(__dirname, './src')
let distDir = path.resolve(__dirname, './dist')

let isDevelopment = process.env.NODE_ENV === 'development'
let isProduction = !isDevelopment

let cdnAddress = process.env.CDN_ADDRESS || ''

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  target: 'web',

  mode: isProduction
    ? 'production'
    : 'development',

  devtool: isProduction
    ? 'source-map'
    : 'inline-source-map',

  context: srcDir,

  entry: {
    app: './index.tsx'
  },

  output: {
    crossOriginLoading: 'anonymous',
    hashDigest: 'hex',
    hashDigestLength: 8,
    hashFunction: 'sha256',
    path: distDir,
    publicPath: `${cdnAddress}/`,
    filename: isProduction
      ? 'js/[name].[contenthash].js'
      : 'js/[name].js'
  },

  devServer: {
    contentBase: distDir,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    stats: 'minimal'
  },

  optimization: {
    moduleIds: isProduction
      ? 'deterministic'
      : 'named',

    chunkIds: isProduction
      ? 'deterministic'
      : 'named',

    minimize: isProduction,

    minimizer: [
      '...',
      new CssMinimizerPlugin({
        sourceMap: true,
        minimizerOptions: cssnanoConfig
      })
    ],

    runtimeChunk: {
      name: 'runtime'
    },

    splitChunks: isProduction
      ? {
          chunks: 'async',
          automaticNameDelimiter: '-',
          hidePathInfo: true,
          cacheGroups: {
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-is|prop-types|hoist-non-react-statics|scheduler|object-assign)[\\/]/,
              chunks: 'all'
            }
          }
        }
      : undefined
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          srcDir
        ],
        use: [
          ...(
            !isProduction
              ? [
                  {
                    loader: 'babel-loader',
                    options: {
                      plugins: [
                        'react-refresh/babel'
                      ]
                    }
                  }
                ]
              : []
          ),
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: [
          /\.module\.css$/
        ],
        use: [
          isProduction
            ? MiniCssExtractPlugin.loader
            : 'style-loader',

          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.module\.css$/,
        include: [
          srcDir
        ],
        use: [
          isProduction
            ? MiniCssExtractPlugin.loader
            : 'style-loader',

          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: isProduction
                  ? '[local]-[sha256:hash:base36:5]'
                  : '[path][name]__[local]',
                exportLocalsConvention: 'dashesOnly'
              },
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.woff2?$/,
        include: [
          srcDir
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isProduction
                ? '[path][name].[sha256:contenthash:hex:8].[ext]'
                : '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.tsx'
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: path.resolve(srcDir, './index.html'),
      inject: 'body',
      scriptLoading: 'defer',
      minify: {
        collapseWhitespace: true,
        quoteCharacter: '"',
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),

    new SubresourceIntegrityPlugin(),

    new WebpackAssetsManifest({
      enabled: isProduction,
      output: 'manifest.json',
      integrity: true
    }),

    ...(
      isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash].css'
            })
          ]
        : [
            new ReactRefreshWebpackPlugin()
          ]
    )
  ]
}
