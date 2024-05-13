const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
// 配置项都是编写在对象中，且需使用CommonJS模块化导出
module.exports = {
    // 单入口模式
    // entry: './app.js', // 值也可以写为数组，代表多个文件作为同一个入口
    // 多入口模式
    entry: {
        app: './app.js',
        // app2: 'app2.js',
    },
    // 输出文件
    output: {
        path: __dirname + '/dist', // （必须为用绝对路径）
        // 输出文件名(一般形式为输入文件名+每次打包hash值(截图6位)+bundle.js)
        // hash值当任意文件有更改时，hash值会变，避免文件更新浏览器使用旧缓存文件

        // 当使用chunkhash时，只有属于该模块的内容改变时，该chunkhash才会改变，其它文件不变
        // 可以更大限度的利用打包缓存，一定程度上加快打包速度
        // filename: '[name].[hash:6].bundle.js',
        filename: '[name].[chunkhash:6].bundle.js',
    },
    mode: 'production',
    // 开发配置
    devServer: {},
    // 简化功能
    resolve: {
        // 路径别名设置
        alias: {},
        // 文件名简写
        extends: ['.js'],
    },
    // module配置loaders（loader简单来说就是对某种文件的处理方案）
    module: {
        rules: [
            // 每一个对象都是一种loader
            {
                // test：处理哪种文件
                test: /\.js$/,
                // 排除哪些文件
                exclude: /(node_modules|bower_components)/,
                // loader: 使用哪种loader（loader的值只能是字符串，需要配置就使用use属性）
                // loader: 'babel-loader',
                // use: [], // use值是数组，表示这种类型的文件有多个loader处理（最后一个loader先处理 - 倒序）
                use: {
                    loader: 'babel-loader',
                    // babel-loader的配置(方式一：options编写)
                    // options: {
                    //     // 配置转化的配置（@babel/preset-env 一般使用这个）
                    //     presets: [
                    //         [
                    //             '@babel/preset-env',
                    //             {
                    //                 // 指定目标
                    //                 targets: {
                    //                     // 以浏览器为标准
                    //                     browser: [
                    //                         '>1%', // 市场占有率大于1%的浏览器
                    //                         'last 2 versions', // 最后两个版本
                    //                         'not ie<=8', // 不支持ie8以下
                    //                     ],
                    //                 },
                    //             },
                    //         ],
                    //     ],
                    // },
                },
            },
            {
                test: /\.css/,
                // use: ['style-loader', 'css-loader'], // 使用style-loader 将css使用style标签插入到html
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    './myloader/mycss-loader',
                ], // 使用mini-css-extract-plugin插件打包成单独文件
                // scss等扩展语言就是先用对应的loader转换成css，然后再使用上述loader处理
                // 以scss为例：use: [MiniCssExtractPlugin.loader, 'css-loader'， 'sass-loader']（注意test需修改成对应的文件格式）
            },
        ],
    },
    // 插件(一般插件都是一个构造函数，需要在plugins数组中注册)
    plugins: [
        // new Plugin1(),
        new ESLintPlugin(),
        new MiniCssExtractPlugin({
            filename: 'index.bundle.css',
        }),
        new htmlWebpackPlugin({
            template: './index.htm l', // 定义模板
            filename: 'index.html', // 输出文件名称
            chunks: ['app'], // 指定哪些js文件放入到这个打包后的html中
            inject: 'body', // 指定需引入的js存放位置 'body' 或 true表示添加到body里，head 添加到head， false 不引入
            title: 'webpack ejs title', // 定义在html模板中使用的ejs变量
        }),
    ],
    // 优化相关
    optimization: {
        // 压缩css文件
        minimizer: [new CssMinimizerPlugin()],
        // 代码分割
        splitChunks: {
            chunks: 'all', // 代码分割准则：all - 所有都拆分，async - 只拆分异步，initial - 只拆分同步
            // minChunks: 2, // 一个模块重复引用了几次才进行拆分
            // minSize: 0, // 大于这个值的（单位bit）模块才拆分
            cacheGroups: {
                // 当想将第三方库（脚手架的vendor.js等）或其他文件单独打包时，使用cacheGroups选项
                vendor: {
                    test: /[\\/]node_modules[\\/]/, // 匹配node_modules路径的文件
                    filename: 'vendor.[hash:6].js',
                    minChunks: 1,
                    chunks: 'all',
                },
                common: {
                    // 编写此处后上方的可注释掉
                    // 无需写test匹配路径，匹配node_modules路径的文件剩余的文件按这个规则
                    filename: 'common.[hash:6].js',
                    minChunks: 2,
                    chunks: 'all',
                    minSize: 0,
                },
            },
            // 当想将runtime单独打包时，使用runtimeChunk
            runtimeChunk: {
                name: 'runtime.js',
            },
        },
    },
};
