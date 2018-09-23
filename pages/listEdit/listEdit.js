//index.js
//获取应用实例
var Init = require('../../utils/initUserInfo.js');
var Bmob = require('../../utils/bmob.js')
const app = getApp()

Page({
  data: {
    //引入全局数据
    User:app.User,
    loading:app.loading,
    itemMould:[],
    strategy:'strategy_01', //拖延策略编号

    initFinish:false,//初始化是否完成

    motto: 'details',
    userInfo: {},
    hasUserInfo: false,

  },

  onLoad: function (options) {
    this.setData({
      delayId:options.delayId,
      title:options.title,
    })

    let that = this
    Init.user(app,that,state=> {
      console.log('app:')
      console.log(app)
      that.initItemMould()
    })
  },
  onReady: function () {
  },

  //点击选项
  clickItem:function (e) {
    console.log("点击")
    // console.log(e)

    var index = e.currentTarget.dataset.index
    var num = e.currentTarget.dataset.num
    var isSelected = e.currentTarget.dataset.i.selected

    // console.log("index:"+index)
    // console.log("num:"+num)
    // console.log("isSelected:"+isSelected)

    var arr = this.data.itemMould

    if(arr[index].items[num].txt == app.Data.itemInfoFirst.txt){
      console.log("不能取消")
      return
    }

    arr[index].items[num].selected = !isSelected
    this.setData({
      itemMould:arr
    })

  },


  //初始化选项模板
  initItemMould:function () {
    console.log("初始化模板")
    console.log(app.Data.itemInfoFirst)


    // wx.setStorageSync('recordList', '')
    // wx.setStorageSync('mentality', '')

    var obj={
      selected:true,
      txt: this.data.inputValue,
      show:true,
      value:0,
      frequency:this.data.frequency,
      itemTitle:this.data.itemTitle,
      isDelay:true,
    }


    var itemInfoFirst = app.Data.itemInfoFirst
    var itemTypeArr = [
      {
        title: '学习',
        items: [
          {txt: '看书', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '记单词', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '学习充电', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '写作业', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '工作',
        items: [
          {txt: '工作计划', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '写报告', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '写总结', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '发邮件', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '锻炼',
        items: [
          {txt: '跑步', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '仰卧起坐', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '俯卧撑', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '瑜伽', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '日常/家务',
        items: [
          {txt: '洗澡', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '打扫', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '吃东西',
        items: [
          {txt: '吃东西', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '娱乐',
        items: [
          {txt: '玩游戏', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '上网/刷朋友圈/聊天', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '看电视/电影', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '刷淘宝', selected: false,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
    ]

    // itemTypeArr.forEach(function (item, index) {
    //   if(item.title == itemInfoFirst.itemTitle){
    //     item.items.push(itemInfoFirst)
    //   }
    // })

    this.setData({
      itemMould: itemTypeArr
    })

  },

  //保存提交
  saveGo:function () {
    console.log("保存")
    console.log(this.data.itemMould)
    console.log(app.User.id)

    wx.showLoading({icon: 'loading', mask:true});

    var that = this
    var type ='1' //1:非工作常规日；2：工作日下班后；3，工作日上班时间
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName

    var Mould = Bmob.Object.extend("item_mould_list");
    var mould = new Mould();

    mould.set('type', type);
    mould.set('creatorName', creatorName);
    mould.set('creatorId', creatorId);
    mould.set("itemTypeArr", this.data.itemMould);
    mould.save(null,{
      success: function (resData) {
        console.log("添加 模板 成功")
        console.log(resData)
        app.Data.itemMould = resData.attributes.itemTypeArr
        that.saveDataDelay()

      },
      error: function(result, error) {
        console.log("添加 模板 失败")
        console.log(result)
        console.log(error)

      }
    });
  },
  //修改拖延项表
  saveDataDelay () {
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
          initMould:true
        }
        data.set('dataInfo',info)
        data.save(null,{
          success: function (res) {
            console.log("修改拖延项表 成功")
            console.log(res)

            app.Data.delayItem = res.attributes // 保存到全局
            wx.hideLoading()
            wx.redirectTo({
              url: '../list/list?delayId=' + that.data.delayId + '&title=' +  that.data.title
            })

          },
          error: function (err) {
            console.log("修改拖延项表 失败")
          },
        })

      },
    });


  }
})
