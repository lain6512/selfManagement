//index.js
var Bmob = require('../../utils/bmob.js');
var Init = require('../../utils/initUserInfo.js');
var { TimeDifference,dateToString,generateId,isInArr } = require('../../utils/tool.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    isShow_textarea:false,
    isShow_medal:false,
    isShow_itemLink:false,

    type:1,//记录类型 1：好习惯，2：坏习惯
    inputValue:'',
    textareaValue:'',
    itemId:'',//选项id
    itemValue:'',//选项标题
    itemGoodHistory:[],
    itemGood:[],//选项数据
    itemSaveId:[],//新建成功后的那一条数据id
    allowRecordTime: 0, //允许记录的间隔时间 单位：分
    placeholderTxt:['例如：学习半小时','例如：熬夜'],
    arrayPicker:['不公开','公开记录，小伙伴们能看到'],
    indexPicker:'1',
    dynamicId:'', // 动态记录的id，只有弹窗时候记录

  },

  onLoad: function (options) {
    let that = this
    this.setData({
      type: parseInt(options.type)
    })
    Init.user(app,that,state=> {
      that.getDataInitItem()

      console.log('app.User')
      console.log(app.User)
      // 是否公开
      let isOpen = app.User.attributes.isOpen
      if (!isOpen || isOpen == '0') {
        isOpen == '0'
      } else {
        isOpen == '1'
      }
      that.setData({
        indexPicker: isOpen
      })
      console.log('indexPicker')
      console.log(that.data.indexPicker)

    })
  },
  //2.获取数据
  getDataInitItem(){
    var that = this
    var type = this.data.type //记录类型 1：好习惯，2：坏习惯
    var Record = Bmob.Object.extend("habit_init_item");
    var query = new Bmob.Query(Record);

    query.equalTo("type", type);
    query.limit(300);
    query.descending('updatedAt');
    query.find({
      success: function(object) {
        console.log("查找成功")
        console.log(object)

        that.setData({
          itemGood: object,
        })
        that.showItemHistory()

      },
      error: function(object, error) {
        console.log("查找失败")
        console.log(error)

      }
    });
  },
  //3.显示用户记录
  showItemHistory(){
    var type = this.data.type //记录类型 1：好习惯，2：坏习惯
    var arr = this.data.itemGood;
    var habitItemArr = app.User.attributes.habitItemArr

    if(Array.isArray(habitItemArr) && habitItemArr.length > 0){

      console.log('数组不为空')
      var arrH = []
      app.User.attributes.habitItemArr.forEach(item=>{
        arrH.push(item.itemId)
      })

      //对比删除已选的选项
      for (var i = arr.length - 1; i >= 0; i--) {
        if (isInArr(arrH,arr[i].id)) {
          arr.splice(i,1)
        }
      }

      var arrH2 = []
      app.User.attributes.habitItemArr.forEach(item=>{
        if (item.type == type) {
          arrH2.push(item)
        }

      })

      this.setData({
        itemGoodHistory: arrH2,
        itemGood: arr
      })

    }else{
      console.log('数组为空')
      habitItemArr =[]

      this.setData({
        itemGoodHistory: [],
        itemGood: arr
      })
    }




  },

  //linkTo 单项记录
  linkHabitItemList(){
    this.setData({
      isShow_textarea:false,
      isShow_medal:false,
      // isShow_itemLink:false
    })
    wx.navigateTo({
      url: '/pages/habitItemList/habitItemList?id='+this.data.itemId +'&type=' + this.data.type
    })
  },
  //linkTo 全部记录
  linkHabitList(){
    this.setData({
      isShow_textarea:false,
      isShow_medal:false,
      isShow_itemLink:false
    })
    wx.navigateTo({
      url: '/pages/habitList/habitList?type='+this.data.type
    })
  },

  //显示输入框
  showTextarea(){
    this.setData({
      isShow_textarea: true
    })
  },
  //关闭弹窗
  close(){
    this.setData({
      isShow_medal:false,
      itemSaveId:'',
      dynamicId:''
    })
  },
  //关闭输入框
  closeTextarea(){
    this.setData({
      isShow_textarea:false,
      textareaValue:''
    })
  },
  //输入框输入
  inputOnKey(e){
    var arrAll = []
    var id,
        link

    this.data.itemGood.forEach(function (item, index) {
      item.attributes.itemId = item.id
      arrAll.push(item.attributes)
    })

    arrAll = arrAll.concat(this.data.itemGoodHistory)

    arrAll.forEach((item,n)=>{
      if (item.title == e.detail.value){
        id = item.itemId
      } else {
        id = ''
      }
    })

    for (var i = 0; i < arrAll.length; i++) {
      if (arrAll[i].title == e.detail.value){
        id = arrAll[i].itemId
        break
      } else {
        id = ''
      }
    }
    this.setData({
      itemId: id,
      inputValue: e.detail.value,
      isShow_itemLink: false
    })


  },
  //文本框输入
  bindTextAreaBlur: function(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  // 是否公开选框
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', )
    console.log(e.detail.value)
    console.log(app.User)

    let that = this
    let val = e.detail.value
    var user = Bmob.User.current();

    user.set("isOpen", val);
    user.save(null, {
      success: function (user) {
        console.log("用户表保存成功:");
        console.log(user);

        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 3000
        })

        that.setData({
          indexPicker: e.detail.value
        })

      },
      error: function(object, error) {
        console.log("用户表保存 失败")
        console.log(error)

      }
    });

  },

  //点击选项
  tipsClick(e){
    console.log(e.target.dataset)
    var isShow_itemLink
    if(e.target.dataset.isrecord == 'Y'){
      isShow_itemLink = true
    }else{
      isShow_itemLink = false
    }


    this.setData({
      inputValue: e.target.dataset.value,
      isShow_itemLink: isShow_itemLink,
      itemId: e.target.dataset.id,
    })
  },


  //点击提交记录
  recordStart(e){

    if(this.data.inputValue ==''){
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 3000
      });
      return
    }
    wx.showLoading({
      title:'正在保存...',
      mask:true
    })


    Init.upDateNickName(app,e).then(res=>{
      console.log('保存后then（）执行')
      console.log("app.User:")
      console.log(app.User)

      if(this.data.itemId && this.data.itemId !=''){
        this.findDateRecord(this.data.itemId)
      }else{
        this.newDateRecord(null,true)
      }

    })

  },
  //查找数据
  findDateRecord(itemId){
    var that = this
    var itemId = itemId
    var Record = Bmob.Object.extend("habit_record_list");
    var query = new Bmob.Query(Record);

    query.equalTo("itemId",itemId );
    query.descending('createdAt');
    query.first({
      success: function(object) {
        console.log("查找成功")
        console.log(object)
        if(object == undefined || object == ''){
          that.newDateRecord(object,true)
        }else{
          that.newDateRecord(object,false)
        }
      },
      error: function(object, error) {
        console.log("查找失败")
        console.log(error)

      }
    });
  },
  //2.创建一条数据, isFirst {boolean}, true:第一次创建
  newDateRecord(object,isFirst){
    var that = this
    var type = this.data.type //1:好习惯；2：坏习惯
    var itemId = this.data.itemId
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName
    var title = this.data.inputValue
    var isOpen = this.data.indexPicker

    console.log("User")
    console.log(app.User)

    // return
    var day=''
    if(isFirst){
      day ='第一次创建'
    }else{
      console.log("isFirst:"+isFirst)

      var time1 = object.createdAt
      // var time1 = '2018-05-01 00:00:12'
      var time2 = dateToString(new Date())
      console.log("time1")
      console.log(time1)
      console.log("time2")
      console.log(time2)

      var fen = TimeDifference(time1,time2)
      // var fen = 1
      var tian =  Math.floor(fen / 60 / 24)
      console.log("分：" + fen)
      console.log("天：" + tian)

      if(tian<1){
        day ='连续记录'
      }else {
        day =  tian +'天'
      }

      //如果不够5分钟，禁止记录
      if (fen < this.data.allowRecordTime) {
        wx.showToast({
          icon:'none',
          title: '记录过于频繁'
        });
        return
      }
    }

    var info = {
      day:day,
    }

    //判断是否自己输入
    if(!itemId){
      itemId = generateId(5) //随机生成一个id
    }


    var Record = Bmob.Object.extend("habit_record_list");
    var record = new Record();

    //角色权限
    var groupACL = new Bmob.ACL();
    var userList = [app.User.id];
    for (var i = 0; i < userList.length; i++) {
      groupACL.setReadAccess(userList[i], true);
      groupACL.setWriteAccess(userList[i], true);
    }
    groupACL.setReadAccess("*", true);
    record.setACL(groupACL);

    record.set('info', info);
    record.set('creatorName', creatorName);
    record.set('creatorId', creatorId);
    record.set('title', title);
    record.set('type', type);
    record.set('itemId', itemId);
    record.set('isOpen', isOpen);

    record.save({
      success: function(object) {
        console.log("新建 成功")
        console.log(object)
        that.setData({
          itemSaveId: object.id,
          itemId: itemId
        })

        var infoObj ={
          title:title,
          day:day
        }
        that.addDateDynamic(type,infoObj,function () {
          that.showPopup()
          that.updatedUser(itemId,type)
        })
      },
      error: function(object, error) {
        console.log("新建 失败")
        console.log(error)

      }
    });

  },
  //3.添加成功显示弹窗
  showPopup(){
    wx.hideLoading()
    this.setData({
      isShow_medal: true
    })
    setTimeout(function () {
      this.sound()
    }.bind(this), 620)
  },
  //4.提交输入框
  submitTextarea(){

    console.log("textareaValue:"+this.data.textareaValue)
    if(this.data.textareaValue == ''){
      wx.showToast({
        icon:'none',
        title: '您还没写任何东西！把感受说出来，释放压抑，更有利于坚持！',
        duration:5000

      });
      return
    }
    if(this.data.itemSaveId !=''){
      this.updatedDataMood()
    }
  },
  //5.记录心情
  updatedDataMood(){

    console.log("itemId:"+this.data.itemSaveId)
    // debugger
    var that = this
    var id = this.data.itemSaveId
    var Record = Bmob.Object.extend("habit_record_list");
    var query = new Bmob.Query(Record);

    query.get(id,{
      success: function(object) {
        console.log("查找成功")
        console.log(object)
        if(object != undefined || object != ''){

          object.set('introduce', that.data.textareaValue);
          object.save(null,{
            success: function(obj) {
              console.log("obj:")
              console.log(obj)
              that.editDataDynamic() // 修改动态记录

              wx.showToast({icon: 'success',title:'', duration: 3000});
              setTimeout(function(){
                that.linkHabitItemList()
              }.bind(this),2000)
              that.closeTextarea()
              that.close()
            }
          })

        }
      },
      error: function(object, error) {
        console.log("查找失败")
        console.log(error)

      }
    });
  },
  //6.记录用户表
  updatedUser(itemId,type){
    var type = type
    var user = Bmob.User.current();
    var obj ={
      title:this.data.inputValue,
      itemId:itemId,
      type:type
    }


    var arr = user.attributes.habitItemArr
    if(Array.isArray(arr) && arr.length > 0){
      if (!this.isHaveItemId(itemId)) {
        arr.push(obj)
      }
    }else{
      arr = [obj]
    }
    console.log("arr")
    console.log(arr)

    user.set("habitItemArr", arr);
    user.save(null, {
      success: function (user) {
        console.log("用户表保存成功:");
        console.log(user);
      },
      error: function(object, error) {
        console.log("用户表保存 失败")
        console.log(error)

      }
    });

  },
  //判断是否含有改选项
  isHaveItemId(itemId){
    var user = Bmob.User.current();
    var arr = user.attributes.habitItemArr
    var isHave = false
    for(var i =0;i<arr.length;i++){
      if (arr[i].itemId == itemId){
        isHave = true
        break
      }else {
        isHave = false
      }
    }
    console.log('isHave:' + isHave)
    return isHave
  },

  //6.记录动态表
  addDateDynamic(type,infoObj,back){
    var that = this
    var dynamicType= type == 1? '2':'3' //0:早睡；1：早起; 2,记录好习惯; 3,记录坏习惯
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName
    var creatorInfo = app.User.attributes.userInfo
    var isOpen = this.data.indexPicker

    var Dynamic = Bmob.Object.extend("dynamic_user");
    var record = new Dynamic();

    var obj={
      creatorId:creatorId,
      creatorName:creatorName,
      date:new Date().format('yyyy-MM-dd h:m:s'),
      typeRecord:dynamicType,
      medal:1,
      result:'',
      info:infoObj,
      creatorInfo:creatorInfo
    }

    record.set('info', obj);
    record.set('creatorName', creatorName);
    // record.set('dres', creatorName);
    record.set('creatorId', creatorId);
    record.set('type', dynamicType);
    record.set('isOpen', isOpen);

    record.save({
      success: function(object) {
        console.log("新建动态 成功")
        console.log(object)
        back()
        that.delDateDynamic()
        that.setData({
          dynamicId: object.id
        })
      },
      error: function(object, error) {
        console.log("新建动态 失败")
        console.log(error)

      }
    });
  },
  //7.超过额定数量删除记录
  delDateDynamic(){
    var that = this
    var num = app.config.dynamicNum;//最多记录的数量
    var Dynamic = Bmob.Object.extend("dynamic_user");
    var query = new Bmob.Query(Dynamic);


    query.count({
      success: function(count) {
        console.log("查找数据数量 成功")
        if(count >= num){

          query.descending('creadorIdAt');
          query.first({
            success: function(object) {
              console.log("查找1条数据 成功")
              console.log(object)
              object.destroy({
                success: function(myObject) {
                  console.log("删除成功")
                  console.log(object)
                },
                error: function(myObject, error) {
                  console.log("删除失败")
                  console.log(object)
                }
              });

            },
            error: function(error) {
              console.log("查找1条数据 失败: " + error.code + " " + error.message);
            }
          });
        }
      },
      error: function(error) {
        // 查询失败
      }
    });
  },
  // 修改 动态表
  editDataDynamic () {
    if (!this.data.dynamicId) {
      console.log('dynamicId 不存在')
      return
    }

    let that = this
    let id = this.data.dynamicId
    let comment = that.data.textareaValue
    var Record = Bmob.Object.extend("dynamic_user");
    var query = new Bmob.Query(Record);
    ;
    query.get(id,{
      success: function (object) {
        console.log("查找动态 成功")
        console.log(object)

        let info = object.attributes.info
        info.comment = comment
        object.set('info', info)
        object.save().then(function (data) {
          console.log("修改动态 成功")
          console.log(data)

        }, function (error) {
          console.log("修改动态 失败")
          console.log(error)
        });


      },
      error: function(object, error) {
        console.log("查找失败")
        console.log(error)

      }
    });

  },





  //音频
  sound(){
    console.log("执行 sound（）")
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/image/wav7.mp3'
    innerAudioContext.volume = 0.8
    innerAudioContext.onPlay(() => {
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

})
