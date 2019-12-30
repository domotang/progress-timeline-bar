var debug = process.env.NODE_ENV !== "production";
const path = require("path");
var Visualizer = require("webpack-visualizer-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "src/index.html")
});
console.log(process.env.NODE_ENV);
module.exports = {
  // performance: {
  //   hints: "warning",
  //   maxEntrypointSize: 212000,
  //   maxAssetSize: 212000
  // },
  // entry: path.join(__dirname, "src/index.js"),
  entry: {
    index: path.join(__dirname, "src/index.js"),
    cont: path.join(__dirname, "src/lib/PTBController.js"),
    template: path.join(__dirname, "src/lib/PTBTemplateMaterial.js"),
    animations: path.join(__dirname, "src/lib/pTBMaterialAnimations.js"),
    tmpComponents: path.join(__dirname, "src/lib/pTBMaterialComponents.js"),
    globe: path.join(__dirname, "src/lib/ne_110m_land.json")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    // filename: "[name]bundle.js"
    // filename: "bundle.js"
    chunkFilename: "[name].bundle.js"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  devtool: debug ? "inline-source-map" : false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|jpg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      }
    ]
  },
  // plugins: [htmlWebpackPlugin, new Visualizer()],
  plugins: [htmlWebpackPlugin],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    inline: true,
    writeToDisk: false,
    hot: true
  }
};
