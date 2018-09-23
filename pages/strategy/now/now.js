
var Init = require('../../../utils/initUserInfo.js');
var tool = require('../../../utils/tool.js');
// /获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    state:0,
    isShow_zan:false,
    isShow_textarea:false,
    textareaValue:'',
  },

  onLoad: function (options) {

    this.setData({
      title: options.title
    })

    let that = this
    Init.user(app,that,state=> {

    })


  },
  click1 () {
    this.setData({
      state: 1
    })
  },
  click2 () {
    wx.showModal({
      content: '此刻无法进行，请暂时更换其他策略~',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack()

        }
      }
    });
  },
  click3 () {
    this.setData({
      state: 2
    })
  },
  click4 () {
    this.setData({
      isShow_zan: true
    })
    tool.sound()
  },
  hideZan () {
    this.setData({
      isShow_zan:false,
    })
  },
  click5(){
    this.showTextarea()
  },
  //4.提交输入框
  submitTextarea(){

    console.log("textareaValue:"+this.data.textareaValue)

    if(this.data.textareaValue.length < 200){
      wx.showToast({
        icon:'none',
        title: '不少于200字！',
        duration:5000

      });
      return
    } else {
      this.setData({
        state:3,
      })
      this.closeTextarea()
    }

  },
  //显示输入框
  showTextarea(){
    this.setData({
      isShow_textarea: true
    })
  },
  //关闭输入框
  closeTextarea(){
    this.setData({
      isShow_textarea:false,
      // textareaValue:''
    })
  },
  //文本框输入
  bindTextAreaBlur: function(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },

  goBack () {
    wx.navigateBack({
      delta:1,
      url: '/pages/delayHome/delayHome?delayId=' + this.data.delayId
    })
  },

})
