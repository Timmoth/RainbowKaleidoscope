const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: [
        'raw-loader',
        'glslify-loader'
      ]
    }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    filename: 'RainbowKaleidoscope.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath:'/dist/',
    library: 'App',
    libraryTarget:'umd', 
    umdNamedDefine: true,
  },
};