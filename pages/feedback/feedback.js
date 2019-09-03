import baseURL from '../../service/config.js';
import request from '../../service/network.js';
import WxValidate from '../../utils/WxValidate.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0, // 意见反馈tab标签，默认
    baseURL: baseURL, // 默认URL

    // 表单实体
    feedbackObj: {
      fbTitle: '',
      fbType: '',
      fbDescription: '',
      askQuestionName: '',
      askQuestionPhone: '',
      device: '2' // 设备类型默认为2（微信小程序）
    }, 
    imageList: [], // 图片集合

    optionList: [
      {
        value: "1",
        label: "硬件设备相关"
      },
      {
        value: "2",
        label: "软件系统相关"
      },
      {
        value: "3",
        label: "服务相关"
      },
      {
        value: "4",
        label: "其他"
      }
    ],

    // 我的反馈集合
    myFeedbackList: [],
  },

  onLoad() {
    // 初始化表单
    this.initValidate();
  },
  // 表单验证字段及规则
  initValidate() {
    const rules = {
      fbTitle: {
        required: true,
        minlength: 4
      },
      fbTypeName: {
        required: true,
      },
      fbDescription: {
        required: true
      },
      askQuestionName: {
        required: true
      },
      askQuestionPhone: {
        required: true,
        tel: true
      }
    };

    const messages = {
      fbTitle: {
        required: '请填写标题',
        minlength: '标题长度最少4个字符'
      },
      fbTypeName: {
        required: '请选择反馈类型',
      },
      fbDescription: {
        required: '请填写问题描述'
      },
      askQuestionName: {
        required: '请填写您的称呼'
      },
      askQuestionPhone: {
        required: '请填写手机号',
        tel: '请输入正确的手机号码',
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

  // 反馈类型选择
  bindPickerChange(e) {
    let index = parseInt(e.detail.value); // 获取选择的下标

    let obj = this.data.optionList[index];

    this.data.feedbackObj.fbType = obj.value;

    // feedbackObj.fbTypeName赋值，回显
    var fbTypeName = "feedbackObj.fbTypeName";
    this.setData({
      [fbTypeName]: obj.label
    });
  },

  // 上传图片
  handleUpload() {
    var that = this;

    wx.chooseImage({
      success(res) {
        res.tempFilePaths.forEach((element, index, array) => {
          that.data.imageList.push(element);
        });

        that.setData({
          imageList: that.data.imageList
        });
      }
    })
  },

  // 删除图片
  handleClose(event) {
    let that = this;

    let index = event.target.dataset.index;
    that.data.imageList.splice(index, 1);

    that.setData({
      imageList: that.data.imageList
    });
  },

  // 提交
  formSubmit(event) {
    var that = this;

    var count = 0;
    var fileCodeArr = [];

    if (!that.WxValidate.checkForm(event.detail.value)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    // this.showModal({
    //   msg: '提交成功'
    // })

    // 表单字段
    that.data.feedbackObj.fbTitle = event.detail.value.fbTitle;
    that.data.feedbackObj.fbDescription = event.detail.value.fbDescription;
    that.data.feedbackObj.askQuestionName = event.detail.value.askQuestionName;    
    that.data.feedbackObj.askQuestionPhone = event.detail.value.askQuestionPhone;

    var userInfo = wx.getStorageSync('userInfo');
    var loginPhoneNum = userInfo.loginPhoneNum;
    var openid = userInfo.openid;

    if (that.data.imageList.length != 0) {
      that.data.imageList.forEach((element, index, array) => {
        wx.uploadFile({
          url: baseURL + 'file/upload',
          filePath: element,
          name: 'file',

          success(res) {
            const data = res.data;
            let rp = JSON.parse(data);
            let fileCode = rp.result[0].fileCode;
            count = count + 1;
            fileCodeArr.push(fileCode);

            // 文件上传成功后执行创建问题反馈
            if (count === that.data.imageList.length) {
              that.data.feedbackObj.fbImg = fileCodeArr.join(',')

              let params = {
                entity: that.data.feedbackObj,
                loginPhoneNum: loginPhoneNum,
                openid: openid
              };

              that.cretaeFeedback(params);
            }
          }
        })
      });
    } else {
      let params = {
        entity: that.data.feedbackObj,
        loginPhoneNum: loginPhoneNum,
        openid: openid
      };
      that.cretaeFeedback(params);
    };
  },
  // 新增问题反馈
  cretaeFeedback(params) {
    let that = this;

    var userInfo = wx.getStorageSync('userInfo');
    var loginPhoneNum = userInfo.loginPhoneNum;
    var openid = userInfo.openid;

    request({
      url: 'wxFeedback/create',
      data: params,
      method: 'POST',
    }).then(res => {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      });

      that.setData({
        feedbackObj: {},
        imageList: []
      });
    }).catch(error => {
      console.log(error);
    })
  },

  // 我的反馈
  clickTab() {
    let that = this;

    var userInfo = wx.getStorageSync('userInfo');
    var loginPhoneNum = userInfo.loginPhoneNum;
    var openid = userInfo.openid;

    let params = {
      entity: {},
      loginPhoneNum: loginPhoneNum,
      openid: openid
    };

    request({
      url: 'wxFeedback/list',
      data: params,
      method: 'POST',
    }).then(res => {
      that.setData({
        myFeedbackList: res.data.result
      });
    }).catch(error => {
      console.log(error);
    })
  }
})