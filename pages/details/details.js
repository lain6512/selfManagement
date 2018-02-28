//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'details',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        // isShow_article: false,//显示参考说明弹框

    },
    //事件处理函数
    bindViewTap: function () {
    },

    onLoad: function () {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //获得article组件
        this.article = this.selectComponent("#article");
    },
    //参考文章弹出框
    /*showPopupAricle:function () {
        console.log("点击")
        this.setData({
            isShow_article:!this.data.isShow_article
        })
    },*/
    showDialog(){
        this.article.showPopupAricle();
    },
/*
    //取消事件
    _cancelEvent(){
        console.log('你点击了取消');
        this.article.hideDialog();
    },
    //确认事件
    _confirmEvent(){
        console.log('你点击了确定');
        this.article.hideDialog();
    }
*/

})
