// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const db = cloud.database()
  const openid = event.userInfo.openid
  return event
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
      address,
      city,
      classify,
      companion,
      geo: new db.Geo.Point(geo[1], geo[0]),
      imageList,
      province,
      recommend,
      sentiment,
      topic
    }
  });
  return addResult
  if (addResult === '1') {}
}