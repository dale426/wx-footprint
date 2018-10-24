var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    scale: 18,
    curPositionName: '', // 当前位置名称
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/assets/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/assets/image/location.png'
    }],
    curBtnType: false
  },
  onLoad: function() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'PBJBZ-KV4W2-DDRUK-CGYDF-KD7EO-3UFRU'
    });
  },

  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap');
    this.getUserLocatiton();
  },
  // 移动到当前位置
  moveToLocation: function() {


    this.mapCtx.moveToLocation()
    this.setData({
      scale: this.data.scale === 18 ? 14 : 18
    });
    this.getUserLocatiton(); // 查询位置名字
  },

  // 获取并设置当前位置
  getUserLocatiton() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: res => {
        app.globalData.geo = [res.latitude, res.longitude]
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        this.queryPositionName(res.latitude, res.longitude);
      }
    })
  },
  // 获取位置信息
  queryPositionName(lat, lng) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        console.log('success', res);
        this.setData({
          curPositionName: res.result.formatted_addresses.recommend
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
  // 移动视图
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        // console.log('animation end')
      }
    })
  },
  // 包含所有视图点
  includePoints: function() {
    let _this = this;
    // console.log(_this.data.latitude, '经度', _this.data.longitude)
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: _this.data.latitude,
        longitude: _this.data.longitude,
      }]
    })
  },
  // 跳转添加位置
  addPosition: function() {
    if (app.globalData.openid) {
      wx.navigateTo({
        url: '/pages/add-position/form-position',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index?url=add-position/form-position',
      })
    }
  }
})