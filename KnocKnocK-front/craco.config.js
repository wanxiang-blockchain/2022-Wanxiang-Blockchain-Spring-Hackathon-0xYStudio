/* craco.config.js */

const CracoVtkPlugin = require("craco-vtk");
const apiMocker = require("mocker-api"); //使用mocker-api库
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const SimpleProgressWebpackPlugin = require("simple-progress-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = {
  devServer: {
    //如果使用mocker-api库
    // before(app) {
    //   apiMocker(app, path.resolve("./mock/index.js"), {});
    // },
    proxy: {
      "/api": {
        target: "http://dongdu.inc.alipay.net/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    // proxy: {
    //   "/static": {
    //     target: "http://dongdu.inc.alipay.net:9000/",
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/static": "/static",
    //     },
    //   },
    //},
  },
  webpack: {
    configure: (webpackConfig, { env: webpackEnv, paths }) => {
      if (webpackEnv === "production") {
        const oneOf = webpackConfig.module.rules.find((rule) => rule.oneOf);
        let newOneOf = oneOf.oneOf.map((element) => {
          // if (element.options?.name?.includes("media")) {
          //   element.options.name =
          //     "static/media/" +
          //     process.env.REACT_APP_VERSION +
          //     "/[name].[hash:8].[ext]";
          // }
          return element;
        });
        webpackConfig.module.rules[1].oneOf = newOneOf;
        webpackConfig.optimization = {
          splitChunks: {
            ...webpackConfig.optimization.splitChunks,
            name: true,
            cacheGroups: {
              vendor: {
                priority: 1, // 优先级配置，优先匹配优先级更高的规则，不设置的规则优先级默认为0
                test: /node_modules/, // 匹配对应文件
                chunks: "initial",
                name: "vendors", // 设置代码分割后的文件名
                minSize: 0,
                minChunks: 1,
              },
            },
          },
        };
        webpackConfig.plugins.map((item) => {
          if (
            item.options &&
            item.options.filename &&
            item.options.filename === "static/css/[name].[contenthash:8].css"
          ) {
            item.options.filename = "static/css/1.0/[name].[contenthash:8].css";
            item.options.chunkFilename =
              "static/css/1.0/[name].[contenthash:8].chunk.css";
          }
        });
        webpackConfig.plugins = [
          ...webpackConfig.plugins,
          new CompressionWebpackPlugin({
            algorithm: "gzip",
            test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
            threshold: 1024,
            minRatio: 0.8,
          }),
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                //warnings: false,
                drop_debugger: true,
                drop_console: true,
              },
            },
            sourceMap: false,
            parallel: true,
          }),
           //new SimpleProgressWebpackPlugin(),
           //new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ];

        webpackConfig.output.publicPath = process.env.REACT_APP_API_CDN_HOST;
        webpackConfig.output.filename =
          "static/js/" +
          process.env.REACT_APP_VERSION +
          "/[name].[contenthash:8].js";
        webpackConfig.output.chunkFilename =
          "static/js/" +
          process.env.REACT_APP_VERSION +
          "/[name].[contenthash:8]chunk.js";
      }

      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoVtkPlugin(),
    },
  ],
};
