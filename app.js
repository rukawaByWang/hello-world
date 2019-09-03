//app.js
import request from '/service/network.js';
App({
  onLaunch: function() {
    this._checkLogin()

  },

  globalData: {
    userInfo: null,
    isLogined: false,
    jsCode: ''
  },

  //检查是否已登录
  _checkLogin() {
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      this.globalData.isLogined = false;
      return
    }

    if (!this._checkToken()) {
      this.globalData.isLogined = true;
      this.globalData.userInfo = wx.getStorageSync('userInfo');
    } else {
      this.globalData.isLogined = false;
    }
  },

  //验证token
  _checkToken() {
    var token = wx.getStorageSync('gn_request_token');
    if (!token) {
      return false;
    }

    //验证token是否过期
    let params = {
      base64Token: token,
      entity: {

      }
    }

    request({
      url: 'wxCustomer/tokenExpire',
      method: 'POST',
      data: params
    }).then(res => {
      console.log('res', res.data.result)
      return (res.data.result)
    }).catch(res => {
      console.log('err')
      return true
    })
  },

  
})