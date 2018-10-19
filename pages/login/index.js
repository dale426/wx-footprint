//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    wx.getUserInfo
  },
  getUserInfo: function (e) {
    console.log('获取的用户信息', e)
    if (e.target.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
        wx.navigateBack()
    }
  }
})
