// 本质 - 调用Page()函数，传入配置对象, 实例化页面实例
Page({
  data: {
    paths: [
      { path: '/pages/favor/favor', name: '喜爱'},
      { path: '/pages/lifecycle/lifecycle', name: '生命周期'},
      { path: '/pages/nativeComp/nativeComp', name: '原生组件'},
      { path: '/pages/wxss-rpx/rpx', name: '自适应单位-rpx'},
      { path: '/pages/wxs/wxs', name: 'wxs'},
    ]
  },
  toTargetPage(e) {
    const path = e.target.dataset.path
    if (!path) return
    wx.navigateTo({
      url: path,
    })
  }
})
