import request from '../../../service/network.js';
import dateUtil from '../../../utils/dateUtil.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractObj: {}, // 合同实体
    incDetailCaseList: [], // 递增集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let ctCode = options.ctCode;

    let params = {
      entity: {
        ctCode: ctCode
      }
    };

    request({
      url: 'wxContract/detail',
      data: params,
      method: 'POST',
    }).then(res => {
      // let contractStartTime = res.data.result.contractStartTime;
      // let contractEndTime = res.data.result.contractEndTime;
  
      // res.data.result.contractStartTime = dateUtil.formatYMD(contractStartTime);
      // res.data.result.contractEndTime = dateUtil.formatYMD(contractEndTime);
      
      that.setData({
        contractObj: res.data.result
      });

      that.setData({
        incDetailCaseList: res.data.result.incDetailCase.split(",")
      });

    }).catch(error => {
      console.log(error);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})