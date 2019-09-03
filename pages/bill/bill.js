// pages/bill/bill.js
import request from '../../service/network.js'
import dateUtil from '../../utils/dateUtil.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctCode: '',
    //总支付金额
    needPayTotal: '',
    //选中的订单
    selectedBill: [],
    //全选
    selectAll: false,
    //总金额
    totalPrice: '',
    //总选择条数
    selectCount: '',
    //当前页 账单详细
    billInfoList: [],
    //当前页 未支付 账单的code与price组成的map
    unReceivedMap: {},

    //当前账单的index
    billIndex: '',
    //默认支付状态标签激活下标
    payStatusActive: 0,

    waterUnReceivedList: [],
    waterUnReceivedMap: {},
    waterReceivedList: [],

    rentUnReceivedList: [],
    rentUnReceivedMap: {},
    rentReceivedList: [],

    electricityUnReceivedList: [],
    electricityUnReceivedMap: {},
    electricityReceivedList: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let ctCode = options.ctCode;
    this.setData({
      ctCode: ctCode
    })
    this._initBillInfo(ctCode);  
  },

  //获取账单信息
  /**
   * TODO
   */

  //初始化账单数据
  _initBillInfo(ctCode){
    this.setData({
      billIndex: 0
    })
    this._getUnRecBill(ctCode, 'wxBill/rentBillUnRec')
    
  },

  //获取 未支付 账单
  _getUnRecBill(ctCode, url){
    let params = {
      entity: {
        ctCode: ctCode
      }
    }
    request({
      url: url,
      data: params,
      method: 'POST'
    }).then(res => {
      let billList = res.data.result;
      let billMap = new Map();
      for (var i = 0; i < billList.length; i++) {
        var billCode = billList[i].billCode;
        var receivePrice = (parseFloat(billList[i].totalPrice) - parseFloat(billList[i].paidPrice)).toFixed(2);
        billMap.set(billCode, receivePrice);
      }
      this.setData({
        billInfoList: billList,
        unReceivedMap: billMap,
      })
    })
  },

  //获取 已支付 账单
  _getRecedBiii(ctCode, url){
    let params = {
      entity: {
        ctCode: ctCode
      }
    }
    request({
      url: url,
      data: params,
      method: 'POST'
    }).then(res => {
      let billList = res.data.result;
      this.setData({
        billInfoList: billList
      })
    })
  },

  //返回选中的账单
  selectBack(options) {
    const selectList = options.detail.selectedBill;
    
    if (selectList.length == this.data.billInfoList.length) {
      this.setData({
        selectAll: true
      })
    } else {
      this.setData({
        selectAll: false
      })
    }

    let dataMap = this.data.unReceivedMap;
    this.toSumPrice(selectList, dataMap)   
  },

  //计算总价
  toSumPrice(selectList, dataMap){
    let sumPrice = 0;
    for (let i = 0; i < selectList.length; i++) {
      sumPrice = sumPrice + parseFloat(dataMap.get(selectList[i]));
      sumPrice = parseFloat(sumPrice.toFixed(2));
    }

    this.setData({
      totalPrice: sumPrice,
      selectCount: selectList.length
    })
  },

  //切换tab账单
  changeBill(options) {
    const index = options.detail.index;
    this.clearBill();
    //保存当前账单的index
    this.setData({
      billIndex: index,
      payStatusActive: 0
    })

    let ctCode = this.data.ctCode;

    if (index == 0) {
      this._getUnRecBill(ctCode, 'wxBill/rentBillUnRec')
    } else if (index == 1) {
      this._getUnRecBill(ctCode, 'wxBill/waterBillUnRec')
    } else{
      this._getUnRecBill(ctCode, 'wxBill/eleBillUnRec')
    }

  },
  //支付状tab态切换
  changePayStatus(options) {
    const index = options.detail.index;
    this.clearBill();
    const billIndex = this.data.billIndex;
    let ctCode = this.data.ctCode;

    switch (billIndex) {
      case 0:
        switch (index) {
          case 0:
            this._getUnRecBill(ctCode, 'wxBill/rentBillUnRec')
            break;
          case 1:
            this._getRecedBiii(ctCode, 'wxBill/rentBillReced')
            break;
        }
        break;
      case 1:
        switch (index) {
          case 0:
            this._getUnRecBill(ctCode, 'wxBill/waterBillUnRec')
            break;
          case 1:
            this._getRecedBiii(ctCode, 'wxBill/waterBillReced')
            break;
        }
        break;
      case 2:
        switch (index) {
          case 0:
            this._getUnRecBill(ctCode, 'wxBill/eleBillUnRec')
            break;
          case 1:
            this._getRecedBiii(ctCode, 'wxBill/eleBillReced')
            break;
        }
        break;
    }
  },

  //清空账单选中
  clearBill() {
    this.setData({
      //总支付金额
      needPayTotal: '',
      //选中的订单
      selectedBill: [],
      //全选
      selectAll: false,
      //总金额
      totalPrice: '',
      //总选择条数
      selectCount: '',
      //当前页 账单详细
      billInfoList: [],
      //当前页 未支付 账单的code与price组成的map
      unReceivedMap: {},
      //当前页 已支付 账单
    })
  },

  //全选返回
  selectAllBack(options) {
    //获取bill-info组件的对象
    // const my_check = this.selectComponent('#waterBill');
    // my_check.selectAll(options.detail.checked)
    let codeList = [];
    if (options.detail.checked) {
      codeList = this.data.billInfoList.map(res => { return res.billCode })
      this.setData({
        selectedBill: codeList
      })

    } else{
      this.setData({
        selectedBill: []
      })
    }
    let dataMap = this.data.unReceivedMap;
    this.toSumPrice(codeList, dataMap);
  },

})