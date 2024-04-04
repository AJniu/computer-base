// pages/nativeComp/nativeComp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseImageSrc: 'https://ts1.cn.mm.bing.net/th/id/R-C.2a3d19a74231bf8532b4f6dfdb1fa20e?rik=Vh4kqRbFVeHAyQ&riu=http%3a%2f%2fimage.sciencenet.cn%2falbum%2f201205%2f11%2f231343b4u1lgltq41tqpps.jpeg&ehk=uIMTnh%2fR0cqeHK1pvQCnEjwkwU2LsqJfgdoVPKaA73A%3d&risl=&pid=ImgRaw&r=0',
    viewColors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
    inputBindVal: 'bind value',
    isShowComp: true
  },
  // 获取用户信息 - 已废弃
  getUserInfo(e) {
    console.log(e)
  },
  getUserProfile() {
    // 新版本获取用户信息，即支持对象回调，也支持Promise风格
    wx.getUserProfile({
      desc: 'get user profile usage',
      // success(res) {
      //   console.log(res)
      // }
    }).then(res => {
      console.log(res);
    })
  },
  // 获取用户手机号码 - 须企业号才行
  getPhoneNumber(e) {
    console.log(e);
  },
  // 选取图片
  choosePic() {
    // chooseMedia API - 可选取多种文件类型
    wx.chooseMedia({
      mediaType: 'image'  // 表示选择类型为图片
    }).then(res => {
      this.setData({
        chooseImageSrc: res.tempFiles[0].tempFilePath
      })
      console.log();
    })
  }
})