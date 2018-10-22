//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    logged: false,
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.navigateBack()
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  // 获取用户信息
  queryUserInfo: function(res) {
    console.log(res)
    if (res.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.userInfo = res.detail.userInfo
      this.onGetOpenid()
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateBack()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

})