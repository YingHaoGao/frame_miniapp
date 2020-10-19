// components/dialog/dialog.js
var config = require('../../utils/config');
var app = getApp();
var that;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '微信授权'
    },
    titleColor: {
      type: String,
      value: '#000000'
    },
    logImage: {
      type: String,
      value: '../../icon/logo.png'
    },
    logName: {
      type: String,
      value: '为聚爱'
    },
    content: {
      type: String,
      value: '获得您的公开信息(昵称、头像等)'
    },
    contentColor: {
      type: String,
      value: '#888888'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    userInfo: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 监听 isLogin变化
    watchLogin(e) {
      !e && that.show();
    },
    cancelCallback() {
      this.hide();
      this.triggerEvent('cancel');
    },
    hide() {
      this.setData({
        show: false
      })
    },
    show() {
      this.setData({
        show: true
      })
    },
    onGotUserInfo(e) {
      let that = this;

      wx.login({
        success(res) {
          if(res.code) {
            let data = {
              code: res.code
            };
            app.REQUEST('/accounts/signUp/wx?code='+res.code, 'POST',data)
              .then(_res => {
                console.log(_res)
                let userInfo = JSON.parse(e.detail.rawData);
                userInfo["Set-Cookie"] = _res.header["Set-Cookie"];
                
                if (!userInfo) {
                  return;
                }
                that.setData({
                  userInfo: userInfo
                })
                app.globalData.userInfo = userInfo;
                app.globalData.isLogin = true;
                app.globalData.refresh = new Date();
                wx.setStorageSync('userInfo', userInfo);
                
                that.triggerEvent('confirm', e)
                that.hide();
              })
          }
        }
      })
    }
  },
  lifetimes: {
    attached() {
      that = this;
      app.watch('isLogin', this.watchLogin);
      
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo
      })
    }
  }
})
