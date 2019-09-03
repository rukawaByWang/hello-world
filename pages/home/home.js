// pages/home/home.js

import request from '../../service/network.js';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

var DrawPic = require('../../utils/drawPic.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    drawPic: [],
    imgCode: '',
    phoneNum: '',
    smsCode: '',
    imgError: '',
    phoneError: '',
    smsError: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.drawPic = new DrawPic({
      el: 'canvas',
      width: 80,
      height: 35,
      createCodeImg: ""
    });
  },

  //绑定手机号
  setPhoneNum(event){
    this.setData({
      phoneNum: event.detail.value
    })
  },
  //绑定图形验证码
  setImg(event){
    this.setData({
      imgCode: event.detail.value
    })
  },
  //绑定短信验证码
  setSMS(event){
    this.setData({
      smsCode: event.detail.value
    })
  },

  //刷新验证码
  onTap() {
    this.drawPic.refresh();
  },

  //验证验证码
  checkValue(){
    if (!this.data.phoneNum) {
      this.setData({
        phoneError: '请输入手机号'
      })
      return false;
    }else{
      this.setData({
        phoneError: ''
      })
    }
    if (!this.data.imgCode) {
      this.setData({
        imgError: '请输入图形验证码'
      })
      return false;
    }else{
      this.setData({
        imgError: ''
      })
    }

    var res = this.drawPic.validate(this.data.imgCode); 
    if (!res) {
      this.setData({
        imgError: '图形验证码错误'
      })
      return false;
    }

    return true;
  },

//发送短信验证
  sendSMS(){
    this.checkValue();
  },

//登录
  toLogin(){
    let vm = this;
    if(!vm.checkValue()){
      return;
    }
    if (!vm.data.smsCode) {
      debugger;
      vm.setData({
        smsError: '请输入短信验证码'
      })
      return;
    } else {
      vm.setData({
        smsError: ''
      })
    }

    //调用微信服务端接口获取
    wx.login({
      timeout: 2000,
      success: function(event){
        const jsCode = event.code;
        const phoneNum = vm.data.phoneNum;
        const smsCode = vm.data.smsCode;

        vm._getLoginInfo(jsCode, phoneNum, smsCode);
      },
      fail: function(event){
        console.log('err',event)
      }
    })
  },

  //向服务器发送登录请求
  _getLoginInfo(jsCode, phoneNum, smsCode){
    let vm = this;
    const params = {
      entity: {
        jsCode: jsCode,
        phoneNum: phoneNum,
        smsCode: smsCode
      }
    }
    request({
      data: params,
      method: "POST",
      url: "wxUser/getOpenId"
    }).then(res => {
      const code = res.data.result.code;
      if(code != '200'){
        Dialog.alert({
          message: res.data.result.message,
          zIndex: 9999
        }).then(() => {
          return false;
        });
      }
      //TODO 处理openid
      const openid = res.data.result.openid;
      const session_key = res.data.result.session_key;
      const gn_request_token = res.data.result.gn_request_token;
      //将token保存起来
      wx.setStorageSync("gn_request_token", gn_request_token);
      wx.setStorageSync("openid", openid);
      wx.setStorageSync("session_key", session_key);

      //登录成功,跳转页面
      wx.switchTab({
        url: "../personal/personal",
      })

    }).catch(err => {

    })
  }
})