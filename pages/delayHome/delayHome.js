//index.js
var Bmob = require('../../utils/bmob.js');
var Init = require('../../utils/initUserInfo.js');
var tool = require('../../utils/tool.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    delayItem:'',
    delayId:'',
    startTime:'',
    isShow_zan:false,
    delayFinish:false,
    isFinishOne:false,


  },

  onLoad: function (options) {
    // console.log('options.delayId')
    // console.log(options.delayId)

    this.setData({
      delayId: options.delayId
    })

    let that = this
    Init.user(app,that,state=> {

      app.getDataInitItem(options.delayId).then(res =>{
        that.setData({
          delayItem: res.attributes,
          delayId: res.id,
          startTime: res.createdAt.substring(0,10)
        })
      })

    })
  },

  //linkTo 行动建议
  linkList () {
    var obj={
      selected:true,
      txt: this.data.delayItem.dataInfo.title,
      show:true,
      value:0,
      frequency:'每天',
      itemTitle:this.data.delayItem.dataInfo.typeRecord,
      isDelay:true,
    }
    console.log("obj:")
    console.log(obj)
    app.Data.itemInfoFirst = obj
    app.Data.recordList = '' // 清空记录
    // return
    wx.navigateTo({
      url: '../list/list?delayId=' + this.data.delayId + '&title=' +  this.data.delayItem.dataInfo.title
    })
  },
  //写日记
  addRecord () {
    Init.upDateNickName(app,e).then(res=>{
      console.log('保存后then（）执行')
      console.log("app.User:")
      console.log(app.User)
    })
  },
  //已完成
  saveGo (e) {
      let that = this
      var Mould = Bmob.Object.extend("delay_list");
      var query = new Bmob.Query(Mould);

      query.get(this.data.delayId,{
        success: function (object) {
          console.log("查找 拖延项 成功")
          console.log(object);
          object.set('finish',1)
          object.save().then(res =>{
            console.log('res')
            console.log(res)
            that.saveSuccess()
          })

        },
        error: function (error) {
          console.log("查找 模板数据 失败")
        }
      });
  },
  //完成一次
  saveOne (e) {
    Init.upDateNickName(app, e).then(res => {
      let that = this
      var Mould = Bmob.Object.extend("delay_list");
      var query = new Bmob.Query(Mould);

      query.get(this.data.delayId,{
        success: function (object) {
          console.log("查找 拖延项 成功")
          console.log(object);

          object.increment('finishNum')
          object.save().then(res =>{
            console.log('res')
            console.log(res)
            that.saveSuccess()
          })

        },
        error: function (error) {
          console.log("查找 模板数据 失败")
        }
      });
    })
  },
  //完成后
  saveSuccess () {
    let that = this
    let delayItem = this.data.delayItem
    delayItem.finishNum ++
    tool.sound()
    this.setData({
      isShow_zan:true,
      isFinishOne:true,
      delayItem:delayItem
    })
  },
  //点赞隐藏
  hideZan () {
    this.setData({
      isShow_zan:false,
      delayFinish:true,
    })
  },

  //linkTo 策略-立即行动法
  linkNow () {
    wx.navigateTo({
      url: '/pages/strategy/now/now?title=' + this.data.delayItem.dataInfo.title
    })
  },
  //linkTo 策略-60分原则
  linkSixty () {
    wx.navigateTo({
      url: '/pages/strategy/sixty/sixty?delayId=' + this.data.delayId
    })
  },
  //linkTo 策略-细分目标
  linkSubdivide() {
    wx.navigateTo({
      url: '/pages/strategy/subdivide/subdivide?delayId=' + this.data.delayId
    })
  },
  //linkTo 策略-设置奖励
  linkReward () {
    wx.navigateTo({
      url: '/pages/strategy/reward/reward?delayId=' + this.data.delayId
    })
  },
  //linkTo 策略-后果刺激法
  linkBad () {
    wx.navigateTo({
      url: '/pages/strategy/bad/bad?delayId=' + this.data.delayId
    })
  },
  //linkTo 策略-好处
  linkGood() {
    wx.navigateTo({
      url: '/pages/strategy/good/good?delayId=' + this.data.delayId
    })
  },


})
