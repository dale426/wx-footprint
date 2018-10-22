//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
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
  wxRequest: function(opts) {
    let cb = opts.success || function(){}
    let { url, fullUrl, params, method} = opts
    let host = 'http://yulong.com';
    if(!url && !fullUrl) {
      return wx.showToast({
        title: '请求url不能为空！',
        icon: 'none'
      })
    }
    wx.request({
      url: fullUrl ? fullUrl : host + url,
      data: params || {},
      method: method || 'GET',
      success: function(res) {
        cb(res)
      },
      fail: function() {
        wx.showToast({
          title: '服务异常',
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    latitude: 0,
    longitude: 0
  }
})