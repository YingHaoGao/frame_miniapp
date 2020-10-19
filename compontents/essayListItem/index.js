// essay/compontents/listItem/index.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: 'Object',
      observer(val) {
        let mark = [];
        
        if(val.integral > 0) {
          if(val.unLock) {
            mark.push({ bgc: 'bg_gray_tint fc_gray', orientation: 'bottom right', title: '已解锁' })
          }
        }
        this.setData({ mark })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mark: [],
    markShow: false,
    type: 'integral'
  },
  
  options:{
    styleIsolation:'apply-shared'
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转个人中心
    toUser(e) {
      let otherId = app.globalData.UTIL.getNodeSetData(e, 'userid');
      
      wx.navigateTo({ url: '/user/pages/otherInfo/index?id=' + otherId })
    },
    // 跳转文章详情
    toEssay(e) {

    },
    // 跳转爱好子站
    toHobby(e) {

    }
  }
})
