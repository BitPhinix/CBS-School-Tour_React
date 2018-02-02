const path = require("path");
const WebpackShellPlugin = require('webpack-shell-plugin');


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

    plugins: [
        new WebpackShellPlugin({
                onBuildStart:['css-purge -i "./src/components/autoCompleteContainer.css, ./src/components/floorSelect.css, ./src/components/map.css, ./src/components/navigationSelector.css, ./src/components/navigationSlider.css, ./src/components/searchBar.css, ./src/app.css" -o ./src/bundle.css  && echo Finished the purge! && echo You can find the bundle at: "./src/bundle.css"'],
                //onBuildEnd:['echo Webpack End']
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        inline: true,
        compress: true
    }
};