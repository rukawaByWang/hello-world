import request from '../../service/network.js';
import WxValidate from '../../utils/WxValidate.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractList: [],// 合同列表
    showPopup: false, // 弹出框

    phone: '', // 合同关联的手机号
    authCode: '', // 验证码

    /**
     * 倒计时参数
     */
    second: 60, // 倒计时
    send: true, // 发送验证码
    errorPhone: '', // 手机错误提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    // 查询我的合同列表
    that.selectContractList();

    // 初始化表单
    this.initValidate();
  },

  // 表单验证字段及规则
  initValidate() {
    const rules = {
      phone: {
        required: true,
        tel: true
      },
      authCode: {
        required: true,
      }
    };

    const messages = {
      phone: {
        required: '请填写手机号',
        tel: '请输入正确的手机号码'
      },
      authCode: {
        required: '请填写验证码！',
      }
    };

    this.WxValidate = new WxValidate(rules, messages);
  },
  // 校验显示弹窗
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },

  // 打开绑定合同弹窗
  bindContract() {
    this.setData({
      showPopup: true
    });
  },

  // 关闭合同弹窗
  onClose() {
    this.setData({
      showPopup: false
    });
  },

  // 获取手机号
  getPhone(event) {
    var that = this;

    that.setData({
      phone: event.detail.value
    });
  },
  // 发送短信验证码
  sendSms() {
    var that = this;

    if(!that.data.phone) {
      that.setData({
        errorPhone: '请输入手机号'
      });
      return;
    } else {
      let judgePhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!judgePhone.test(that.data.phone)) {
        that.setData({
          errorPhone: '手机号格式不正确'
        });
        return;
      }

      that.setData({
        errorPhone: ''
      });
    }

    var userInfo = wx.getStorageSync('userInfo'); // 获取登陆用户的手机号

    let params = {
      entity: {
        smsCode: '190826e26481004d3c47',
        templateSignName: '库房无忧',
        templateId: 'SMS_173246545',
        templateName: '绑定合同短信验证码',
        templateType: '1'
      },
      phoneNumbers: that.data.phone,
      loginPhoneNum: userInfo.loginPhoneNum
    };

    request({
      url: 'sms/contractBindAuthCode',
      data: params,
      method: 'POST',
    }).then(res => {
      let result = res.data.result;

      if (result.entityList.length === 0) {
        wx.showToast({
          title: '该手机号没有关联的合同',
          icon: 'none',
          duration: 3000
        })
      } else {
        if (result.wxContractEntity != null) {
          wx.showToast({
            title: '该手机号关联的合同已绑定到您的账号下',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        // 倒计时发送验证码
        that.countdown();
      }
    }).catch(error => {
      console.log('异常消息：', error);
      wx.showToast({
        title: '合同查询失败',
        icon: 'none',
        duration: 2000
      })
    })
  },
  countdown: function() {
    var that = this;

    var nsecond = 60;
    var appCount = setInterval(function() {
      nsecond -= 1;

      that.setData({
        second: nsecond,
        send: false
      });

      if (nsecond < 1) {
        clearInterval(appCount);
        that.setData({
          send: true,
          second: 60
        })
      };
    }, 1000);
  },

  // 绑定合同，输入手机号和验证码
  formSubmit(event) {
    let that = this;

    if (!that.WxValidate.checkForm(event.detail.value)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    }

    var userInfo = wx.getStorageSync('userInfo');
    var loginPhoneNum = userInfo.loginPhoneNum;

    let params = {
      entity: {
        loginPhoneNum: loginPhoneNum
      },
      bindContractPhone: event.detail.value.phone,
      authCode: event.detail.value.authCode
    };

    request({
      url: 'wxContract/bindContract',
      data: params,
      method: 'POST',
    }).then(res => {
      let result = res.data.result;

      if(result > 0) {
        this.setData({
          showPopup: false,
          phone: '',
          authCode: ''
        });

        that.selectContractList();
      }
    }).catch(error => {
      console.log('异常消息：', error);
      wx.showToast({
        title: '合同查询失败',
        icon: 'none',
        duration: 2000
      })
    })
  },

  // 查询合同列表
  selectContractList() {
    var that = this;

    var userInfo = wx.getStorageSync('userInfo');

    let params = {
      entity: {
        loginPhoneNum: userInfo.loginPhoneNum
      }
    };

    request({
      url: 'wxContract/list',
      data: params,
      method: 'POST',
    }).then(res => {
      that.setData({
        contractList: res.data.result
      });
    }).catch(error => {
      console.log(error);
    })
  },
})