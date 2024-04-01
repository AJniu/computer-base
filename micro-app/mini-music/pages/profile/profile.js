// pages/profile/profile.js
Page({
  data: {
    userInfo: null
  },
  // 在 onLoad()生命周期获取全局数据
  onLoad() {
    // 1. 获取App实例对象
    const app = getApp()
    // 2. 从App实例对象中获取数据
    this.setData({
      userInfo: app.globalData.userInfo
    })
    // console.log(app.globalData.userInfo);
  }
})