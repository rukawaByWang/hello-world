import baseURL from './config.js'

export default function (options) {
  var gn_request_token = wx.getStorageSync('gn_request_token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      method: options.method || 'get',
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        "gn_request_token": gn_request_token
      },
      success: resolve,
      fail: reject
    })
  })
}