//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    //顶部高度
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    // 简介文字
    intro: '遨游你内心中的小秘密\n在你的心中总有一个爱好，可能难以启齿，\n可能不敢让别人知道，可能觉得别人会嘲笑你，\n但是内心又挥之不去，\n那这里就是你所需要的地方。\n我们讲不通的圈子进行隔离，\n来吧~ 在上面输入你想要的神秘代码。。。',
    // 爱好列表
    hobbyList: [],
    isLogin: app.globalData.isLogin
  },
  // 获取爱好列表
  getHobbyList() {
    let { UTIL, API } = app.globalData;
    let { random } = UTIL;
    let data = {
      page: 0,
      size: 7
    };

    let list = [
      {
        name: 'asdjlsk',
        img: '../../icon/logo.png'
      },{
        name: 'dddd',
        img: '../../icon/logo.png'
      },{
        name: 'asdjlsk',
        img: '../../icon/logo.png'
      },{
        name: 'asdjlsk',
        img: '../../icon/logo.png'
      },{
        name: 'asdjlsk',
        img: '../../icon/logo.png'
      },{
        name: 'asdjlsk',
        img: '../../icon/logo.png'
      },{
        name: 'asdjlsk',
        img: '../../icon/logo.png'
      },
    ];

    app.REQUEST(API.getAttention, 'GET', data)
    .then(res => {
      let hobbyList = list.map(item => {
        let w = random(30, 100);
        let h = w;
        let font = w / 2;
  
        item.w = w;
        item.h = h;
        item.font = font > 35 ? 25 : font;
  
        return item;
      });
      this.setData({ hobbyList })
    })
  },
  // 搜索
  search() {

  },
  // 跳转子站
  toHobby(e) {
    let hobbyid = e.target.dataset.hobby.id;
    wx.navigateTo({
      url: "/subIndex/pages/home/index?hobbyid=" + hobbyid
    });
  },
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  onLoad() {
    // 全局刷新页面
    app.watch('refresh', this.onLoad);

    this.getHobbyList();
  }
})
