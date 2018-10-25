// pages/add-position/form-position.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyArr: [{
        name: '饭',
        id: '1001'
      },
      {
        name: '约',
        id: '1002'
      },
      {
        name: '影',
        id: '1003'
      },
      {
        name: '旅游',
        id: '1004'
      },
      {
        name: '心情',
        id: '1005'
      },
      {
        name: '其他',
        id: '1006'
      }
    ],
    classifySelected: [], // 选择分类
    imgList: [], //  图片列表
    sentiment: '', //感想富文本
    displayDelBtn: false, // 删除按钮
    ad_info: {},
    latitude: 30,
    longitude: 120
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.getUserLocatiton().then(res => {
      this.setData({
        ad_info: res,
        latitude: res.location.lat,
        longitude: res.location.lng,
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  checkClassify: function(event) {
    let {
      id
    } = event.currentTarget.dataset;
    let {
      classifyArr,
      classifySelected
    } = this.data
    classifyArr.forEach(item => {
      if (item.id === id) {
        if (item.className === 'active') { // 取消选中
          item.className = '';
          var index = classifySelected.indexOf(id)
          classifySelected = [...classifySelected.slice(0, index), ...classifySelected.slice(index + 1, classifySelected.length)]
        } else { // 加入选中
          if (classifySelected.length >= 2) {
            wx.showToast({
              title: '分类最多同时选择两个',
              icon: 'none'
            })
          } else {
            item.className = 'active';
            classifySelected.push(item.id)
          }
        }
      }
    })
    this.setData({
      classifyArr,
      classifySelected
    })
  },
  // item 每张上传图片方法
  uploadImg: function(imgFile) {
    const openid = app.globalData.openid
    let imgName = (Math.random() * 1000 >> 0) + '-' + (+new Date()).toString(16)
    const filePath = imgFile || ''
    const cloudPath = openid + '/' + imgName + imgFile.match(/\.[^.]+?$/)[0]
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
      }).then(res => {
        resolve(res)
      }).then(e => {
        reject(e)
      });
    })
  },
  // 上传图片获取 cloudList
  uploadArr: function() {
    let arr = []
    let {
      imgList
    } = this.data
    imgList.forEach(item => {
      arr.push(this.uploadImg(item))
    })
    return Promise.all(arr).then(res => {
      let cloudImgFileArr = []
      res.forEach(item => {
        cloudImgFileArr.push(item.fileID)
      })
      return Promise.resolve(cloudImgFileArr)
    })
  },
  // 提交文本内容
  formSubmit: function(e) {
    wx.showLoading({
      title: '重踩中...',
    })
    this.uploadArr().then(res => {
      console.log(this.data)
      let {
        recommend,
        city,
        province,
        lat,
        lng
      } = {
        ...this.data.ad_info,
        ...this.data.ad_info.location
      }
      let {
        address,
        companion,
        topic,
        sentiment,
      } = e.detail.value

      let params = {
        address,
        city,
        classify: this.data.classifySelected,
        companion,
        geo: [lat, lng],
        imageList: res || [],
        province,
        recommend,
        sentiment,
        topic
      }
      console.log("params", params)
      wx.cloud.callFunction({
        name: 'addFoot',
        data: params, // [纬度， 经度]
        complete: res => {
          console.log('[云函数]', res)
          wx.hideLoading()
          wx.showToast({
            title: '恭喜，您已经留下足迹~~',
            icon: 'none',
            complete: function() {
              setTimeout( () => {
                wx.switchTab({
                  url: '../../pages/footprint/footprint',
                })
              }, 1000)
            }
          })
        },
        fail: err => {
          // wx.hideLoading()
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    })

  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  // 选择图片
  selectImage: function() {
    let _this = this
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        let {
          imgList
        } = _this.data
        imgList = imgList.concat(tempFilePaths)
        _this.setData({
          imgList
        })
      }
    })
  },
  // 显示删除按钮
  showDelBtn: function() {
    let {
      displayDelBtn,
      imgList
    } = this.data
    if (!imgList.length) {
      return
    }
    displayDelBtn = !displayDelBtn
    this.setData({
      displayDelBtn
    })
  },
  // 删除图片
  deleteImgHandler: function(event) {
    let {
      imgid
    } = event.currentTarget.dataset
    let {
      imgList
    } = this.data
    imgList = [...imgList.slice(0, imgList.indexOf(imgid)), ...imgList.slice(imgList.indexOf(imgid) + 1, imgList.length)]
    this.setData({
      imgList,
      displayDelBtn: !!imgList.length
    })
  }
})