// eslint规范配置文件
module.exports = {
    // 代码运行环境
    env: {
        browser: true,
    },
    // 继承（某些现有规范，如eslint-config-standard）
    // 插件的某些规范也要在extends配置,形式如： plugin: 插件名
    extends: [],
    // 插件（某些特殊语法的支持,如vue，提供额外的rules）
    plugins: [],
    parser: '@babel/eslint-parser', // 解决eslint不支持import等在非顶层使用
    // 解析配置
    parserOptions: {
        ecmaVersion: 6, // 配置语言版本
        sourceType: 'module', // 配置模块化模式
        allowImportExportEverywhere: true, // 不限制eslint对import使用位置
    },
    // 具体规则（大部分开/关规则值为 0代码关闭， 1代表警告， 2代表开启）
    // rules优先级高于extends和plugins的规则
    rules: {},
};
