//index.js
var Init = require('../../utils/initUserInfo.js');
//获取应用实例
const app = getApp()
var Tool = require('../../utils/tool.js');
var Bmob = require('../../utils/bmob.js');

Page({
  data: {
    initFinish:false,//初始化状态
    finishDelay:false,//延迟项数据状态
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    timeR:'1',//作为记录的时间，凌晨4点前为昨天，凌晨4点后为今天
    isSleepRecord:true,//是否允许早睡打卡
    isGetUpRecord:true,//是否允许早起打卡
    isShowSleep:false,//打卡动画
    isShowGetUp:false,//打卡动画
    delayItemArr:[]

  },
  onLoad: function () {

  },
  onShow:function () {
    let that = this
    Init.user(app,that,state=> {
      // console.log('app.User:')
      // console.log(app.User)
      that.updateSateRecord()
      that.timeRCompute()
      that.getDataDelay()

    })

  },
  onReady:function () {

  },

  //获取延迟项数据
  getDataDelay () {
    var that = this
    var type = 0,
        objectId = app.User.id
    var Record = Bmob.Object.extend("delay_list");
    var query = new Bmob.Query(Record);

    console.log('app.User')

      console.log(app.User)
    query.equalTo("finish", 0);
    query.equalTo("creatorId", objectId);
    query.equalTo("type", type);
    query.limit(30);
    query.descending('updatedAt');
    query.find({
      success: function(res) {
        console.log("查找成功")
        console.log(res)

        that.setData({
          delayItemArr: res,
          finishDelay: true
        })

      },
      error: function(res, error) {
        console.log("查找失败")
        console.log(error)

      }
    });
  },

  btnClick:function(e){
    Init.upDateNickName(app,e).then(res=>{
      console.log('保存后then（）执行')
      console.log("app.User:")
      console.log(app.User)
    })
  },
  //linkTo 新增拖延项
  linkDelayAddItem: function() {
    wx.navigateTo({
      url: '../delayAddItem/delayAddItem'
    })
  },
  //linkTo 早睡早起记录
  linkRecordSignIn: function(e) {
    wx.navigateTo({
      url: "/pages/recordSignIn/recordSignIn?type="+e.target.dataset.type
    })
  },
  //linkTo 记录好/坏习惯
  linkHabitAdd: function(e) {
    wx.navigateTo({
      url: "/pages/habitAdd/habitAdd?type="+e.target.dataset.type
    })
  },
  //linkTo 我的目标
  linkTarget: function(e) {
    wx.navigateTo({
      url: "/pages/tool/target/target"
    })
  },
  //linkTo 拖延项
  clickItem: function(e) {
    console.log(e.target.dataset)
    wx.navigateTo({
      url: "/pages/delayHome/delayHome?delayId="+e.target.dataset.id
    })
  },


  //判断是否可以发卡
  allowCard (timeName) {

    var today = Tool.showDate(0) // 今天日期 2018-01-01
    var time0Str = Tool.dateToString(new Date())  // 当前时间str 2018-01-01 10:30:00
    var time1 = wx.getStorageSync(timeName) //上一次记录的时间str 2018-01-01 10:30:00
    console.log('time1:' + time1)
    console.log('today:' + today)

      // if (time1 != 'string') {
      // console.log('111')
      //     wx.removeStorageSync(timeName)
      // } else {
      // console.log('22222')
      // }

    if (!time1){
      console.log('【-->】' + timeName +"首次进入")
      return true
    } else {
      if (time1.substring(0,10) == today) {
        console.log('上一次是今天记录')
        return false
      } else {
        console.log('上一次不是今天记录')
        return true
      }

    }
  },
  //更新早睡早起打卡状态
  updateSateRecord(){

    // if(Tool.isRecordedToday('sleepTime',false)){
    if(this.allowCard('sleepTime')){
      this.setData({
        isSleepRecord: true
      })
    }else{
      this.setData({
        isSleepRecord: false
      })
    }

    // if(Tool.isRecordedToday('getUpTime',false)){
    if(this.allowCard('getUpTime')){
      this.setData({
        isGetUpRecord: true
      })
    }else{
      this.setData({
        isGetUpRecord: false
      })
    }
  },

  //1.早睡早起打卡
  recordTimeStart: function(e) {
    Init.upDateNickName(app, e).then(res => {
      var that = this
      var type = e.target.dataset.type
      var name;
      var tip;

      if (type == "0") {
        name = 'sleepTime'
        tip = '早睡'
      } else if (type == "1") {
        name = 'getUpTime'
        tip = '早起'
      }
      console.log("name:" + name)

      wx.showModal({
        title: '提示',
        content: '今天是否有' + tip + '？',
        cancelText: "😡 不",
        confirmText: "😏 有",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.recordTimeAnimation(type, name)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    })


  },
  //2.早睡早起打卡 - 点击确定后执行
  recordTimeAnimation(type,name){
    // if(Tool.isRecordedToday(name,true)){

    var flag
    if (type  == '0') {
      flag = this.data.isSleepRecord
    } else {
      flag = this.data.isGetUpRecord
    }

    if(flag){
      if(type == "0"){

        this.setData({
          isShowSleep: true
        })

        setTimeout(function(){
          this.setData({
            isShowSleep: false,
            isSleepRecord: false,
          })
        }.bind(this),470)

        setTimeout(function(){
          Tool.sound()
        }.bind(this),150)

        this.updateDateRecord(type)

      }else if(type == "1"){

        this.setData({
          isShowGetUp: true
        })
        setTimeout(function(){
          this.setData({
            isShowGetUp: false,
            isGetUpRecord: false,
          })
        }.bind(this),470)
        setTimeout(function(){
          Tool.sound()
        }.bind(this),150)

        this.updateDateRecord(type)

      }

    }else{
      wx.navigateTo({
        url: '../recordSignIn/recordSignIn'+'?type='+type
      })
    }
  },
  //3.早睡早起打卡 - 修改记录数据
  updateDateRecord(type){
    var that = this
    var type= type //0:早睡；1：早起
    var arrName,typeName
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName || ''

    if(type == '0'){
      arrName = 'sleepArr'
      typeName =  'sleepTime'
    }else if(type =='1'){
      arrName ="getUpArr"
      typeName =  'getUpTime'
    }

    var obj={
      date:this.data.timeR,
      typeRecord:type,//1:早睡记录；2：早起记录
    }

    var Record = Bmob.Object.extend("sign_in_record");
    var query = new Bmob.Query(Record);

    query.equalTo("creatorId",creatorId );
    query.first({
      success: function(object) {
        // console.log("查找成功")
        // console.log(object)
        if(object == undefined || object == ''){
          that.newDateRecord(type)//新建一条
        }else{

          var arr =object.attributes[arrName]
          if(arr == undefined){
            arr = [obj]
          }else{
            arr.push(obj)
          }

          object.set(arrName,arr)
          object.set('creatorName',creatorName)
          object.save().then(function(data) {
            console.log("修改记录 成功")
            console.log(data)

            wx.setStorageSync(typeName, Tool.dateToString(new Date())) // 记录时间 {string} 2018-20-10 10:30:00
            that.addDateDynamic(type,arr.length)
          }, function(error) {
            console.log("修改 失败")
            console.log(error)
          });

        }
      },
      error: function(object, error) {
        console.log("查找失败")
        console.log(error)

      }
    });

  },
  //4.早睡早起打卡 - 创建一条数据
  newDateRecord(type){
    var that = this
    var type= type //0:早睡；1：早起
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName || ''
    var arrName,typeName
    var date


    var Record = Bmob.Object.extend("sign_in_record");
    var record = new Record();

    var obj={
      date:this.data.timeR,
      typeRecord:type,//1:早睡记录；2：早起记录
    }

    if(type == '0'){
      arrName = 'sleepArr'
      typeName =  'sleepTime'
    }else if(type =='1'){
      arrName ="getUpArr"
      typeName =  'getUpTime'
    }

    record.set(arrName, [obj]);
    record.set('creatorName', creatorName);
    record.set('creatorId', creatorId);
    record.save({
      success: function(object) {
        console.log("新建 成功")
        console.log(object)

        wx.setStorageSync(typeName, Tool.dateToString(new Date())) // 记录时间 {string} 2018-20-10 10:30:00
        that.addDateDynamic(type,1)
      },
      error: function(object, error) {
        console.log("新建 失败")
        console.log(error)

      }
    });

  },
  //5.早睡早起打卡 - 记录动态表 quantity:记录次数
  addDateDynamic(type,quantity){
    var that = this
    var type= type //0:早睡；1：早起
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName || ''
    var creatorInfo = app.User.attributes.userInfo

    var Dynamic = Bmob.Object.extend("dynamic_user");
    var record = new Dynamic();

    var obj={
      creatorId:creatorId,
      creatorName:creatorName,
      date:new Date().format('yyyy-MM-dd h:m:s'),
      typeRecord:type,//0:早睡；1：早起; 2,记录好习惯; 3,记录坏习惯
      medal:1,
      result:'',
      quantity:quantity,
      creatorInfo:creatorInfo,
    }

    record.set('info', obj);
    record.set('creatorName', creatorName);
    record.set('creatorId', creatorId);
    record.set('type', type);

    record.save({
      success: function(object) {
        console.log("新建动态 成功")
        console.log(object)
        that.delDateDynamic()
      },
      error: function(object, error) {
        console.log("新建动态 失败")
        console.log(error)

      }
    });
  },
  //6.早睡早起打卡 - 超过额定数量删除记录
  delDateDynamic(){
    var that = this
    var num = app.config.dynamicNum;//最多记录的数量
    var Dynamic = Bmob.Object.extend("dynamic_user");
    var query = new Bmob.Query(Dynamic);


    query.count({
      success: function(count) {
        console.log("查找数据数量 成功")
        if(count >= num){

          query.descending('creadorIdAt');
          query.first({
            success: function(object) {
              console.log("查找1条数据 成功")
              console.log(object)
              object.destroy({
                success: function(myObject) {
                  console.log("删除成功")
                  console.log(object)
                },
                error: function(myObject, error) {
                  console.log("删除失败")
                  console.log(object)
                }
              });

            },
            error: function(error) {
              console.log("查找1条数据 失败: " + error.code + " " + error.message);
            }
          });
        }
      },
      error: function(error) {
        // 查询失败
      }
    });
  },


  //清除缓存
  clear(){
    wx.clearStorage()
  },
  //计算真实记录时间，凌晨4点前为昨天，凌晨4点后为今天
  timeRCompute(){
    var t0 = Tool.dateToString(new Date())
    var t1 = Tool.showDate(0)+ ' 04:00:00'
    if(Tool.timeCompare(t0,t1)){
      this.setData({
        timeR: Tool.showDate(0)
      })
    }else {
      this.setData({
        timeR: Tool.showDate(-1)
      })
    }
  }

})
