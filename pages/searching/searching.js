// pages/searching/searching.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: 3000,
    duration: 1000,
    carouselList: [{
      url: '/assets/images/carousel_1.jpg'
      },
      {
        url: '/assets/images/carousel_2.jpg'
      }, {
        url: '/assets/images/carousel_3.jpg'
      }
    ],
    middleList: [{
      url: '/assets/images/middle_1.jpg'
    },
    {
      url: '/assets/images/middle_2.jpg'
    },
      {
        url: '/assets/images/middle_3.png'
      },
      {
        url: '/assets/images/middle_4.png'
      }
    ],
    belowList: [{
      url: '/assets/images/below_3.jpg'
    },
    {
      url: '/assets/images/below_2.jpg'
    }, {
      url: '/assets/images/below_1.jpg'
    }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
})