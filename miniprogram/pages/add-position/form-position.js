// pages/add-position/form-position.js
const app = getApp()

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
    imgList: [], //  图片列表
    sentiment: '', //感想富文本
    displayDelBtn: false, // 删除按钮
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
      name
    } = event.currentTarget.dataset;
    let {
      classifyArr,
      classifySelected
    } = this.data
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
    console.log(e, app);
    return ;
    this.uploadArr().then(res => {
      let params = {
        address: '新洲际餐厅123',
        city: '杭州市',
        classify: ['1002', '1003'],
        companion: '老表123',
        geo: [30, 120],
        imageList: res || [],
        province: '浙江',
        recommend: '杭州市文艺路啦啦啦团队啊',
        sentiment: '这是愉快的一天啊',
        topic: '和那谁的约会'
      }
      wx.cloud.callFunction({
        name: 'addFoot',
        data: params, // [纬度， 经度]
        complete: res => {
          console.log('[云函数]', res)
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