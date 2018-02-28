//app.js
var Bmob = require('utils/bmob.js')
var BmobSocketIo = require('utils/bmobSocketIo.js').BmobSocketIo;
Bmob.initialize("f137f866edfad69aca6e1f48e325d2fc", "6cc64af2691d35e30cf39144dd9766ec");
BmobSocketIo.initialize("f137f866edfad69aca6e1f48e325d2fc");

App({
  globalData: {
    userInfo: null,
    current: null,
    test: '测试'

  },
  User: null,
  Data: {
    itemMould: [],//模板数据
    itemMouldType: null,//模板类型
    itemMouldId: '',//模板id
    // allowRecord:true,
    itemInfoFirst: '',//第一次进入记录
  },
  loading: true,
  onLaunch: function () {
    console.log("-------------------开始app初始化-------------")
    // 展示本地存储能力
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var user = new Bmob.User();//开始注册用户

    var newOpenid = wx.getStorageSync('openid')
    if (!newOpenid) {


      //登录
      wx.login({
        success: function (res) {
          user.loginWithWeapp(res.code).then(function (user) {
            var openid = user.get("authData").weapp.openid;
            console.log(user, 'user', user.id, res);

            if (user.get("nickName")) {
              console.log("【第二次访问】：")
              that.User = Bmob.User.current()
              wx.setStorageSync('openid', openid)
              that.UserCallBack(that.User)//执行回调
              /*setTimeout(function () {
                console.log("执行Data")
                console.log(that.Data)
              },3000)*/

            } else {
              console.log("【第一次进入】")
              //保存用户其他信息
              wx.getUserInfo({
                success: function (result) {

                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;

                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                  query.get(user.id, {
                    success: function (result) {
                      // 自动绑定之前的账号

                      result.set('nickName', nickName);
                      result.set("userPic", avatarUrl);
                      result.set("openid", openid);
                      result.save(null, {
                        success: function (resData) {
                          console.log("注册成功")
                          console.log(resData)
                          that.User = Bmob.User.current()
                          // that.initItemMould()
                          if (that.UserCallBack) {
                            that.UserCallBack(that.User)//执行回调
                          }
                        }
                      });

                    }
                  });

                }
              });


            }

          }, function (err) {
            console.log("执行loginWithWeapp（）失败")
            console.log(err, 'errr');
          });

        }
      });
    } else {
      console.log("【已授权登录】")
      that.User = Bmob.User.current()
      if (this.UserCallBack) {
        this.UserCallBack(that.User)
      }
      // setTimeout(function () {
      //   console.log("User：")
      //   console.log(that.User)
      // console.log(that.Data)
      that.loading = false
      // },3000)
    }
  },
  //获取用户信息
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log("获取用户信息成功 ")
              that.User = Bmob.User.current()
              that.globalData.userInfo = res.userInfo
              if (this.UserCallBack) {
                this.UserCallBack(that.User)
              }
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //初始化模板
  initItemMould: function () {
    console.log("初始化模板1")
    console.log(this.User)
    var that = this
    var type = '1' //1:非工作常规日；2：工作日下班后；3，工作日上班时间
    var creatorId = this.User.id
    var creatorName = this.User.attributes.creatorName
    /*var itemTypeArr = [
      {item: '每天看书', type: '学习'},
      {item: '记单词', type: '学习'},
      {item: '跑步', type: '锻炼'},
      {item: '项目开发', type: '工作'},
      {item: '吃零食', type: '日常'},
      {item: '吃午/晚餐', type: '日常'},
      {item: '玩游戏', type: '娱乐'},
      {item: '上网/刷朋友圈', type: '娱乐'},
      {item: '购物', type: '娱乐'},
      {item: '睡觉', type: '睡觉'},
    ]*/
    var itemTypeArr = [
      {
        title: '学习',
        items: [
          {txt: '每天看书', selected: true},
          {txt: '记单词', selected: true},
        ]
      },
      {
        title: '锻炼',
        items: [
          {txt: '跑步', selected: true},
        ]
      },
      {
        title: '日常',
        items: [
          {txt: '吃零食', selected: true},
          {txt: '吃午/晚餐', selected: true},
        ]
      },
      {
        title: '娱乐',
        items: [
          {txt: '玩游戏', selected: true},
          {txt: '上网/刷朋友圈', selected: true},
        ]
      },
    ]

    var Mould = Bmob.Object.extend("item_mould_list");
    var mould = new Mould();
    mould.set('type', type);
    mould.set('creatorName', creatorName);
    mould.set('creatorId', creatorId);
    mould.set("itemTypeArr", itemTypeArr);
    mould.save(null, {
      success: function (resData) {
        console.log("添加 模板 成功")
        console.log(resData)
        that.Data.itemMould = itemTypeArr
        that.initItemCallback(that.Data)
      },
      error: function (result, error) {
        console.log("添加 模板 失败")
        console.log(result)
        console.log(error)

      }
    });
  },

})