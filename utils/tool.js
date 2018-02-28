
/**
 * 把时间转为字符串格式
 * @param now
 * @returns {string}
 */
function dateToString(now) {
  var year = now.getFullYear();
  var month = (now.getMonth() + 1).toString();
  var day = (now.getDate()).toString();
  var hour = (now.getHours()).toString();
  var minute = (now.getMinutes()).toString();
  var second = (now.getSeconds()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (second.length == 1) {
    second = "0" + second;
  }
  var dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  return dateTime;
}


/**
 * 判断两个时间相差的分钟数,输入时间字符串 “yyyy-MM-dd hh:mm:ss”
 * @param time1 {string}
 * @param time2 {string}
 * @returns {boolean}
 * @constructor
 */
function TimeDifference(time1, time2) {
  //判断开始时间是否大于结束日期
  if (time1 > time2) {
    // console.log("开始时间不能大于结束时间！");
    return false;
  }

  //截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
  var begin1 = time1.substr(0, 10).split("-");
  var end1 = time2.substr(0, 10).split("-");

  //将拆分的数组重新组合，并实例成化新的日期对象
  var date1 = new Date(begin1[1] + -+begin1[2] + -+begin1[0]);
  var date2 = new Date(end1[1] + -+end1[2] + -+end1[0]);

  //得到两个日期之间的差值m，以分钟为单位
  //Math.abs(date2-date1)//计算出以毫秒为单位的差值
  //Math.abs(date2-date1)/1000//得到以秒为单位的差值
  //Math.abs(date2-date1)/1000/60//得到以分钟为单位的差值
  var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);

  //小时数和分钟数相加得到总的分钟数
  //time1.substr(11,2)截取字符串得到时间的小时数
  //parseInt(time1.substr(11,2))*60把小时数转化成为分钟
  var min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2));
  var min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2));

  //两个分钟数相减得到时间部分的差值，以分钟为单位
  var n = min2 - min1;

  //将日期和时间两个部分计算出来的差值相加，即得到两个时间相减后的分钟数
  var minutes = m + n;
  // document.writeln(minutes);
  return minutes
}

module.exports.dateToString = dateToString;
module.exports.TimeDifference = TimeDifference;