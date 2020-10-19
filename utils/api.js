//接口集合
let httpUrl = {
  /* account */
  // 获取用户关注列表
  "getAttention": "/api/user/attention",
  // 获取/更新 用户基本信息
  "getUser": "/api/user",
  // 获取他人用户基本信息
  "getOtherUser": "/api/user/",
  // 用户详细信息
  "userDetailedInfo": "/api/user/userDetailedInfo",
  // 获取图片上传凭证
  "imageCredentials": "/api/images/credentials/",
  // 补全image信息
  "matchingImage": "/api/images/matching",
  // 更新用户封面
  "updatacover": "/api/user/cover/",
  // 更新用户头像
  "updataheadImage": "/api/user/headImage/",
  // 获取用户收藏的文章列表
  "collectionArticle": "/api/article/collect",
  // 获取用户收藏的悬赏列表
  "collectionReward": "/api/rewardDemand/collect",
  // 获取文章列表
  "articleList": "/article",
  // 获取悬赏列表
  "rewardList": "/rewardDemand",
  // 获取用户关注列表
  "attentionList": "/api/user/attention",
  // 获取用户粉丝列表
  "followList": "/api/user/follow",
  // 关注用户
  "postFollow": "/api/user/follow/",
  // 取消关注用户
  "postUnFollow": "/api/user/unFollow/",

  /* app */
  // 获取他人用户信息
  "getOtherUser": "/user/",
  // 获取星球信息
  "getCelestialBody": "/celestialBody/",
  // 获取星域内的数据
  "getCelestialBodyStarDomain": "/celestialBody/starDomain/",
};

export default {
  httpUrl: httpUrl
}