module.exports = {
    devServer: {
        hot: false,
        liveReload: false
    },
    configureWebpack: (config) => {
        // 关闭 webpack 的性能提示
        config.performance = { hints: false };

        // 京东小程序专项优化
        if (process.env.UNI_PLATFORM === 'mp-jd') {
            // 关闭 inline source map（默认 dev 模式会生成 base64 内联 source map，
            // 导致每个 JS 文件膨胀 2-10 倍，vendor.js 从 598KB 暴涨到 2170KB）
            config.devtool = false;

            // 开发模式也启用代码压缩
            // 原因：JD 开发者工具按原始文件大小检查包体积
            config.optimization = config.optimization || {};
            config.optimization.minimize = true;
        }
    }
};
