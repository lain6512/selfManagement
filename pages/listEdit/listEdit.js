//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js')
const app = getApp()

Page({
  data: {
    //引入全局数据
    User:app.User,
    loading:app.loading,
    itemMould:[],

    initFinish:false,//初始化是否完成

    motto: 'details',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },
  // ToUserCallBack:function (User) {
  //   console.log("执行回调")
  //   this.setData({User: app.User})//取得用户数据后回调
  // },

  onLoad: function () {
    console.log("User:")
    // console.log(this.data.User)

    this.setData({
      User: app.User,
      initFinish:false
    })
    app.UserCallBack = res => {
      console.log("执行 Callback ")
      this.setData({
        User: res,
        hasUserInfo: true
      })
    }

    //初始化模板后回调
    /*app.initItemCallback = Data => {
      console.log("执行 Callback ")
      this.setData({
        itemMould: Data.itemMould
      })
      console.log("Data:")
      console.log(Data)
    }*/
    // this.getDataMould()
    this.initItemMould()
  },
  onReady: function () {
    //获得article组件
    this.article = this.selectComponent("#article");
  },

  //打分标准弹框
  showDialog() {
    this.article.showPopupAricle();
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
    var itemInfoFirst = app.Data.itemInfoFirst
    var itemTypeArr = [
      {
        title: '学习',
        items: [
          {txt: '看书', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '记单词', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '工作',
        items: [
          {txt: '每日工作计划', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '锻炼',
        items: [
          {txt: '跑步', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '日常/家务',
        items: [
          {txt: '洗澡', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '扫地', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '吃东西',
        items: [
          {txt: '吃零食', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '吃午/晚餐', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
      {
        title: '娱乐',
        items: [
          {txt: '玩游戏', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '上网/刷朋友圈/聊天', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
          {txt: '看电视/电影', selected: true,frequency:'每天',isDelay:false,value:0,show:true},
        ]
      },
    ]

    itemTypeArr.forEach(function (item, index) {
      if(item.title == itemInfoFirst.itemTitle){
        item.items.push(itemInfoFirst)
      }
    })

    this.setData({
      itemMould: itemTypeArr
    })

  },

  //保存提交
  saveGo:function () {
    console.log("保存")
    // console.log(this.data.itemMould)
    console.log(this.data.User)


    // return

    wx.showLoading({icon: 'loading', mask:true});

    var that = this
    var type='1' //1:非工作常规日；2：工作日下班后；3，工作日上班时间
    var creatorId = this.data.User.id
    var creatorName = this.data.User.attributes.creatorName

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
        wx.hideLoading()
        wx.navigateTo({
          url: '../list/list'
        })
      },
      error: function(result, error) {
        console.log("添加 模板 失败")
        console.log(result)
        console.log(error)

      }
    });
  },
})
