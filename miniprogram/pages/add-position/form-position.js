// pages/add-position/form-position.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyArr: [{
      name: '饭',
    },
    {
      name: '约'
    },
    {
      name: '影'
    },
    {
      name: '旅游'
    },
    {
      name: '心情'
    },
    {
      name: '其他'
    }
    ],
    classifySelected: [], // 选择分类
    imgList: [],  //  图片列表
    sentiment: '', //感想富文本
    displayDelBtn: false, // 删除按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  checkClassify: function (event) {
    let { name } = event.currentTarget.dataset;
    let { classifyArr, classifySelected } = this.data
    classifyArr.forEach(item => {
      if (item.name === name) {
        if (item.className === 'active') {
          item.className = '';
          var index = classifySelected.indexOf(name)
          classifySelected = [...classifySelected.slice(0, index), ...classifySelected.slice(index + 1, classifySelected.length)]
        } else {
          if (classifySelected.length >= 2) {
            wx.showToast({
              title: '分类最多同时选择两个',
              icon: 'none'
            })
          } else {
            item.className = 'active';
            classifySelected.push(item.name)
          }
        }
      }
    })
    this.setData({
      classifyArr,
      classifySelected
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  uploadImg: function () {
    let _this = this
    wx.chooseImage({
      count: 3,
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        let {imgList} = _this.data
        imgList = imgList.concat(tempFilePaths)
        _this.setData({ imgList})
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            const data = res.data
            console.log("data", data)
            //do something
          }
        })
      }
    })
  },
  // 显示删除按钮
  showDelBtn: function() {
    let { displayDelBtn, imgList} = this.data
    if (!imgList.length) {
      return
    }
    displayDelBtn = !displayDelBtn
    this.setData({
      displayDelBtn
    })
  },
  deleteImgHandler: function(event) {
    let {imgid} = event.currentTarget.dataset
    let {imgList} = this.data
    imgList = [...imgList.slice(0, imgList.indexOf(imgid)), ...imgList.slice(imgList.indexOf(imgid)+1, imgList.length)]
    this.setData({
      imgList,
      displayDelBtn: !!imgList.length
    })
  }
})