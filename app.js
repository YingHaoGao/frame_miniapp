import Api from './utils/api.js';
import config from "./utils/config.js";
import util from "./utils/util.js";

let userInfo = wx.getStorageSync('userInfo');

App({
  onLaunch: function () {
    let _self = this;

    wx.getSystemInfo({
      success: function (res) {
        let modelmes = res.model;
        if (res.platform == "devtools") {
          _self.globalData.system = 'pc';
        } else if (res.platform == "ios") {            
          _self.globalData.system = 'ios';
          
          if (modelmes.search('iPhone X') != -1) {
            _self.globalData.isIphoneX = true
          }
        } else if (res.platform == "android") {            
          _self.globalData.system = 'android';
        }
      }
    })

    // 内存不足监听
    wx.onMemoryWarning((level) => {
      wx.showToast({
        title: '内存警告',
        icon: 'none'
      });
    })
  },
  watch:function(key ,method){
    var obj = this.globalData;
    // 监听 isLogin
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this['_' + key] = value;
        method(value);
      },
      get:function(){
        return this['_' + key]
      }
    })
  },
  globalData: {
    // 全局变量
    isLogin: userInfo && userInfo != "" && userInfo != {},
    userInfo: wx.getStorageSync('userInfo') || {},
    // 设备视图宽度
    width: wx.getSystemInfoSync().windowWidth,
    // 设备视图高度
    height: wx.getSystemInfoSync().windowHeight,
    // 系统：pc、ios、android
    system: false,
    isIphoneX: false,
    // 防止一秒内重复发起请求，储存上次请求地址和时间
    preQuest: {
      // 请求间隔时间
      interval: 1000,
      // 请求地址
      url: '',
      // 上次请求时间
      time: 0
    },
    // showLoading 数据集
    loading: {
      // 展示时间，确保展示时间不会太短
      showTime: 0,
      interval: 1000
    },
    // 工具
    API: Api.httpUrl,
    CONFIG: config,
    UTIL: util
  },
  REQUEST: (url, method, data, wType, params) => {
    let that = getApp();
    let time = new Date().getTime();
    let { preQuest } = that.globalData;
    
    let www = !wType ? 'accounts' : wType;
    let fullUrl = config.url[www] + url;

    let n = 0;

    // 不判断重复操作机制的接口
    let notToastRepetition = [
      that.globalData.API.getUser,
      that.globalData.API.getCelestialBodyStarDomain,
    ];

    const _hideLoading = () => {
      if((new Date().getTime() - that.globalData.loading.time) < that.globalData.loading.interval) {
        setTimeout(() => {
          wx.hideLoading();
        }, that.globalData.loading.interval - (new Date().getTime() - that.globalData.loading.time))
      } else {
        wx.hideLoading();
      }
    }
    const _request = (resolve, reject) => {
      if(preQuest.url == fullUrl
        && preQuest.data == JSON.stringify(data)
        && (time - preQuest.time) < preQuest.interval
        && notToastRepetition.indexOf(url) < 0) {
        wx.showToast({
          title: '请勿重复操作',
          icon: 'none',
          duration: 1500
        });
        return reject({ errorDescription: url + ' --> 重复操作' });
      } else {
        that.globalData.preQuest.time = time;
        that.globalData.preQuest.url = fullUrl;
        that.globalData.preQuest.data = JSON.stringify(data);
      }

      let header = {
        "Content-Type":"application/json",
        "Cookie": that.globalData.userInfo["Set-Cookie"]
      };
      if(params && params["x-server-name"]) {
        header["x-server-name"] = params["x-server-name"];
      }

      wx.request({
        url: fullUrl,
        method: method,
        data: data,
        header: header,
        success: function(res) {
          _hideLoading();

          if (res.statusCode == 200) {
            resolve(res);
          }else if (res.statusCode == '401'){
            that.globalData.isLogin = false;
            that.LOGIN(() => {
              if(n < 2) {
                _request(resolve, reject);
                n ++
              } else {
                wx.showModal({
                  title: '提示',
                  content: '自动登录失败，请手动登录',
                  showCancel: false,
                  confirmText: '我要登录',
                  success() {
                    that.TOHOME(that)
                  }
                })
              }
            });
          }else if (res.statusCode == '404') {

          }else {
            wx.showToast({
              title: res.data.errorDescription,
              icon: 'none'
            })
            reject(res.data);
          }
        },
        fail: (res => {
          wx.hideLoading();
          wx.showToast({
            title: '网络差，请稍后再试！',
            icon: 'none',
            duration: 1500
          })
          reject('网络差，请稍后再试！');
        })
      })
    }

    return new Promise((resolve, reject) => {
      if(!params || !params.hideLoading) {
        that.globalData.loading.time = time;
        wx.showLoading({title: "加载中"});
      }
      _request(resolve, reject);
    })
  },
  UPLOADIMG: (type, filePath, cb) => {
    let app = getApp();
    const hash = new Date().getTime();
    const imgType = filePath.match(/\.(jpg|png)/g)[0];
    
    // 1、获取上传图片凭证
    app.REQUEST(app.globalData.API.imageCredentials + type, 'GET')
    .then(res => {
      // 2、上传阿里云
      wx.uploadFile({
        url: res.data.url,
        filePath: filePath,
        name: 'file',
        formData: {
          key: res.data.prefix + hash + imgType,
          policy: res.data.policy,
          OSSAccessKeyId: res.data.ossAccessKeyId,
          signature: res.data.signature,
          callback: res.data.callback
        },
        success: (_res) => {
          if (_res.statusCode === 200) {
            // 3、补全image
            app.REQUEST(app.globalData.API.matchingImage, 'POST', { ossKey: res.data.prefix + hash + imgType })
            .then(__res => {
              cb && cb(__res.data)
            });
          }
        },
        fail: err => {
          console.log(err);
        }
      });
    })
  },
  PAY: (response) => {
    let app = getApp();

    wx.requestPayment({
      timeStamp: response.data.data.timeStamp,
      nonceStr: response.data.data.nonceStr,
      package: response.data.data.package,
      signType: 'MD5',
      paySign: response.data.data.paySign,
      success(res) {
        /**支付成功后操作 */
        wx.requestSubscribeMessage({
          tmplIds: ['OISpfVqpN7-4Nggx1sfnuOt139qFEeU0-Y_8ABfo644', "zI1Fo3V5ud1id0cww4QcGVwxvvpU8hfwbbl78OrDsGs", "GvQ_jDk2ETQbro-urI8_dKjPJTp68o1MNunbYu-eRfY"],
          success(res) {
            console.log("订阅消息", res)
            if (res['OISpfVqpN7-4Nggx1sfnuOt139qFEeU0-Y_8ABfo644'] == 'accept') {
              console.log("订单支付允许订阅")
            } else {
              console.log("订单支付取消订阅")
            }
            if (res['zI1Fo3V5ud1id0cww4QcGVwxvvpU8hfwbbl78OrDsGs'] == 'accept') {
              console.log("退款允许订阅")
            } else {
              console.log("退款取消订阅")
            }
            if (res['GvQ_jDk2ETQbro-urI8_dKjPJTp68o1MNunbYu-eRfY'] == 'accept') {
              console.log("服务到期允许订阅")
            } else {
              console.log("服务到期取消订阅")
            }

          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: "none",
          duration: 1000,
          mask: true
        })
      }
    })
  },
  LOGIN: (callback) => {
    let app = getApp();
    wx.login({
      success(res) {
        if(res.code) {
          let data = {
            code: res.code
          };
          app.REQUEST('/accounts/signUp/wx?code='+res.code, 'POST',data)
            .then(_res => {
              let userInfo = {};
              userInfo["Set-Cookie"] = _res.header["Set-Cookie"];
              
              if (!userInfo) {
                return;
              }

              app.globalData.userInfo = userInfo;
              app.globalData.isLogin = true;

              app.GETUSER(callback);
            })
        }
      }
    })
  },
  GETUSER: (callback) => {
    let app = getApp();
    app.REQUEST(app.globalData.API.getUser, 'GET')
      .then(res => {
        let userInfo = app.globalData.userInfo;

        app.globalData.userInfo = { ...userInfo, ...res.data };
        wx.setStorageSync('userInfo', app.globalData.userInfo);

        callback && callback(app.globalData.userInfo)
      })
  },
  // 回到首页
  TOHOME: (app) => {
    app = app || getApp();
    let performance = app.globalData.userInfo.performance;
    
    if(performance == 'HIGH') {
      wx.redirectTo({ url: '/universe/pages/home/index' })
    }
    else if(performance == 'LOW') {
      wx.switchTab({ url: '/pages/lowHome/index' })
    }
  }
})