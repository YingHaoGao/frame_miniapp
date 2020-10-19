// compontents/scroll/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 滚动条位置
    scrollTop: {
      type: 'String',
      value: '0rpx'
    },
    // 在设置滚动条位置时使用动画过渡
    scrollWithAnimation: {
      type: 'Boolean',
      value: false
    },
    // 当前页
    current: {
      type: 'Number',
      observer(val) {
        this.hideLoadMore()
      }
    },
    // 总页数
    pages: {
      type: 'Number',
      observer(val) {
        if(val == 0) {
          this.showNotData()
        } else {
          this.hideNotData()
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 没有更多
    notMore: false,
    // 加载更多
    loadMore: false,
    // 暂无数据
    notData: false,
    // 首次加载
    firstLoad: true,
    // 下拉刷新状态
    triggered: true
  },
  // 启动插槽
  options:{
    multipleSlots: true,
    styleIsolation:'apply-shared'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 滚动到底部时触发
    scrolltolower(e) {
      let { pages, current } = this.data;
      
      if(current < pages) {
        this.hideNotMore();
        this.getList(current + 1);
      } else {
        this.showNotMore();
      }
    },
    // 自定义下拉刷新被触发
    refresherrefresh(e) {
      this.getList(0);
    },
    // 加载列表
    getList(current) {
      this.showLoadMore();
      this.triggerEvent("loadList", {current});
    },

    // 完成下拉刷新
    endTriggered() {
      this.setData({ triggered: false });
    },
    // 显示加载更多
    showLoadMore() {
      this.setData({ loadMore: true });
    },
    // 隐藏加载更多
    hideLoadMore() {
      this.setData({ loadMore: false });
    },
    // 显示暂无更多
    showNotMore() {
      this.setData({ notMore: true });
    },
    // 隐藏暂无更多
    hideNotMore() {
      this.setData({ notMore: false });
    },
    // 显示暂无数据
    showNotData() {
      this.setData({ notData: true });
    },
    // 隐藏暂无数据
    hideNotData() {
      this.setData({ notData: false });
    },
    // 关闭首次加载占位
    closeFirstLoad() {
      this.setData({ firstLoad: false })
    }
  },
  attached() {
    this.getList(this.data.current);
  }
})
