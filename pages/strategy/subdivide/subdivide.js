//策略号#06
var Init = require('../../../utils/initUserInfo.js');
var Bmob = require('../../../utils/bmob.js');
// /获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    isEdit:false,
    strategy:'strategy_06', //拖延策略编号
    delayItem:'',
    delayId:'',

    txt1:'',
    txt2:'',
    txt3:'',
    txt4:'',
    txt5:'',
    txt6:'',
    state:0,
  },

  onLoad: function (options) {
    let that = this
    app.getDataInitItem(options.delayId).then(res =>{
      let info = res.attributes.dataInfo[this.data.strategy]
      that.setData({
        delayItem: res.attributes,
        delayId: res.id,
      })

      if (info) {
        that.setData({
          isEdit: true,
          state: 2,
          txt1: info.txt1 || '',
          txt2: info.txt2 || '',
          txt3: info.txt3 || '',
          txt4: info.txt4 || '',
          txt5: info.txt5 || '',
          txt6: info.txt6 || '',
        })
      }

    })


  },
  click1 () {
    setTimeout(function (){
      if (this.data.txt1 == '') {
        wx.showToast({
          icon:'none',
          title: '请至少写出第一部分'
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
      if (this.data.txt4 == '') {
        wx.showToast({
          icon:'none',
          title: '请至少写出第（1）小部分'
        });
        return
      }
      this.saveGo()
      this.setData({
        state: 2,
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
    this.setData({txt1: e.detail.value})
  },
  txt2blur(e){
    this.setData({txt2: e.detail.value})
  },
  txt3blur(e){
    this.setData({txt3: e.detail.value})
  },
  txt4blur(e){
    this.setData({txt4: e.detail.value})
  },
  txt5blur(e){
    this.setData({txt5: e.detail.value})
  },
  txt6blur(e){
    this.setData({txt6: e.detail.value})
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
          txt1:that.data.txt1,
          txt2:that.data.txt2,
          txt3:that.data.txt3,
          txt4:that.data.txt4,
          txt5:that.data.txt5,
          txt6:that.data.txt6,
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
