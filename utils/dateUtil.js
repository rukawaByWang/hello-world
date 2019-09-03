// 时间戳转换成：yyyy-MM-dd
function formatYMD(val) {  
  var date = new Date(parseInt(val));

  var year = date.getFullYear();
  var month = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);  
  var day = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();

  var theTime = `${year}-${month}-${day}`;

  return theTime;
}

module.exports = {  
  formatYMD: formatYMD
}