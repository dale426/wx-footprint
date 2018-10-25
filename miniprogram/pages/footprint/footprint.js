var app = getApp();
Page({
  data: {
    latitude: 30.259609,
    longitude: 120.130257,
    scale: 18,
    ad_info: {}, // 当前位置名称
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
  onLoad: function () {
  },

  onReady: function (e) {
    // 获取登录信息
    wx.getStorage({
      key: 'openid',
      success(res) {
        app.globalData.openid = res.data || null
      }
    })
    this.mapCtx = wx.createMapContext('myMap');
    this.queryLocationInfo()
  },
  // 查询位置信息
  queryLocationInfo: function () {
    app.getUserLocatiton().then(res => {
      console.log(res)
      this.setData({
        ad_info: res,
        latitude: res.location.lat,
        longitude: res.location.lng,
      })
    })
  },
  // 移动到当前位置
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
    this.setData({
      scale: this.data.scale === 18 ? 14 : 18
    });
    this.queryLocationInfo()
  },

  // 移动视图
  translateMarker: function () {
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
  includePoints: function () {
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
  addPosition: function () {
    if (app.globalData.openid) {
      let ad_info = this.data.ad_info
      wx.navigateTo({
        url: '/pages/add-position/form-position',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
  }
})