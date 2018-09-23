//index.js
var Tool = require('../../utils/tool.js');
var Bmob = require('../../utils/bmob.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    userInfo: {},
    hasUserInfo: false,
    recordType:null,
    grids: [],
    dataList:[],
    itemDate:'',
    endDate:''


  },

  onLoad: function (options) {
    console.log("options")
    console.log(options)

    if(options.type && options.type !=null){
      this.setData({
        User: app.User,
        recordType: options.type,
      })
    }
    this.getDataRecord(options.type)


    this.setData({
      endDate: Tool.showDate(0)
    })



  },
  //获取数据
  getDataRecord(type){
    var that = this
    var type= type //0:早睡；1：早起
    var arrName
    var creatorId = this.data.User.id
    var creatorName = this.data.User.attributes.nickName

    if(type == '0'){
      arrName = 'sleepArr'
    }else if(type =='1'){
      arrName ="getUpArr"
    }

    var Record = Bmob.Object.extend("sign_in_record");
    var query = new Bmob.Query(Record);

    query.equalTo("creatorId",creatorId );
    query.first({
      success: function(object) {
        console.log("查找成功")
        console.log(object)

        var arr = object.attributes[arrName]
        arr.forEach(function (item, index) {
          item.date =item.date.split(' ')[0]
        })

        that.setData({
          dataList: arr,
          grids: arr
        })

      },
      error: function(object, error) {
        console.log("查找失败")
        console.log(error)

      }
    });
  },
  //点击
  clickItem (e) {
    console.log(e)
  },
  //选时间
  bindDateChange (e) {
    console.log('选时间')
    console.log(e)

    var index = e.currentTarget.dataset.index
    var val = e.detail.value

    console.log(index +' '+ val)

    this.upDate(index,val)

  },
  upDate (index,val) {
    let that = this
    var arrName
    var type = this.data.recordType
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName || ''

    if(type == '0'){
      arrName = 'sleepArr'
    }else if(type =='1'){
      arrName ="getUpArr"
    }

    var Record = Bmob.Object.extend("sign_in_record");
    var query = new Bmob.Query(Record);

    query.equalTo("creatorId",creatorId );
    query.first({
      success: function (object) {
        console.log("查找成功")
        console.log(object)

        var arr = object.attributes[arrName]
        arr[index].date = val

        object.set(arrName, arr)
        object.set('creatorName', creatorName)
        object.save().then(function (data) {
          console.log("修改记录 成功")
          console.log(data)

          that.upDatePage(data.attributes[arrName][index].date,index)

        }, function (error) {
          console.log("修改 失败")
          console.log(error)
        });


      },
      error: function(object, error) {
        console.log("查找失败")
        console.log(error)

      }
    });

  },
  //修改页面时间
  upDatePage (val,index) {
    let arr = this.data.grids
    arr[index].date = val
    this.setData({
      grids: arr
    })

    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 1500
    })
  }


})
