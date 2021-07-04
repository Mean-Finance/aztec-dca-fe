const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.ETH_NETWORK': JSON.stringify('ropsten'),
    }),
    new webpack.DefinePlugin({
      'process.env.UNI_GRAPH': JSON.stringify('https://api.thegraph.com/subgraphs/name/alejoamiras/uniswap-v3-ropsten'),
    }),
    new webpack.DefinePlugin({
      'process.env.DCA_GRAPH': JSON.stringify('https://api.thegraph.com/subgraphs/name/alejoamiras/dca-ropsten-stable'),
    }),
    new webpack.DefinePlugin({
      'process.env.ETHERSCAN_API': JSON.stringify('4UTUC6B8A4X6Z3S1PVVUUXFX6IVTFNQEUF'),
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    contentBase: './dist',
    historyApiFallback: true,
  },
});
