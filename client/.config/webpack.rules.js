const nativeModuleRules = [
  {
    test: /\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
];

const commonRules = [
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },

  // Assets
  {
    test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
    type: "asset",
    generator: {
      filename: "assets/[hash][ext]",
    },
    parser: {
      dataUrlCondition: {
        maxSize: 4 * 1024, // 4 KB
      },
    },
  },
];

module.exports = {
  commonRules,
  nativeModuleRules,
};
