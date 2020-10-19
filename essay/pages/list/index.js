// user/pages/collect/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0, 
    selectPerson: true,
    // 文章数据集
    essay: {
      list: [],
      size: 10,
      pages: 1,
      current: 0
    }
  },

  // 获取文章列表
  getEssayList(obj) {
    let that = this;
    let { essay } = that.data;
    let current = 0,
        titleStr = '',
        direction = 'DESC';

    if(obj.detail) {
      current = obj.detail.current || 0;
      obj.detail.titleStr && (titleStr = obj.detail.titleStr);
      obj.detail.direction && (direction = obj.detail.direction);
    }

    app.REQUEST(app.globalData.API.articleList, 'GET', { page: current, size: essay.size, titleStr, direction }, 'app')
    .then(res => {
      if(res.statusCode == 200) {
        that.scrollEssayNode.closeFirstLoad();
        let list = current == 0 ? res.data.content : [ ...that.data.list, ...res.data.content ];

        that.setData({
          essay: {
            ...essay,
            list: list,
            pages: res.data.totalPages,
            current: current + 1
          }
        })
      }
      this.scrollEssayNode.hideLoadMore();
      this.scrollEssayNode.endTriggered();
    })
    .catch(err => {
      this.scrollEssayNode.hideLoadMore();
      this.scrollEssayNode.endTriggered();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 文章滚动组件
    this.scrollEssayNode = this.selectComponent('#scrollEssay');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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