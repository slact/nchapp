module.exports = {
  devtool: 'source-map',
  entry: {
    index: "./app/js/index.js",
    documentation: "./app/js/documentation.js"
  },
  output: {
    path: "app/assets/js",
    filename: "[name].js"
  },
  module:{
    rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(node_modules|bower_components)/,
      query: {
        presets: ['latest']
      }
    }]
  }
};
