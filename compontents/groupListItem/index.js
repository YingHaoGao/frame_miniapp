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
        
        if(val.status == 'LOCKING') {
          mark.push({ bgc: 'bg_gray_tint fc_gray', orientation: 'top right', title: '锁定' })
        }
        if(val.status == 'END') {
          mark.push({ bgc: 'bg_gray_tint fc_gray', orientation: 'top right', title: '结束' })
        }
        if(val.status == 'NORMAL') {
          mark.push({ bgc: 'gb_integral', orientation: 'top right', title: `积分：${app.globalData.UTIL.number_max(val.integral)}` })
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
