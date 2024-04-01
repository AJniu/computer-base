// app.js - 对应官方文档框架部分
// 本质上就是调用了App()函数，传入一个配置对象(注册小程序实例)
// App()函数会返回一个应用实例，在其他文件通过getApp()函数获取
// 注册App时常做事件
// 1.判断小程序进入场景
// 2.监听声明周期
// 3.因为App()实例只有一个，且全局共享（单例对象），所以可以共享一些数据
App({
  // 绑定对应的生命周期函数 - onLaunch 小程序初始化完成触发
    // onLaunch生命周期默认传参options
    onLaunch(options) {
        // 根据options.scene判断进入场景
        console.log(options)
        // 展示本地存储能力，小程序可以直接保存对象而不用转成JSON字符串
        const logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs);

        // 登录
        wx.login({
            success: (res) => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            },
        });
    },
    // 定义全局数据 - 数据不是响应式的，通常共享的都是固定数据
    globalData: {
        userInfo: {
          name: 'polar bear'
        },
    },
});
