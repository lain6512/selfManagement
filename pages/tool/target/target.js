//工具号#01
var Init = require('../../../utils/initUserInfo.js');
var Bmob = require('../../../utils/bmob.js');
// /获取应用实例
const app = getApp()

Page({
  data: {
    initFinish:false,//初始化状态
    isEdit:false,
    myTool:'tool_01', //拖延策略编号
    toolItem:'',
    toolId:'',

    txtInput:'',
    txt:'',
    txt2:'',
    txt3:'',
    flag:1,
    state:0,
    txtArr:[
        'Specific(具体的)：目标是否描述得够具体？',
        'Measurable(可衡量)：目标是否可以量化？比如有具体的数字描述',
        'Attainable(可实现)：目标是否在付出努力的情况下可以实现？避免设立过高或过低的目标',
        'Relevant(相关性)：是否与你的更长远的目标是相关联的？',
        'Time-bound(有时限)：是否有明确完成时期？',
    ],
    txtArrIndex:0,
  },

  onLoad: function (options) {

    let that = this
    Init.user(app, that, state => {
      app.getDataToolItem(this.data.myTool).then(res => {

        that.setData({
          toolItem: res.attributes,
          toolId: res.id,
        })

        if (res.attributes.dataInfo[this.data.myTool]) {
          that.setData({
            isEdit: true,
            state: 3,
            txt1: res.attributes.dataInfo[this.data.myTool].txt1,
            txt2: res.attributes.dataInfo[this.data.myTool].txt2,
            txt3: res.attributes.dataInfo[this.data.myTool].txt3,
          })
        }

      }).catch(res =>{
        if (res == 'none') {
          console.log('找不到数据')
        }
      })

    })
  },
  click1 (e) {
    console.log('e')
    console.log(typeof  e.currentTarget.dataset.type)
    console.log(this.data['txt'+e.currentTarget.dataset.type])
    setTimeout(function (){

      this.setData({
        state: 1,
        flag: e.currentTarget.dataset.type,
        txtInput: this.data['txt'+e.currentTarget.dataset.type] || '',
        txtArrIndex: 0,
      })

    }.bind(this), 500)

  },
  //写入完毕提交
  click2 () {
    setTimeout(function (){
      if (this.data.txtInput == '') {
        wx.showToast({
          icon:'none',
          title: '什么都没写，发现懒癌晚期患者一个！'
        });
        return
      }

      if (this.data.flag == '1') {
        this.setData({txt1: this.data.txtInput,})
      } else if (this.data.flag == '2') {
        this.setData({txt2: this.data.txtInput,})
      } else if (this.data.flag == '3') {
        this.setData({txt3: this.data.txtInput,})
      }

      this.setData({
        state: 2,
      })

    }.bind(this), 300)

  },
  clickEdit () {
    this.setData({
      state: 1,
    })
  },
  clickPass () {
    if (this.data.txtArrIndex == 4) {
      //5项原则通过
      console.log('保存数据')
      if (this.data.isEdit) {
        this.saveGo()
      } else {
        this.saveAdd()
      }

    } else {
      this.setData({
        state: 2,
        txtArrIndex: this.data.txtArrIndex + 1,
      })
    }

  },
  click3 () {
    wx.navigateBack({
      delta:100,
    })
  },
  //修改
  click4(){
    this.setData({
      state: 0,
    })
  },
  txt1blur(e){
    this.setData({
      txtInput: e.detail.value
    })
  },
  //提交保存
  saveGo () {
    let that = this
    let id = this.data.toolId
    var Mould = Bmob.Object.extend("tool_list");
    var query = new Bmob.Query(Mould);

    query.get(id,{
      success: function (data) {
        console.log("查找 拖延项 成功")
        console.log(data);

        let info = data.attributes.dataInfo
        info[that.data.myTool] = {
          txt1:that.data.txt1,
          txt2:that.data.txt2,
          txt3:that.data.txt3,
          date:new Date()
        }
        data.set('dataInfo',info)
        data.save(null,{
          success: function (res) {
            console.log("保存 成功")
            console.log(res)

            that.setData({
              state: 3,
            })
          },
          error: function (data) {
            console.log("保存失败")
          },
        })
      },
      error: function (data) {
        console.log("保存失败")
        console.log(data)
      },
    });
  },
  //新增一条数据
  saveAdd () {
    var that = this
    var type = 1 //1：自律工具
    var type2 = 0
    var title = '我的目标'
    var creatorId = app.User.id
    var creatorName = app.User.attributes.nickName

    var Record = Bmob.Object.extend("tool_list");
    var record = new Record();

    var obj={
      userInfo:app.User,
      title:title,
    }
    obj[this.data.myTool] = {
      txt1:this.data.txt1,
      txt2:this.data.txt2,
      txt3:this.data.txt3,
      date:new Date()
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
    record.set('finish', 0);
    record.set('type', type);
    record.set('type2', type2);
    record.set('title', title);
    record.set('code', this.data.myTool);
    record.save({
      success: function(object) {
        console.log("新建 成功")
        console.log(object)

        that.setData({
          state: 3,
        })

      },
      error: function(object, error) {
        console.log("新建 失败")
        console.log(error)

      }
    });


  }




})
