const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  return [{
    /*
     * client.js
     */
    plugins: [
      new webpack.DefinePlugin({
        'PRODUCTION': env.production ? true : false,
        'STAGING': env.staging ? true : false,
        'DEVELOPMENT': env.development ? true : false,
      })
    ],
    context: path.resolve(__dirname, 'src'),
    entry: {
      client: './client.js',
    },
    output: {
      filename: 'client.js',
      path: path.resolve(__dirname, 'dist')
    }
  },{
    /*
     * service-worker.js (+polyfills)
     */
    plugins: [
      new webpack.DefinePlugin({
        'PRODUCTION': env.production ? true : false,
        'STAGING': env.staging ? true : false,
        'DEVELOPMENT': env.development ? true : false,
      })
    ],
    context: path.resolve(__dirname, 'src'),
    entry: {
      'service-worker': './service-worker.js',
      'serviceworker-cache-polyfill': './serviceworker-cache-polyfill.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
    }
  },{
    /*
     * styles.css
     */
    context: path.resolve(__dirname, 'src'),
    entry: {
      styles: './styles.scss',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'compiled_css_module.js',
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].css'
      })
    ],
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader',
            'sass-loader'
            ]
          })
        }
      ]
    }
  },{
    /*
     * server.js
     */
    target: 'node',
    node: false,
    externals: [nodeExternals()],
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'PRODUCTION': env.production ? true : false,
          'STAGING': env.staging ? true : false,
          'DEVELOPMENT': env.development ? true : false,
        }
      })
    ],
    context: path.resolve(__dirname, 'src'),
    entry: {
      server: './server.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'server.js'
    }
  },{
    /*
     * index.html
     */
    context: path.resolve(__dirname, 'src'),
    entry: {
      index: './index.html'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'compiled_html_module.js'
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [{
            loader: 'file-loader',
            options: {
                name: '[name].html',
            },
          },{
            loader: 'extract-loader',
          },{
            loader: 'html-loader',
            options: {
              minimize: argv.mode === 'production',
              removeComments: argv.mode === 'production',
              collapseWhitespace: argv.mode === 'production'
            }
          }]
        }
      ]
    }
  }]
};
