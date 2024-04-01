// pages/favor/favor.js - 页面js文件
// Page()函数 - 实例化页面实例
Page({
  // data 相当于Vue的data，不同的是Vue需要的是方法，而此处直接是对象
  data: {
    // 1. 动态数据 - mustache 语法
    msg: 'polar bear favorite',
    // 2. 列表渲染 - 同样需要mustache语法
    games: ['梦幻西游', '问道', '梦幻手游'],
    count: 0, // 当前计数
    listNum: 50,
  },
  // wxml中用到的方法，直接定义对象方法即可（像V3 和 V2的methods）
  increment() {
    // this - 页面实例
    // 调用 setData方法实现页面的响应式更改
    this.setData({
      count: ++this.data.count
    })

    // 直接修改data中的数据，虽然会改变data中的数据，但是页面不会响应式改变（没有像Vue一样做数据劫持）
    // this.data.count++
    // console.log(this.data.count);
  },
  decrement() {
    this.setData({
      count: --this.data.count
    })
  },
  // 监听下拉刷新的特定函数 - onPullDownRefresh
  onPullDownRefresh() {
    console.log(`pull down refresh`);
    // 模拟刷新需要进行的网络请求
    setTimeout(() => {
      // 页面刷新成功后停止下拉刷新
      wx.stopPullDownRefresh({
        // 停止下拉刷新成功回调
        success(res) {
          console.log(`success ->`, res);
        },
        // 停止失败回调
        fail(err) {
          console.log(`fail ->`, err);
        }
      })
    }, 1000);
  },
  // 监听页面到达底部 - onReachBottom - 加载更多等使用
  onReachBottom() {
    console.log(`到达底部了`)
    this.setData({
      listNum: this.data.listNum + 50
    })
  }
})
