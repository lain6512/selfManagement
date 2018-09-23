//index.js
var Bmob = require('../../utils/bmob.js');
var Init = require('../../utils/initUserInfo.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    itemTitle:'学习',
    inputValue:'',
    itemList:['学习', '锻炼', '工作', '日常/家务', '娱乐','吃东西'],
  },

  onLoad: function (options) {
    let that = this
    Init.user(app,that,state=> {
      that.getDataInitItem()
    })
  },
  getDataInitItem () {

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
  //输入框
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //4.创建一条数据
  saveGo(e){

    if (this.validate()) {
      Init.upDateNickName(app, e).then(res => {
        var that = this
        var type = 1 //1：拖延
        var typeRecord = this.data.itemTitle
        var creatorId = app.User.id
        var creatorName = app.User.attributes.nickName

        var Record = Bmob.Object.extend("delay_list");
        var record = new Record();

        var obj={
          typeRecord:typeRecord,
          userInfo:app.User,
          title:this.data.inputValue,
        }


        //角色权限
        var groupACL = new Bmob.ACL();
        var userList = [app.User.id];
        for (var i = 0; i < userList.length; i++) {
          groupACL.setReadAccess(userList[i], true);
          groupACL.setWriteAccess(userList[i], true);
        }
        groupACL.setReadAccess("*", true);
        record.setACL(groupACL);

        record.set('dataInfo', obj);
        record.set('creatorName', creatorName);
        record.set('creatorId', creatorId);
        record.set('typeRecord', typeRecord);
        record.set('finish', 0);
        record.set('type', 0);
        record.save({
          success: function(object) {
            console.log("新建 成功")
            console.log(object)
            wx.redirectTo({
              url: '/pages/delayHome/delayHome?delayId='+object.id
            })

          },
          error: function(object, error) {
            console.log("新建 失败")
            console.log(error)

          }
        });

      })
    }


  },
  //验证
  validate () {
    var result = false
    var str = this.data.inputValue

    if (!str) {
      wx.showToast({
        icon:'none',
        title: '不能为空'
      });
      return false
    }

    if (str.length > 6) {
      wx.showToast({
        icon:'none',
        title: '6个字以内'
      });
      return false
    }

    if (str.indexOf(" ") > -1) {
      wx.showToast({
        icon:'none',
        title: '请输入一件事，去掉空格'
      });
      return false
    }

    if (
        str.indexOf("，") > -1 ||
        str.indexOf(",") > -1 ||
        str.indexOf("、") > -1 ||
        str.indexOf("；") > -1 ||
        str.indexOf(";") > -1
    ) {
      wx.showToast({
        icon:'none',
        title: '请输入一件事，去掉标点符号'
      });
      return false
    }



    return true



  }


})
