
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
 * @returns {num} 单位分
 * @constructor
 */
function TimeDifference(time1, time2) {
  //判断开始时间是否大于结束日期

  // function CompareDate(d1,d2) {
  //   return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
  // }
  // console.log('CompareDate:')
  // console.log(CompareDate(time1,time2))
  // if (CompareDate(time1,time2)) {
  if (time1 > time2) {
    console.log("开始时间不能大于结束时间！");
    return false
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

/**
 * 判断是否当天记录过，凌晨4点更新状态,isRecord = true时候执行记录更新
 * 用小程序缓存记录
 * @timeName {date} 小程序本地存储的时间格式: wx.setStorageSync('timeName', new Date())
 */

function isRecordedToday(timeName,isRecord) {


  var time1 = wx.getStorageSync(timeName) //上一次记录的时间

  var now = new Date();
  var time0;//凌晨4点
  var time0_2 = showDate(+1);//第二天的凌晨4点
  var time2;//现在的时间
  var time0Str,time0Str_2,time1Str,time2Str
  var diff = wx.getStorageSync(timeName+'Diff');//时间差


  //string 格式时间
  time0Str = dateToString(now).substring(0,10) + ' 04:00:00' //今天4点
  time0Str_2 = time0_2 + ' 04:00:00' //第二天4点
  // time2Str = dateToString(now);  //此刻
  time2Str = '2018-08-07 10:00:00'  //此刻

  console.log("time0Str  ："+time0Str)
  console.log("time0Str_2："+time0Str_2)
  console.log("time2Str  ："+time2Str)

  var t0 =   TimeDifference(time0Str, time2Str) || -1;//当前时间和4点的时间差
  var t0_2 = TimeDifference(time0Str, time0Str_2);//当前时间和第二天4点的时间差
  var t1 = TimeDifference(time0Str_2, time0Str_2);//上一次记录时间和第二天4点的时间差

  console.log("diff:"+diff+"  t0:"+t0+"   t0_2:"+t0_2)

  if(t0 >= 0){
    diff = t0 //4点-24点
  }else if(t0 < 0){
    diff = t0_2 //0点-4点
  }

  if ( time1 ==''){
    console.log('【-->】' + timeName +"首次进入")
    if(isRecord){
      wx.setStorageSync(timeName+'Diff', diff)
    }
    return true
  }else{

    time1Str = dateToString(time1);
    var t2 = TimeDifference(time1Str, time2Str);//当前时间和上一次记录的时间差
    // var t1 = TimeDifference(time1Str, time0Str_2);//上一次记录时间和第二天4点的时间差
    console.log("t2:"+t2)
    if( t2 > diff ){
      console.log('【-->】' + timeName +"允许记录   大于时间差")
      if(isRecord){
        wx.setStorageSync(timeName+'Diff', diff)
      }
      return true
    }else{
      console.log('【-->】' + timeName+"不允许记录 小于时间差")
      return false
    }
  }



}

/**
 * 获取今天、昨天、昨天日期， 获取明天：showDate(+1)
 * @param n{number}
 * @returns {string} 格式2018-12-12
 */
function showDate(n) {
  var uom = new Date(new Date()-0+n*86400000);
  var month =uom.getMonth()+1
  var date =uom.getDate()

  if(month<10){
    month = '0'+ month
  }

  if(date<10){
    date = '0'+date
  }

  uom = uom.getFullYear() + "-" + month + "-" + date;
  return uom;
}

Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

/**
 * 比较2个时间点大小 timeStr1 > timeStr2 为true
 * @param timeStr1 {string} “yyyy-MM-dd hh:mm:ss”
 * @param timeStr2 {string} “yyyy-MM-dd hh:mm:ss”
 * @returns {boolean}
 */
function timeCompare(timeStr1,timeStr2) {
  if(typeof(timeStr1) != 'string' || typeof(timeStr2) != 'string'){
    console.log("时间格式不正确")
  }
  var timestamp1 = Date.parse(new Date(timeStr1));
  var timestamp2 = Date.parse(new Date(timeStr2));

  if(timestamp1 > timestamp2){
    return true
  }else{
    return false
  }
}

/**
 * 生成随机id
 * @param randomLength 长度
 * @returns {string}
 * @constructor
 */
function generateId(randomLength){
  return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArr (arr,value){
  for(var i = 0; i < arr.length; i++){
    if(value === arr[i]){
      return true;
    }
  }
  return false;
}


/**
 * 砰的一声响音频
 */
function sound(){
  console.log("执行 sound（）")
  const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.autoplay = true
  innerAudioContext.src = '/image/wav7.mp3'
  innerAudioContext.volume = 0.8
  innerAudioContext.onPlay(() => {
  })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}

module.exports.dateToString = dateToString;
module.exports.TimeDifference = TimeDifference;
module.exports.isRecordedToday = isRecordedToday;
module.exports.showDate = showDate;
module.exports.timeCompare = timeCompare;
module.exports.generateId = generateId;
module.exports.isInArr = isInArr;
module.exports.sound = sound;
