//index.js
var Bmob = require('../../utils/bmob.js');
var { TimeDifference,dateToString,showDate } = require('../../utils/tool.js');
//获取应用实例
const app = getApp()



var pageSign =0 //记录分页累计数
var pageNum = 30 //每次获取的条数
var limit

Page({
  data: {
    initFinish:false,//初始化状态
    type:1,//记录类型 1：好习惯，2：坏习惯
    dataList:[],
    endData:false,
  },

  onLoad: function (options) {
    this.setData({
      type: parseInt(options.type)
    })
    this.initUserData()
  },
  //1.初始化用户信息
  initUserData:function () {
    //User已存在
    if(app.User !=null){
      this.setData({
        User: app.User,
        hasUserInfo: true,
        initFinish:true
      })
      this.getDataRecord()
    }

    //User不存在，新获取后回调，如果已获取用用户信息则不执行
    app.UserCallBack = res => {
      console.log("index 执行回调")
      this.setData({
        User: res,
        hasUserInfo: true,
        initFinish:true
      })
      this.getDataRecord()
    }

  },
  //2.获取数据
  getDataRecord(){
    var that = this
    var type = this.data.type,
        id = app.User.id
    var Record = Bmob.Object.extend("habit_record_list");
    var query = new Bmob.Query(Record);

    query.equalTo("creatorId", id);
    query.equalTo("type", type);
    query.limit(300);
    query.descending('updatedAt');
    query.find({
      success: function(res) {
        console.log("查找成功")
        console.log(res)

        that.setData({
          dataList: that.dataFilter(res),
        })

      },
      error: function(res, error) {
        console.log("查找失败")
        console.log(error)

      }
    });
  },
  //3.抽取筛选相同记录
  dataFilter(res){
    var arr = res.concat()
    for (var i=arr.length-1; i>=0; i--)
    {
      var targetNode = arr[i].attributes.itemId;
      for (var j=0; j<i; j++)
      {
        if(targetNode == arr[j].attributes.itemId){
          arr.splice(i,1);
          break;
        }
      }
    }

    for (var i = 0; i < arr.length; i++) {
      var num = 0
      for (var j = 0; j < res.length; j++) {
        if (res[j].attributes.itemId == arr[i].attributes.itemId) {
          num++
        }
      }
      arr[i].attributes.count = num
    }

    arr = this.computeDay(arr)
    return arr

  },
  //计算最距今天数
  computeDay (arr) {
    if (!Array.isArray(arr)) {
      return
    }

    var time2 = dateToString(new Date())
    var time0 = showDate(0) + ' 04:00:00'
    arr.forEach(function (item, index) {
      var time1 = item.createdAt
      var fen = TimeDifference(time1,time2)
      var tian =  Math.floor(fen / 60 / 24)
      item.attributes.lastDay = tian

      var fen2  = TimeDifference(time0,time2)
      if (fen < fen2) {
        item.attributes.lastDay = '今天'
      }

    })

    return arr
  },




  //linkTo 单项记录
  linkHabitItemList(e){
    console.log(e.target.dataset)
    // wx.navigateTo({
    //   url: '/pages/habitItemList/habitItemList'
    // })
  },


})
