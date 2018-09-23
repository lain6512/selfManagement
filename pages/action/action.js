var Bmob = require('../../utils/bmob.js')
var compute = require('compute.js')
const app = getApp()

Page({
  data: {
    User:app.User,
    mentality:{
      value:''//总精神状态
    },
    recordList: [],//记录列表
    result:[],//计算结果
    delayId:'',
    title:'',
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
      "GOOD!  全世界都阻挡不住您的热情，行动起来！",
    ],

    backLink:false
  },
  onLoad: function (options) {

    // var recordList = wx.getStorageSync('recordList')
    // var val = wx.getStorageSync('mentality').value

    var recordList = app.Data.recordList
    var val = app.Data.mentalityVal

    console.log('action recordList')
    console.log(recordList)

    this.setData({
      recordList: recordList,
      mentality:{
        value:val
      },
      delayId:options.delayId,
      title:options.title
    })
    var result = compute.start(val,recordList)//开始计算
    console.log("result:")
    console.log(result)
    this.setData({
      result: result,
    })

    if(options.back =='Y'){
      this.setData({
        backLink: true,
      })
    }
  },
  //linkTo 拖延项
  linkDelayIndex: function() {
    wx.redirectTo({
      url: '/pages/list/list?delayId=' + this.data.delayId + '&title=' + this.data.title + '&action=' + true
    })
  },

})