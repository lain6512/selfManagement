//index.js
var Bmob = require('../../utils/bmob.js');
//获取应用实例
const app = getApp()



var pageSign =0 //记录分页累计数
var pageNum = 30 //每次获取的条数
var limit

Page({
  data: {
    initFinish:false,//初始化状态
    dataList:[],
    endData:false,
  },

  onLoad: function (options) {
    this.getDataRecord()
  },
  onShow: function () {
    // pageSign = 0
    // this.setData({
    //   endData: false,
    //   dataList: [],
    // })
    // this.getDataRecord()
  },
  //获取数据
  getDataRecord(){
    var that = this
    var Record = Bmob.Object.extend("dynamic_user");
    var query = new Bmob.Query(Record);

    query.skip(pageSign);//
    query.limit(pageNum);
    query.notEqualTo('isOpen', '0');
    query.descending('updatedAt');
    query.find({
      success: function(object) {
        console.log("查找成功")
        console.log(object)

        object.forEach(function (item, index) {
            item.attributes.info.date = item.attributes.info.date.substring(0,10)
          if (item.attributes.type =='3') {
            item.attributes.info.num = that.random(1,4)
          } else {

          }
        })

        if(object.length < pageNum){
          that.setData({
            endData: true,
          })
        }

        that.setData({
          dataList: that.data.dataList.concat(object),
        })

        pageSign = pageSign + pageNum
        // wx.hideLoading()


      },
      error: function(object, error) {
        console.log("查找失败")
        console.log(error)

      }
    });
  },
  //上拉到底
  onReachBottom: function () {
    if(this.data.endData){
      return
    }
    // wx.showLoading()
    this.getDataRecord()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    pageSign =0
    this.setData({
      dataList: [],
      endData:false
    })
    setTimeout(function (){
      this.getDataRecord()
    }.bind(this), 500)

  },

  //随机区间整数
  random(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
  },



})
