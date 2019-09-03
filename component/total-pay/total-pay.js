
import Toast from '../..//miniprogram_npm/vant-weapp/toast/toast';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false
    },
    totalPrice: {
      type: Number,
      value: 0
    },
    selectCount: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectAll(option){
      this.setData({
        checked: option.detail
      })
      this.triggerEvent("selectAllBack", { checked: this.data.checked }, {});
    },

    wxPay(){
      Toast.fail('抱歉,暂未开通支付功能');
    }
  }
})
