// pages/login/login.js
import Toast from '../..//miniprogram_npm/vant-weapp/toast/toast';
import request from '../../service/network.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._wxLogin();
  },

  wxLogin(e){
    if (!e.detail.encryptedData){
      return false;
    }
    let vm = this;
    // Toast.fail('抱歉,暂不支持微信登录');
    let jsCode = app.globalData.jsCode;

    vm._to_wx_login_server(jsCode, e.detail);
  },

  phoneLogin(){
    wx.navigateTo({
      url: './phonelogin/phonelogin',
    })
  },

//请求后台接口登录
  _to_wx_login_server(jsCode, cipherTextJson){
    var ciStr = JSON.stringify(cipherTextJson);
    let params = {
      cipherTextJson: ciStr,
      entity: {
        jsCode: jsCode,
      }
    }
    request({
      url: 'wxCustomer/wxLogin',
      method: 'POST',
      data: params
    }).then(res => {
      const userInfo = res.data.result
      if (!userInfo.loginPhoneNum){
        Toast.fail('授权失败,请稍后重试');
        return false;
      }

      const gn_request_token = userInfo.gn_request_token;
      //将token保存起来
      wx.setStorageSync("gn_request_token", gn_request_token);
      wx.setStorageSync("userInfo", userInfo);

      app.globalData.isLogined = true;
      app.globalData.userInfo = userInfo;

      //登录成功,跳转页面
      wx.reLaunch({
        url: "../personal/personal",
      })
    }).catch(err => {
      console.log('wx login err')
    })
  },

  //调用小程序登录接口
  _wxLogin() {
    wx.login({
      timeout: 2000,
      success: function (event) {
        app.globalData.jsCode = event.code;
      }
    })
  }

})