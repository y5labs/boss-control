const base = require('./webpack-base.js')
const { merge } = require('webpack-merge')
const { DefinePlugin, ProvidePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(base, {
  mode: 'development',
  watch: true,
  // devtool: 'inline-source-map',
  // stats: 'errors-only',
  plugins: [
    new DefinePlugin({
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
})
