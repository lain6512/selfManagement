//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
const app = getApp()

Page({
  data: {
    isFirst:false,//是否初次登入


    inputValue:'',
    itemList:['学习', '运动', '工作', '日常/家务', '娱乐','吃东西'],
    itemTitle:'学习',
    // frequencyList:['每天','单次事项'],
    frequencyList:['每天'],
    frequency:'每天',
    timeStart: "5:00",
    timeEnd: "24:00",
    checkboxItems: [
      {name: '这件事是否经常拖延？', value: '0', checked: false},
    ],



  },

  onLoad: function (options) {
    // console.log("options.isFirst:"+options.isFirst)

    if(options.isFirst != undefined && options.isFirst == 'Y'){
      this.setData({
        isFirst: true,
        frequency:'每天'
      })
    }
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
  //保存
  saveGo:function () {
    // console.log("itemMould:")
    // console.log(app.Data.itemMould)



    // return

    // wx.showLoading({icon: 'loading', mask:true});

    var val = this.data.inputValue
    var type= this.data.type
    var mouldArr = app.Data.itemMould
    var frequency = this.data.frequency
    var isDelay = this.data.checkboxItems[0].checked
    var itemType = this.data.itemTitle


    // console.log(val+'|'+type)
    // console.log("frequency:"+frequency+" isDelay:"+isDelay)

    if(val ==''){
      wx.showToast({
        icon:'none',
        title: '不能为空'
      });
      return
    }



    mouldArr.forEach(function (item, index) {
      item.items.forEach(function (i, n) {
        if(i.txt == val){
          wx.showToast({
            icon:'none',
            title: '名字重复，事项已经添加'
          });
          return
        }
      })

      if(item.title == type){
        item.items.push({
          "selected": true,
          "txt": val,
          "frequency":frequency,
          "isDelay":isDelay,
          "itemType":itemType
        })
      }

    })

    if(this.data.isFirst){
      this.saveFirst()
      return
    }

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
        console.log("查找 模板数据 成功")
        console.log(results);

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

          }
        });


      },
      error: function (error) {
        console.log("查找 模板数据 失败")
      }
    });

  },
  //更改记录缓存
  changeRecordlist:function (val) {
    var recordList = wx.getStorageSync('recordList')
    recordList.push({
      "selected":true,
      "txt": val,
      show:true,
      value:0,
      isDelay:this.data.checkboxItems[0].checked,
      itemTitle:this.data.itemTitle,
      frequency:this.data.frequency
    })

    wx.setStorageSync('recordList', recordList)
    wx.hideLoading()
    wx.navigateTo({
      url: '../list/list'
    })
  },

  //第一次进入保存
  saveFirst:function(){
    var obj={
      selected:true,
      txt: this.data.inputValue,
      show:true,
      value:0,
      frequency:this.data.frequency,
      itemTitle:this.data.itemTitle,
      isDelay:true,
    }
    // console.log("obj:")
    // console.log(obj)
    app.Data.itemInfoFirst =obj
    wx.redirectTo ({
      url: '../listEdit/listEdit'
    })

  },
})
