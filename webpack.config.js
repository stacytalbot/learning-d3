const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV;

module.exports = { 
  entry: './src/index.js', 
  output: {
    filename: 'public/site.js' 
  }, 
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      { 
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: env === 'production' } },
            'resolve-url-loader',
            { loader: 'sass-loader', options: { sourceMap: true } }
          ]
        })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),

    new HtmlWebpackPlugin({
      template: './src/test.html',
      filename: 'test.html',
      inject: 'body'
    }),

    new HtmlWebpackPlugin({
      template: './src/marine.html',
      filename: 'marine.html',
      inject: 'body'
    }),

    new ExtractTextPlugin('./public/site.css')
  ]
}