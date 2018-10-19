//app.js
App({
  onLaunch: function () {
    // 获取当前位置
    /* wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: res => {
        console.log("this", this)
        this.globalData.latitude = res.latitude
        this.globalData.longitude = res.longitude
      }
    }) */
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    latitude: 0,
    longitude: 0
  }
})