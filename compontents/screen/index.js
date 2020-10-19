// compontents/screen/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: 'String',
      value: '搜索'
    },
    isTime: {
      type: 'Boolean',
      value: true
    },
    isSort: {
      type: 'Boolean',
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    search: '',
    time: '时间',
    sortList: [
      { id: 'DESC', title: '顺序' },
      { id: 'ASC', title: '倒序' }
    ],
    sort: { id: 'DESC', title: '顺序' }
  },

  options:{
    styleIsolation:'apply-shared'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击搜索
    searchClick() {
      let { search, sort } = this.data;
      this.triggerEvent('screen', { titleStr: search, direction: sort.id})
    },
    // 输入搜索
    searchInput(e) {
      this.setData({
        search: e.detail.value
      })
    },
    // 日期
    changeTime(e) {
      let { search, sort } = this.data;
      this.setData({
        time: e.detail.value
      })
      this.triggerEvent('screen', { titleStr: search, direction: sort.id})
    },
    // 改变排序规则
    changeSort(e) {
      let that = this;
      let { search, sort } = this.data;
      this.setData({
        sort: that.data.sortList[e.detail.value]
      })
      this.triggerEvent('screen', { titleStr: search, direction: sort.id})
    }
  }
})
