var Bmob = require('./bmob.js');

/**
 * 初始化用户信息，把
 * @param app {obj} 小程序主对象
 * @param that {obj} 页面中的 this
 * @param cb {fun}
 */
function user(app, that, cb) {
  // console.log('user()')
  app.bmobLogin()
      .then(function (state) {
        that.setData({
          initFinish: state,
        })
        typeof cb == 'function' && cb(state)
      })
}

/**
 * 微信授权获取用户昵称专用，如果未授权，则更新数据库昵称信息
 * @param app {obj} 小程序主对象
 * @param e {event} 微信指定授权按钮 bindgetuserinfo=''的点击事件
 * @returns {*|Bmob.Promise} 用户信息
 */
function upDateNickName(app, e) {
  var promise = new Bmob.Promise();
  var userInfo = e.detail.userInfo;

  if (userInfo == undefined) {
    console.log(' userInfo -undefined')
    promise.reject(false)
  } else {

    if (!app.User.attributes.nickName) {
      console.log('获取用户昵称')
      var user = new Bmob.User() //实例化对象
      user.getUserInfo(userInfo, function () {
        promise.resolve(userInfo);
      })
    } else {
      promise.resolve(userInfo);
    }

  }

  return promise._thenRunCallbacks({});

}

module.exports.user = user
module.exports.upDateNickName = upDateNickName