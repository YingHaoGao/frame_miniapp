// pages/essay/essay.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 储存聊天内的所有图片
    imageList: []
  },

  options:{
    styleIsolation:'apply-shared'
  },

  // 滚动事件
  bindscroll() {

  },

  // 展示图片预览
  previewImg(e) {
    let index = app.globalData.UTIL.getNodeSetData(e, 'imgidx');
    let { imageList } = this.data;

    wx.previewImage({ urls: imageList, current: index })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})