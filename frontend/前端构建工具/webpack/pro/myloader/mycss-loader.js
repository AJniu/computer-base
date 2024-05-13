module.exports = function (cssCtx) {
    console.log(`mycssloader ->`, cssCtx);
    return cssCtx.replaceAll('0', '1');
};
