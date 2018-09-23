//策略号#02
var Init = require('../../../utils/initUserInfo.js');
var Bmob = require('../../../utils/bmob.js');
// /获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    isEdit:false,
    strategy:'strategy_02', //拖延策略编号
    delayItem:'',
    delayId:'',

    txt100:'',
    txt60:'',
    state:0,
  },

  onLoad: function (options) {
    let that = this
    app.getDataInitItem(options.delayId).then(res =>{
      let isEdit

      that.setData({
        delayItem: res.attributes,
        delayId: res.id,
      })

      if (res.attributes.dataInfo[this.data.strategy]) {
        that.setData({
          isEdit: true,
          state: 2,
          txt100: res.attributes.dataInfo[this.data.strategy].txt100,
          txt60: res.attributes.dataInfo[this.data.strategy].txt60,
        })
      }

    })


  },
  click1 () {
    setTimeout(function (){
      console.log('this.data.txt100')
      console.log(this.data.txt100)

      if (this.data.txt100 == '') {
        wx.showToast({
          icon:'none',
          title: '什么都没写，发现懒癌晚期患者一个！'
        });
        return
      }
      this.setData({
        state: 1,
      })

    }.bind(this), 300)


  },
  click2 () {
    setTimeout(function (){

      if (!this.data.txt60) {
        wx.showToast({
          icon:'none',
          title: '什么都没写，发现懒癌晚期一个！'
        });
        return
      }
      this.saveGo()
      this.setData({
        state: 2
      })

    }.bind(this), 300)

  },
  click3 () {
    wx.navigateBack({
      delta:1,
      url: '/pages/delayHome/delayHome?delayId=' + this.data.delayId
    })
  },
  //修改
  click4(){
    this.setData({
      state: 0,
    })
  },
  txt1blur(e){
    this.setData({
      txt100: e.detail.value
    })
  },
  txt2blur(e){
    this.setData({
      txt60: e.detail.value
    })
  },
  //提交保存
  saveGo () {
    let that = this
    let id = this.data.delayId
    var Mould = Bmob.Object.extend("delay_list");
    var query = new Bmob.Query(Mould);

    query.get(id,{
      success: function (data) {
        console.log("查找 拖延项 成功")
        console.log(data);

        let info = data.attributes.dataInfo
        info[that.data.strategy] = {
          txt100:that.data.txt100,
          txt60:that.data.txt60,
          date:new Date()
        }
        data.set('dataInfo',info)
        data.save(null,{
          success: function (res) {
            console.log("保存 成功")
            console.log(res)
          },
          error: function (data) {
            console.log("保存失败")
          },
        })





      },
    });
  },




})
