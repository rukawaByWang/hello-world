// pages/personal/personal.js
import request from '../../service/network.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogined: false,
    loginPhoneNum: '',
    showContact: false,
    actions: [{
        name: "400-820-2058",
        id: "400"
      },
      {
        name: "取消",
        id: "cancel"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._checkLogin();
  },

  toContact() {
    this.setData({
      showContact: true
    })
  },

  onSelect(event) {
    const id = event.detail.id;
    const vm = this;
    if (id == "cancel") {
      this.onClose();
    } else if (id == '400') {
      wx.makePhoneCall({
        phoneNumber: '400-820-2058',
        success: function(event) {
          this.onClose();
        },
        fail: function(event) {
          console.log(event)
        }
      })
    }
  },

  onClose(event) {
    this.setData({
      showContact: false
    })
  },

//校验是否已登录
  _checkLogin() {
    var isLogined = app.globalData.isLogined;
    if (isLogined) {
      var loginPhoneNum = app.globalData.userInfo.loginPhoneNum;
      var hindPhoneNum = this._hindPhoneNum(loginPhoneNum);

      this.setData({
        isLogined: isLogined,
        loginPhoneNum: hindPhoneNum
      })
    }
  },

  //进入登录界面
  toLogin() {
    console.log(1111)
    wx.navigateTo({
      url: '../login/login',
    })
  },

  //隐藏手机号
  _hindPhoneNum(loginPhoneNum) {
    var prefix = loginPhoneNum.substring(0, 3);
    var suffix = loginPhoneNum.substring(7, loginPhoneNum.length)
    var hindNum = prefix + '****' + suffix;
    return hindNum;
  },

//退出
  loginOut(){
    let vm = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出吗？',
      success: function (sm) {
        if (sm.confirm) {
          vm._clearLogin()
        }
      }
    })
  },

  //清空登录
  _clearLogin(){
    wx.removeStorage({
      key: 'userInfo'
    });
    wx.removeStorage({
      key: 'gn_request_token'
    });
    app.globalData.isLogined = false;
    app.globalData.userInfo = '';
    app.globalData.jsCode = '';

    this.setData({
      isLogined: false,
      loginPhoneNum: ''
    })
  },

  // 跳转到合同列表页
  toContractList () {
    let that = this;

    var gn_request_token = wx.getStorageSync('gn_request_token'); // 获取登陆token

    if (!gn_request_token) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      wx.navigateTo({
        url: '/pages/contract/contract'
      });
    }
  },

  // 跳转到问题反馈页
  toFeedback() {
    let that = this;

    var gn_request_token = wx.getStorageSync('gn_request_token'); // 获取登陆token

    if (!gn_request_token) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      wx.navigateTo({
        url: '/pages/feedback/feedback'
      });
    }
  }
})