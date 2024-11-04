const path = require('path');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    // filename: 'bundle.[contenthash].js',//別の設定方法
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      //ローダーを適用するルールwebpackのコンパイルについて
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|sass|css)$/i,
        include: path.resolve(__dirname, 'scss'), // 監視フォルダを指定
        use: [MinCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
    new MinCssExtractPlugin({
      filename: 'style.css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'scss'), // scssフォルダにエイリアスを設定
    },
    extensions: ['.ts', '.js', '.sass'],
  },
};
