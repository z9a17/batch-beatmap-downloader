/* eslint @typescript-eslint/no-var-requires: "off"  */
const { commonRules } = require("./webpack.rules");
const plugins = require("./webpack.renderer.plugins");
const path = require("path");

const rules = [...commonRules];

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader", options: { importLoaders: 1 } },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          config: path.join(__dirname, "postcss.config.js"),
        },
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    fallback: { domain: false },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
