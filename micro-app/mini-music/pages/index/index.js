// 本质 - 调用Page()函数，传入配置对象, 实例化页面实例
Page({
  data: {
    paths: [
      { path: '/pages/favor/favor', name: '喜爱'}
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
