const path = require('path');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    // filename: 'bundle.[contenthash].js',//動的にファイル名を返る（一意のハッシュ値を生成）
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
  },
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, 'dist'),
        publicPath: '/dist',
      },
      {
        directory: __dirname,
        publicPath: '/',
      },
    ],
    hot: true,
  },
  devtool: 'eval',
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
        include: [
          path.resolve(__dirname, 'scss'),
          // path.resolve(__dirname, 'src'), // 必要に応じて他のフォルダも指定
        ], // 監視フォルダを指定
        //プラグインを使いcssファルダに出力する
        use: [MinCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  // devtool: 'source-map',
  plugins: [
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
    extensions: ['.ts', '.js', '.scss'],
  },
};
