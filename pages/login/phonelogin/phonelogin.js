import request from '../../../service/network.js';
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';

var DrawPic = require('../../../utils/drawPic.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    smsText: '获取验证码',
    has_send_sms: false,
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
  setPhoneNum(event) {
    let judgePhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    let value = event.detail.value;
    setTimeout(() => {
      if (!judgePhone.test(value)) {
        this.setData({
          phoneError: '请输入正确的手机号'
        })
        return false;
      }else{
        this.setData({
          phoneError: '',
          phoneNum: value
        })
        return true;
      }
    }, 100);
  },
  //绑定图形验证码
  setImg(event) {
    this.setData({
      imgCode: event.detail.value
    })
  },
  //绑定短信验证码
  setSMS(event) {
    this.setData({
      smsCode: event.detail.value
    })
  },

  //刷新验证码
  onTap() {
    this.drawPic.refresh();
  },

  //验证验证码
  checkValue() {
    if (!this.data.phoneNum) {
      this.setData({
        phoneError: '请输入正确的手机号'
      })
      return false;
    } else {
      this.setData({
        phoneError: ''
      })
    }
    if (!this.data.imgCode) {
      this.setData({
        imgError: '请输入图形验证码'
      })
      return false;
    } else {
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
  sendSMS() {
    let vm = this
    //校验手机号与图形验证码
    if (!vm.checkValue()) {
      return;
    }

    //将获取验证码按钮置为倒计时
    var i = 60
    var sms =  setInterval(function(){
      if(i > 0){
        vm.setData({
          smsText: i+'秒',
          has_send_sms: true
        })
      }else{
        clearInterval(sms)
        vm.setData({
          smsText: '获取验证码',
          has_send_sms: false
        })
      }
      i--
    },1000)

    //请求后台发送验证码
    let params = {
      phoneNumbers: this.data.phoneNum,
      entity: {
        smsCode: '190826a7f279b87f4340',
        templateSignName: '库房无忧',
        templateId: 'SMS_172888239',
        templateName: '微信小程序登录验证',
        templateType: '1'
      }
    }
    request({
      url: 'sms/wxLoginSMS',
      data: params,
      method: 'POST'
    }).then(res => {

    }).catch(err => {

    })
  },

  //登录
  toLogin(event) {
    let vm = this;
    if (!vm.checkValue()) {
      return;
    }
    if (!vm.data.smsCode) {
      vm.setData({
        smsError: '请输入短信验证码'
      })
      return;
    } else {
      vm.setData({
        smsError: ''
      })
    }

    const jsCode = app.globalData.jsCode;
    const phoneNum = vm.data.phoneNum;
    const smsCode = vm.data.smsCode;
    vm._getLoginInfo(jsCode, phoneNum, smsCode);

    //调用微信服务端接口获取jsCode
    
  },

  //向服务器发送登录请求
  _getLoginInfo(jsCode, phoneNum, smsCode) {
    let vm = this;
    const params = {
      entity: {
        jsCode: jsCode,
        loginPhoneNum: phoneNum,
        smsCode: smsCode
      }
    }
    request({
      data: params,
      method: "POST",
      url: "wxCustomer/phoneLogin"
    }).then(res => {
      const code = res.data.result.code;
      if (code && code == '202') {
        Dialog.alert({
          message: res.data.result.message,
          zIndex: 9999
        })
        return false;
      }
      //处理openid
      const userInfo = res.data.result
      const gn_request_token = userInfo.gn_request_token;
      //将token保存起来
      wx.setStorageSync("gn_request_token", gn_request_token);
      wx.setStorageSync("userInfo", userInfo);

      app.globalData.isLogined = true;
      app.globalData.userInfo = userInfo;

      //登录成功,跳转页面
      wx.reLaunch({
        url: "../../personal/personal",
      })

    }).catch(err => {
      Toast.fail('系统异常');
    })
  }
})