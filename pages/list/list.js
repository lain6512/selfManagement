//策略号#01
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
// var Tool = require('../../utils/tool.js');
var Init = require('../../utils/initUserInfo.js');
const app = getApp()
var that;
Page({
  data: {
    overtime:0,//单位：分，多少时间内允许记录
    overtime:1,//单位：分，多少时间内允许记录

    initFinish:false,//初始化是否完成
    allowRecord:true,//是否允许记录
    isShow_zan:false,//点餐弹框显示
    delayFinish:false,

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    delayId:'',
    title:'',

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
      "状态一般，调整下状态就可以继续了。",
      "状态不错，排除干扰后，开始努力吧。",
      "非常的不错的状态，撸起袖子直接开始干吧。",
      "超级好的精神状态，什么干扰都不能阻挡你，行动！",
      "GOOD!  全世界都阻挡不住您的热情了，行动起来！",
    ],
    stateTxt:[
      '干劲十足', // 10
      '异常清醒', // 9
      '非常不错', // 8
      '不错　　', // 7
      '一般　　', // 6
      '有些疲劳', // 5
      '很疲劳　', // 4
      '头晕脑胀', // 3
      '身体异常', // 2
      '生病　　', // 1

    ]

  },
  onLoad: function (options) {
    console.log("-------------------开始list页面--------------")

    var actionBack = false
    if (options.action) {
      actionBack = true
    }
    this.setData({
      delayId:options.delayId,
      title:options.title,
      allowRecord: !actionBack
    })



    let that = this
    // let delayItem = app.Data.delayItem.dataInfo
    Init.user(app,that,state=> {
      that.getDataMould()

      // if (delayItem && delayItem.strategy_01 && delayItem.strategy_01.initMould == true) {
      //   that.getDataMould()
      // } else {
      //   //第一次进入
      //   wx.redirectTo ({
      //     url: '../listEdit/listEdit?delayId=' + this.data.delayId + '&title=' +  this.data.title
      //   })
      // }


    })
  },
  onReady: function () {
  },


  //获取数据
  getDataMould:function(){

    //数据存在
    // if(app.Data.itemMould.length > 0){
    //   console.log('模板数据存在')
    //   this.setData({
    //     temMould:app.Data.itemMould,
    //     type:app.Data.itemMouldType
    //   })
    //   this.initRecordList(app.Data.itemMould)
    //   return
    // } else {
    //   console.log('模板数据不存在')

      //数据不存在
      if(!app.User){
        console.log("停止")
        return
      }
      // return
      var that = this;
      var cId = app.User.id
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
              // temMould:arr,
              type:type
            })

            that.initRecordList(arr)
          }else{
            //第一次进入
            wx.redirectTo ({
              url: '../listEdit/listEdit?delayId=' + that.data.delayId + '&title=' +  that.data.title
            })
          }
        },
        error: function (error) {
          console.log("查找 模板数据 失败")
        }
      });

    // }



  },
  //3.初始化记录列表
  initRecordList:function (arr) {

    var that =this
    // var recordList = wx.getStorageSync('recordList')
    // var val = wx.getStorageSync('mentality').value

    var recordList = app.Data.recordList
    var val = app.Data.mentalityVal

    console.log("recordList1")
    console.log(recordList)

    // if(wx.getStorageSync('delayFinish')==''){
    //   this.setData({
    //     delayFinish: false
    //   })
    // }else{
    //   this.setData({
    //     delayFinish: wx.getStorageSync('delayFinish')
    //   })
    // }

    // console.log("delayFinish:"+this.data.delayFinish)


    if(recordList){
      console.log("--有记录")
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
      console.log("--无记录")

      //合并拖延项
      arr.forEach(function (item, index) {
        if(item.title == app.Data.itemInfoFirst.itemTitle){
          item.items.push(app.Data.itemInfoFirst)
          // console.log('合并：'+ app.Data.itemInfoFirst.itemTitle)
        } else {
          // console.log(' 无合并项')
        }
      })

      // 添加页面选项字段
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
        recordList: recordArr.concat(),
      })
      console.log("recordArr")
      console.log(recordArr)
    }
    this.setData({initFinish:true})
  },




  //说明文章弹窗
  showDialog(){
    this.article.showPopupAricle();
  },
  //点击选项
  clickItem:function (e) {
    // console.log("点击")
    // console.log(e)

    var that =this
    var index = e.currentTarget.dataset.index
    var value = e.currentTarget.dataset.value
    var item = e.currentTarget.dataset.item
    var arr = this.data.recordList
    var isLast = true
    arr[index].show =false
    arr[index].value = value
    this.setData({
      recordList:arr
    })

    // console.log("index:"+index)

    //拖延项
    if(item.isDelay ==true && value=='OK'){
      this.setData({
        isShow_zan:true,
        delayFinish:true
      })
      setTimeout(function () {
        that.setData({
          isShow_zan:false
        })
      },2000)
    }

    if(index== 0){
      this.saveDataItem()//最后一条写入数据库
      this.setData({initFinish:true})//全部初始化完成！
    }else{
      for(var i=index;i>-1;i--){
        console.log("i:"+i+" value:"+arr[i].value)
        if(i-1>=0){
          if(arr[i-1].value =='OK'){
            isLast =true
            // console.log("isLast:"+isLast)
          }else{
            isLast = false
            // console.log("i:"+i)
            // console.log("isLast:"+isLast)
            break
          }
        }else{
          isLast = true
        }
      }
      // console.log("isLast:"+isLast)
      if(isLast){
        this.saveDataItem()//最后一条写入数据库
        this.setData({initFinish:true})//全部初始化完成！
      }
    }
  },

  //总精神状态选项
  clickMentality:function (e) {
    // console.log("点击")
    // console.log(e.currentTarget.dataset.value)

    var obj = this.data.mentality
    obj.value = e.currentTarget.dataset.value
    this.setData({
      mentality:obj,
      show_mentality:false
    })
  },
  //Link 编辑选项页
  linkToItemEdit:function (e) {
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../itemEdit/itemEdit?index='+e.currentTarget.dataset.index
    })
  },
  //Link 拖延项首页
  linkDelayIndex:function () {
    wx.redirectTo({
      url: "../delayHome/delayHome?delayId=" +this.data.delayId
    })
  },
  //LinkTo 行动建议
  linkToAciton:function () {
    wx.redirectTo ({
      url: '../action/action?delayId=' + this.data.delayId + '&title=' +  this.data.title
    })
  },

  //记录一条数据
  saveDataItem:function () {

    var that = this
    var type= app.Data.itemMouldType //1:非工作常规日；2：工作日下班后；3，工作日上班时间
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName

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

        app.Data.recordList = that.data.recordList
        app.Data.mentalityVal = that.data.mentality.value
        wx.redirectTo ({
          url: '../action/action?back=Y&delayId=' + that.data.delayId + '&title=' +  that.data.title
        })

        // console.log("delayFinish:"+that.data.delayFinish)
        // wx.setStorageSync('recordList', that.data.recordList)
        // wx.setStorageSync('mentality', that.data.mentality)
        // wx.setStorageSync('delayFinish', that.data.delayFinish)
        // wx.setStorageSync('recordTime', new Date())

        // that.setData({allowRecord:false})



        // if(that.data.delayFinish == true){
        //
        // }else{
        //   wx.redirectTo ({url: '../action/action'})
        // }

      },
      error: function(result, error) {
        console.log("添加 记录 失败")
        console.log(result)
        console.log(error)

      }
    });

  },
})
