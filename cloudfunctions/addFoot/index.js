// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const db = cloud.database()
  const openid = event.userInfo.openId
  let {
    address,
    city,
    classify,
    companion,
    geo,
    imageList,
    province,
    recommend,
    sentiment,
    topic
  } = event
  let addResult = await db.collection('footList').add({
    data: {
      openid,
      address,
      city,
      classify,
      companion,
      geo: new db.Geo.Point(geo[1], geo[0]),
      imageList,
      province,
      recommend,
      sentiment,
      topic,
      footTime: new Date()
    }
  });
  if (addResult.errMsg === 'collection.add:ok') {
    return addResult
  } else {
    return {
      errMsg:"collection.add:faild"};
  }
}