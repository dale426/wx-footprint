//app.js
var QQMapWX = require('./utils/qqmap-wx-jssdk.js');
var qqmapsdk;
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'PBJBZ-KV4W2-DDRUK-CGYDF-KD7EO-3UFRU'
    });

  },
  // 获取并设置当前位置 经纬度
  getUserLocatiton() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: res => {
          this.globalData.geo = [res.latitude, res.longitude]
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: (res) => {
              let ad_info = {
                ...res.result.ad_info,
                recommend: res.result.formatted_addresses.recommend
              }
              resolve(ad_info);
            },
            fail: function(res) {
              reject(res);
            },
            complete: function(res) {}
          });
        }
      })
    })
  },
  // 根据经纬度-获取位置信息
  queryPositionName(lat, lng) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        console.log('success', lat, lng, res);
        this.setData({
          ad_info: { ...res.result.ad_info,
            recommend: res.result.formatted_addresses.recommend
          }
        })
      },
      fail: function(res) {
        // console.log('fail', res);
      },
      complete: function(res) {
        // console.log('complete', res);
      }
    });
  },
  wxRequest: function(opts) {
    let cb = opts.success || function() {}
    let {
      url,
      fullUrl,
      params,
      method
    } = opts
    let host = 'http://yulong.com';
    if (!url && !fullUrl) {
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
    geo: [30, 120],
    openid: null
  }
})