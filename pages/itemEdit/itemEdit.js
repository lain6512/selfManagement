//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
const app = getApp()

Page({
  data: {
    accounts: ["微信号", "QQ", "Email"],
    accountIndex: 0,
    inputValue:'',

    itemList:['学习', '运动', '日常/家务', '娱乐','吃东西'],
    type:'',
    frequencyList:['每天','单次事项','工作日','节假日'],
    frequency:'',
    timeStart: "5:00",
    timeEnd: "24:00",
    checkboxItems: [
      {name: '这件事是否经常拖延？', value: '0', checked: false},
    ],
    itemInfo:'',
    itemTitle:'',
    itemIndex:'',



  },

  onLoad: function (options) {
    this.initDataItem(options)
  },
  //初始化编辑项
  initDataItem:function (options) {

    if(options.index ==undefined || options.index == '' || !options.index){
      wx.showModal({
        content: '网络不给力，加载有误',
        showCancel: false,
        success: function (res) {
          if (res.confirm){wx.navigateTo({url: '/pages/list/list'})}
        }
      });
    }

    var recordList = wx.getStorageSync('recordList')
    var checkboxItems = this.data.checkboxItems
    checkboxItems[0].checked = recordList[options.index].isDelay
    this.setData({
      itemInfo: recordList[options.index],
      itemTitle: recordList[options.index].itemTitle,
      frequency: recordList[options.index].frequency,
      checkboxItems: checkboxItems,
      inputValue:recordList[options.index].txt,
      itemIndex:options.index

    })
  },
  //选择类别
  open: function () {
    var that =this
    wx.showActionSheet({
      itemList:this.data.itemList,
      success: function (res) {
        if (!res.cancel) {
          console.log(that.data.itemList[res.tapIndex])
          that.setData({
            itemTitle: that.data.itemList[res.tapIndex]
          })
        }
      }
    });
  },
  //选择频率
  openFrequency: function () {
    var that =this
    wx.showActionSheet({
      itemList:this.data.frequencyList,
      success: function (res) {
        if (!res.cancel) {
          console.log(that.data.frequencyList[res.tapIndex])
          that.setData({
            frequency: that.data.frequencyList[res.tapIndex]
          })
        }
      }
    });
  },
  //选择时间
  bindTimeChangeS: function (e) {
    this.setData({
      timeStart: e.detail.value
    })
  },
  bindTimeChangeE: function (e) {
    this.setData({
      timeEnd: e.detail.value
    })
  },
  //复选框，是否拖延
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if(checkboxItems[i].value == values[j]){
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  //输入框
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //1.保存
  saveGo:function () {
    console.log("itemMould:")
    console.log(app.Data.itemMould)

    // return
    // wx.showLoading({icon: 'loading', mask:true});

    var val = this.data.inputValue
    var type= this.data.type
    var mouldArr = app.Data.itemMould
    var frequency = this.data.frequency
    var isDelay = this.data.checkboxItems[0].checked
    var itemType = this.data.itemTitle
    var indexS = this.data.itemIndex
    var txt = this.data.itemInfo.txt

    console.log(val+'|'+type)
    console.log("frequency:"+frequency+",isDelay:"+isDelay+",indexS:"+indexS+",txt:"+txt)

    if(val ==''){
      wx.showToast({
        icon:'none',
        title: '不能为空'
      });
      return
    }

    mouldArr.forEach(function (item, index) {
      item.items.forEach(function (n, i) {
        if(n.txt == txt){
          // console.log("item:")
          // console.log(item)
          // console.log(n)
          n.txt= val
          n.frequency= frequency
          n.itemTitle= itemType
          n.isDelay= isDelay
        }
      })
    })

    console.log("mouldArr")
    console.log(mouldArr)

    // return

    var that = this
    var type= app.Data.itemMouldType //1:非工作常规日；2：工作日下班后；3，工作日上班时间
    var itemMouldId = app.Data.itemMouldId
    var creatorName = app.User.attributes.creatorName

    var Mould = Bmob.Object.extend("item_mould_list");
    var query = new Bmob.Query(Mould);

    query.get(itemMouldId,{
      success: function (results) {
        // console.log("查找 模板数据 成功")
        // console.log(results);

        results.set("itemTypeArr", mouldArr);
        results.save(null,{
          success: function (resData) {
            console.log("修改 模板 成功")
            console.log(resData)
            app.Data.itemMould = resData.attributes.itemTypeArr
            that.changeRecordlist(val)
          },
          error: function(result, error) {
            console.log("添加 模板 失败")
            console.log(result)
            console.log(error)
            wx.showModal({
              content: '操作失败',
              showCancel: false,
              success: function (res) {
                if (res.confirm){wx.navigateTo({url: '/pages/list/list'})}
              }
            });
          }
        });


      },
      error: function (error) {
        console.log("查找 模板数据 失败")
      }
    });

  },
  //2.保存-更改记录缓存
  changeRecordlist:function (val) {
    var recordList = wx.getStorageSync('recordList')
    var n = this.data.itemIndex

    recordList[n].txt = this.data.inputValue
    recordList[n].frequency = this.data.frequency
    recordList[n].itemTitle = this.data.itemTitle
    recordList[n].isDelay = this.data.checkboxItems[0].checked


    wx.setStorageSync('recordList', recordList)
    wx.hideLoading()
    wx.navigateTo({
      url: '../list/list'
    })
  },

  //1.删除
  delGo:function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否要删除？',
      success: function(res) {
        if (res.confirm) {
          that.saveDataDel()
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //2.删除 - 删除数据表
  saveDataDel:function () {

    var mouldArr =app.Data.itemMould
    var indexS = this.data.itemIndex
    var recordList = wx.getStorageSync('recordList')
    var itemInfo =this.data.itemInfo

    if(itemInfo.isDelay ==true){
      wx.showToast({
        icon:'none',
        title: '这是你要克服拖延的目标，不能删除'
      });
      return
    }

    // return
    //逆循环删除
    mouldArr.forEach(function (item, index) {
      for (let i = item.items.length - 1; i >= 0; i--) {
        if(item.items[i].txt == itemInfo.txt){
          item.items.splice(i,1)
        }
      }
    })

    console.table("mouldArr")
    console.table(mouldArr)

    var that = this
    var type= app.Data.itemMouldType //1:非工作常规日；2：工作日下班后；3，工作日上班时间
    var itemMouldId = app.Data.itemMouldId
    var creatorName = app.User.attributes.creatorName

    var Mould = Bmob.Object.extend("item_mould_list");
    var query = new Bmob.Query(Mould);

    query.get(itemMouldId,{
      success: function (results) {
        // console.log("查找 模板数据 成功")
        // console.log(results);

        results.set("itemTypeArr", mouldArr);
        results.save(null,{
          success: function (resData) {
            console.log("删除 模板 成功")
            console.log(resData)
            app.Data.itemMould = resData.attributes.itemTypeArr
            that.changeRecordlistDel()
          },
          error: function(result, error) {
            console.log("删除 模板 失败")
            console.log(result)
            console.log(error)
            wx.showModal({
              content: '操作失败',
              showCancel: false,
              success: function (res) {
                if (res.confirm){wx.redirectTo({url: '/pages/list/list'})}
              }
            });
          }
        });


      },
      error: function (error) {
        console.log("查找 模板数据 失败")
      }
    });

  },
  //3.删除 - 更改记录缓存
  changeRecordlistDel:function () {
    var recordList = wx.getStorageSync('recordList')
    recordList.splice(this.data.itemIndex,1)

    wx.setStorageSync('recordList', recordList)
    wx.hideLoading()
    wx.navigateTo({
      url: '../list/list'
    })
  },



})
