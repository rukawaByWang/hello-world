// component/bill-info/bill-info.js
Component({
  properties: {
    billInfoList: {
      type: Array,
      value: []
    },
    selectedBill: Array,
    ifNotPaid: {
      type: Boolean,
      value: true
    }
  },

  data: {
    
  },

  methods: {
    //选择账单
    selectedBill(event) {
      this.setData({
        selectedBill: event.detail
      })
      this.triggerEvent("selectBack", { selectedBill: this.data.selectedBill},{});
    },

    //选择全部 event为true和false
    selectAll(event){
      if (event){
        const codeList = this.data.billInfoList.map(res => {return res.code})
        this.setData({
          selectedBill: codeList
        })
      
      }else{
        this.setData({
          selectedBill: []
        })
      }
      this.triggerEvent("selectBack", { selectedBill: this.data.selectedBill }, {});
    }
  }

})
