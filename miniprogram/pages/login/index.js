//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.navigateBack()
      return
    }
    // 获取用户信息
    /*     wx.getSetting({
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
        }) */
  },
  onShow: function() {

  },
  // 获取用户信息
  queryUserInfo: function(res) {
    console.log(res)
    wx.showLoading({
      title: '登陆中...',
    })
    if (res.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.userInfo = res.detail.userInfo
      this.onGetOpenid(res.detail.userInfo)
    }
  },
  onGetOpenid: function(userInfo) {
    // 调用云函数
    console.log({ ...userInfo,
      geo: app.globalData.geo
    })
    wx.cloud.callFunction({
      name: 'login',
      data: { ...userInfo,
        geo: app.globalData.geo
      }, // [纬度， 经度]
      complete: res => {
        console.log('[云函数]', res)
        wx.hideLoading()
        if (res.errMsg === 'cloud.callFunction:ok') {
          app.globalData.openid = res.result.openid
          this.setData({
            logged: true
          })
          try {
            wx.setStorage({
              key: 'openid',
              data: res.result.openid,
            })
          } catch (e) {
            console.log(e)
          }
          // 登录成功跳转到首页
          wx.switchTab({
            url: '../../pages/footprint/footprint',
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '登陆失败，请重试!',
          icon: 'none'
        })
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

})