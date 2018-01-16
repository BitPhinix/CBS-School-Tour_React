var ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

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

    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        inline: true,
        compress: true
    },

    plugins: [
        new ExtractTextPlugin("css/styles.css")
    ]
};