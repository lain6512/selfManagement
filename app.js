//app.js
var Bmob = require('utils/bmob.js')
// var BmobSocketIo = require('utils/bmobSocketIo.js').BmobSocketIo;
Bmob.initialize("f137f866edfad69aca6e1f48e325d2fc", "6cc64af2691d35e30cf39144dd9766ec"); //自律神器 生产
// BmobSocketIo.initialize("f137f866edfad69aca6e1f48e325d2fc");//自律神器 生产

// Bmob.initialize("8d8d2d924792ef96ca05741c735ff7f7", "16c17c9a4e5eeaa28fffea49f80c59f1"); //自律神器_dev
// BmobSocketIo.initialize("8d8d2d924792ef96ca05741c735ff7f7");//自律神器_dev

App({
  globalData: {
    userInfo: null,
    current: null,
    test: '测试'

  },
  version: '1.5.3',
  User:null,
  initFinish:false,
  config:{
    dynamicNum:1000,//用户动态数据库记录的条数
  },
  Data: {
    itemMould: [],//模板数据
    itemMouldType: 1,//模板类型 1:非工作常规日；2：工作日下班后；3，工作日上班时间
    itemMouldId: '',//模板id
    // allowRecord:true,
    itemInfoFirst: '111',//第一次进入记录
    recordList: '',// 选项列表记录
    mentalityVal: '',// 精神总状态值
    delayItem:'', // 拖延项数据
    delayId:'', // 拖延项id
  },
  loading: true,
  onLaunch:function  () {
    this.checkVersion()
  },
  //检查版本清空缓存
  checkVersion () {
    const version = this.version
    let v =  wx.getStorageSync('version')
    if (!v || v !== version) {
      wx.clearStorageSync()
      wx.setStorageSync('version', version)
    }
  },
  //获取用户信息
  getUserInfo: function (cb) {
    console.log('执行 getUserInfo（）')
    var that = this
    if (this.User.attributes.nickName) {
      console.log('已存在用户昵称1')
      typeof cb == 'function' && cb(this.User)
    } else {
      //调用登录接口
      console.log('无用户昵称 调用登录接口')
      wx.login({
        success: function () {
          console.log('wx.login 微信登录成功')
          wx.getUserInfo({
            success: function (res) {
              console.log('获取用户信息成功')
              console.log(res)
              // that.globalData.userInfo = res.userInfo
              that.User = res.userInfo
              typeof cb == 'function' && cb(that.User)
            },
            fail:function (err) {
              console.log('获取用户信息 失败')
              console.log(err)
            }

          })
        }
      })
    }
  },
  //bmob登录
  bmobLogin (cb) {
    var that = this
    var promise = new Bmob.Promise();
    this.User = Bmob.User.current()
    if (!this.User) {
      console.log('开始登录')
      var user = new Bmob.User() //开始注册用户
      user.auth()
          .then(function (obj) {
                console.log('登陆成功1')
                console.log(obj)
                that.User = Bmob.User.current()
                if (!that.User) {
                  //本地缓存被用户手动清除，current 为 null，重新 登录获取并记录
                  console.log('current 无缓存信息，重新获取')
                  wx.login({
                    success: function (res) {
                      user.loginWithWeapp(res.code).then(
                          function (user) {
                            that.User = user
                            var openid = user.get('authData').weapp.openid
                            wx.setStorageSync('openid', openid)
                            //保存用户其他信息到用户表
                            promise.resolve(that.initFinish);
                          },
                          function (err) {
                            // promise.reject(err);
                          }
                      )
                    }
                  })
                } else {
                  that.initFinish = true
                  promise.resolve(that.initFinish);
                  // typeof cb == 'function' && cb(that.loading)
                }

              },
              function (err) {
                console.log('失败了', err)
              });
    } else {
      // console.log('存在用户信息')
      // console.log(this.User)
      that.initFinish = true
      promise.resolve(that.initFinish);
      // typeof cb == 'function' && cb(that.loading)
    }
    return promise._thenRunCallbacks({});
  },
  //重新登录，用户主动删除缓存情况
  reLogin () {
    wx.login({
      success: function (res) {
        console.log('登录成功')
        console.log(res)
        Bmob.User.loginWithWeapp(res.code).then(
            function (user) {

              var openid = user.get('authData').weapp.openid
              wx.setStorageSync('openid', openid)
              //保存用户其他信息到用户表
              promise.resolve(user);
            },
            function (err) {
              promise.reject(err);
            }
        )
      }
    })
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
        // that.initItemCallback(that.Data)
      },
      error: function (result, error) {
        console.log("添加 模板 失败")
        console.log(result)
        console.log(error)

      }
    });
  },
  //清除缓存
  clearStorage:function () {
    console.log('清除缓存')
    wx.clearStorage()
  },
  //获取拖延项单项数据
  getDataInitItem (id) {
    return new Promise((resolve, reject) => {

      let that = this
      var Mould = Bmob.Object.extend("delay_list");
      var query = new Bmob.Query(Mould);

      query.get(id,{
        success: function (res) {
          console.log("查找 拖延项 成功")
          console.log(res);
          that.Data.delayItem = res.attributes // 保存到全局
          that.Data.delayId = res.id // 保存到全局
          resolve(res)
        },
        error: function (error) {
          console.log("查找 模板数据 失败")
          reject(res)
        }
      });

    });
  },
  //获取自律工具记录数据
  getDataToolItem (code) {
    return new Promise((resolve, reject) => {
      var creatorId = this.User.id
      var Mould = Bmob.Object.extend("tool_list");
      var query = new Bmob.Query(Mould);

      query.equalTo("creatorId", creatorId);
      query.equalTo("code", code);
      query.first({
        success: function (res) {
          console.log("查找 工具数据 成功")
          console.log(res);
          if (res) {
            resolve(res)
          } else {
            reject('none')
          }

        },
        error: function (error) {
          console.log("查找 工具数据 失败")
          reject(res)
        }
      });

    });
  },

})