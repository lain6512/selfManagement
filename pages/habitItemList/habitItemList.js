//index.js
var Bmob = require('../../utils/bmob.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    dataList:[],
    itemId:'',
    endData:false,
    pageSign:0,//记录分页累计数
    pageNum:20,//每次获取的条数
    type:'',
  },

  onLoad: function (options) {
    console.log('options')
    console.log(options.id)
    this.setData({
      itemId: options.id,
      type: options.type
    })
    this.getDataRecord()
  },
  //linkTo 全部记录
  linkHabitList(){
    wx.navigateTo({
      url: '/pages/habitList/habitList?type='+this.data.type
    })
  },
  //获取数据
  getDataRecord(){
    var that = this
    var id = this.data.itemId
    var Record = Bmob.Object.extend("habit_record_list");
    var query = new Bmob.Query(Record);
    query.equalTo("itemId", id);
    query.skip(this.data.pageSign);//
    query.limit(this.data.pageNum);
    // query.descending('updatedAt');
    query.find({
      success: function(object) {
        console.log("查找成功")
        console.log(object)

        if(object.length < that.data.pageNum){
          that.setData({
            endData: true,
          })
        }

        that.setData({
          dataList: that.data.dataList.concat(object),
        })

        that.data.pageSign = that.data.pageSign + that.data.pageNum
        wx.hideLoading()


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
    wx.showLoading()
    this.getDataRecord()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      dataList: [],
      endData:false,
      pageSign:0
    })
    this.getDataRecord()
  },



})
