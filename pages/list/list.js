//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var Tool = require('../../utils/tool.js');
const app = getApp()
var that;
Page({
  data: {
    overtime:30,//单位：分，多少时间内允许记录

    initFinish:false,//初始化是否完成
    allowRecord:false,//是否允许记录

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    recordList: [],//记录列表
    mentality:{
      value:''
    },//总精神状态
    show_mentality:true,//总精神状态框显示
    temMould:[],
    temMouldType:null,
    state:[
      "基本无法做任何事，请注意身体！健康最重要！",
      "基本无法做任何事，请注意身体！健康最重要！",
      "状态非常糟糕，目前最重要的是休息恢复精神和体能。",
      "状态不是很好，先回复精神才能继续。",
      "勉强能做事，但效率不好，建议先休息。",
      "精神一般，调整下状态就可以继续了。",
      "状态不错，排除干扰后，开始努力吧。",
      "非常的不错的状态，撸起袖子直接开始干吧。",
      "超级好的精神状态，什么干扰都不能阻挡你，行动！",
      "GOOD!  全世界都阻挡不住您的热情了，行动起来！",
    ],

  },
  onLoad: function () {
    console.log("-------------------开始list页面--------------")

    this.userData()
    this.getDataMould()
  },
  onReady: function () {
    // 页面渲染完成
    // common.showTip("标题不能为空", "none");
    //获得article组件
    this.article = this.selectComponent("#article");
  },
  onShow: function () {
    // 页面显示


    /*try {
      var value = wx.getStorageSync('record')
      if (value) {
        console.log("获取缓存")
        console.log(value)

      }
    } catch (e) {
      console.log("获取缓存 失败")
      console.log(e)
    }*/
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  /**
   * 初始化
   */
  //1.获取用户数据
  userData:function () {
    this.setData({
      User: app.User,
      initFinish:false
    })
    app.UserCallBack = res => {
      console.log("执行 Callback 1")
      this.setData({
        User: res,
        hasUserInfo: true
      })
      this.getDataMould()
    }
  },
  //2.获取数据
  getDataMould:function(){
    // console.log("执行 getDataMould（）:")
    // console.log("this.data.User:")
    // console.log(app.Data.itemMould)

    //数据存在
    if(app.Data.itemMould.length > 0){
      this.setData({
        temMould:app.Data.itemMould,
        type:app.Data.itemMouldType
      })
      this.initRecordList(app.Data.itemMould)
      console.log("itemMouldType:"+app.Data.itemMouldType)
      console.log(app.Data.itemMould)
      return
    }


    //数据不存在
    if(this.data.User ==undefined || this.data.User==null){
      // console.log("停止")
      return
    }
    // return
    var that = this;
    var cId = this.data.User.id
    var Mould = Bmob.Object.extend("item_mould_list");
    var query = new Bmob.Query(Mould);

    query.descending('createdAt');
    query.equalTo("creatorId", cId);
    query.find({
      success: function (results) {
        console.log("查找 模板数据 成功")
        console.log(results);

        if(results && results.length>0){
          var arr = app.Data.itemMould = results[0].attributes.itemTypeArr
          var type = app.Data.itemMouldType = results[0].attributes.type
          var itemMouldId = app.Data.itemMouldId = results[0].id
          that.setData({
            temMould:arr,
            type:type
          })
          console.log(app.Data.itemMould)
          that.initRecordList(arr)
        }else{
          //第一次进入
          wx.redirectTo ({
            url: '../itemAdd/itemAdd?isFirst=Y'
          })
        }
      },
      error: function (error) {
        console.log("查找 模板数据 失败")
      }
    });
  },
  //3.初始化记录列表
  initRecordList:function (arr) {

    var recordList = wx.getStorageSync('recordList')
    var val = wx.getStorageSync('mentality').value

    console.log("recordList1")
    console.log(recordList)
    if(recordList !=''){
      console.log("取缓存")
      recordList.forEach(function (item, index) {
        item.show =true
      })
      this.setData({
        recordList: recordList,
        mentality:{
          value:val
        }
      })
    }else{
      var recordArr =[]
      arr.forEach(function (item, index) {
        item.items.forEach(function (n, i) {
          if(n.selected){
            if(n.frequency == undefined){
              n.frequency ='每天'
            }
            if(n.isDelay == undefined){
              n.isDelay = false
            }
            n.show =true
            n.itemTitle =item.title
            recordArr.push(n)
          }
        })
      })

      this.setData({
        recordList: recordArr,
      })
      console.log("recordList2")
      console.log(recordList)
    }
    this.setStorageTime()
  },
  //4.缓存时间是否符合条件，是否允许记录
  setStorageTime:function () {
    var recordTime = wx.getStorageSync('recordTime')
    console.log("recordTime:")
    console.log(recordTime)
    if(recordTime == ''){
      this.setData({
        allowRecord:true,
      })
      return
    }else{
      var date = new Date();
      var time1 = Tool.dateToString(recordTime);
      var time2 = Tool.dateToString(date);
      var n = Tool.TimeDifference(time1, time2);

      if(n>this.data.overtime){
        this.setData({allowRecord:true})
      }else {
        this.setData({allowRecord:false})
        this.setData({initFinish:true})//全部初始化完成！
      }
    }
    console.log('相差时间：'+n+"分钟， allowRecord:"+this.data.allowRecord)


    this.article = this.selectComponent("#article");
  },


  //进入页面逻辑，路线1：跳转到选模板页；2：开始状态选项; 路线3：进入列表；
  /*pageStart:function () {
    if(app.Data.itemMould.length<=0){
      console.log("路线1")
      this.getDataMould()

    }else if(this.data.allowRecord){
      console.log("路线2")
      console.log("app.Data.itemMould")
      this.initRecordList(app.Data.itemMould)

    }else{
      console.log("路线3")
    }
  },*/


  //说明文章弹窗
  showDialog(){
    this.article.showPopupAricle();
  },
  //点击选项
  clickItem:function (e) {
    console.log("点击")
    // console.log(e)

    var index = e.currentTarget.dataset.index
    var value = e.currentTarget.dataset.value
    var arr = this.data.recordList
    arr[index].show =false
    arr[index].value = value
    this.setData({
      recordList:arr
    })

    if(index == 0){
      this.saveDataItem()//最后一条写入数据库
      this.setData({initFinish:true})//全部初始化完成！
    }
  },
  //选项长按
  longPress:function (e) {
    console.log("长按")
    alert("长按")
  },
  //总精神状态选项
  clickMentality:function (e) {
    console.log("点击")
    // console.log(e)
    var obj = this.data.mentality
    obj.value = e.currentTarget.dataset.value
    this.setData({
      mentality:obj,
      show_mentality:false
    })
  },
  //Link编辑选项页
  linkToItemEdit:function (e) {
    var recordList = wx.getStorageSync('recordList')
    // console.log(e.currentTarget.dataset.index)
    // console.log(recordList)
    wx.navigateTo({
      url: '../itemEdit/itemEdit?index='+e.currentTarget.dataset.index
    })
  },

  //记录一条数据
  saveDataItem:function () {

    var that = this
    var type= app.Data.itemMouldType //1:非工作常规日；2：工作日下班后；3，工作日上班时间
    var creatorId = this.data.User.id
    var creatorName = this.data.User.attributes.nickName

    var Record = Bmob.Object.extend("item_record_list");
    var record = new Record();

    record.set('type', type);
    record.set('creatorName', creatorName);
    record.set('creatorId', creatorId);
    record.set("itemArr", this.data.recordList);
    record.set("mentality", this.data.mentality);
    record.save(null,{
      success: function (resData) {
        console.log("添加 记录 成功")
        console.log(resData)
        wx.setStorageSync('recordList', that.data.recordList)
        wx.setStorageSync('mentality', that.data.mentality)
        wx.setStorageSync('recordTime', new Date())
        that.setData({allowRecord:false})
        wx.redirectTo ({url: '../action/action'})

      },
      error: function(result, error) {
        console.log("添加 记录 失败")
        console.log(result)
        console.log(error)

      }
    });

  },
})
