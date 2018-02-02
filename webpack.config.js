const path = require("path");
const extractor = require("extract-text-webpack-plugin");
const purify = require("purifycss-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "js/bundle.js",
        path: path.resolve(__dirname, "public")
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css"]
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: extractor.loader("style","css") }
        ],
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },

            {
                enforce: "pre",
                test: /\.js$/, loader: "source-map-loader"
            },

            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },

            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },

    plugins: [
        new extractor("[name].css"),
        new purify({
            basePath: "./src",
            paths: [
                "app/views/*.html",
                "app/layout/*.html"
            ]
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        inline: true,
        compress: true
    }
};