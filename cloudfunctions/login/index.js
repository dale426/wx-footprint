// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  let userinfo = await db.collection('user').where({
    openid: event.userInfo.openId // 填入当前用户 openid
  }).get();
  if (userinfo.errMsg === "collection.get:ok" && userinfo.data.length) {
    return {
      openid: event.userInfo.openId,
      userType: 'isOld'
    }
  } else {
    let { geo, city, gender, province, nickName, phone } = event
    let addInfo = await db.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openid: event.userInfo.openId,
        registerTime: new Date(),
        province,
        city,
        nickName,
        gender,
        phone: phone || '',
        registerGeo: new db.Geo.Point(geo[1], geo[0]), //经度， 纬度
      }
    })
    if (addInfo.errMsg === "collection.add:ok") {
      return {
        openid: event.userInfo.openId,
        userType: 'isNew'
      }
    }
  }

}
