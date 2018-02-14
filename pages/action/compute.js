/**
 * 计算记过算法
 */

module.exports.start = start;
var data ={
  rest:[
      "闭上眼睛一分钟，深呼吸几次。",
      "找一个舒服的姿势，放松10分钟，闭上眼睛，全身放松，建议设定闹钟。",
      "需要到沙发凳子或床上睡觉25分钟，睡不着也没关系，重要的是躺下闭上眼睛不做任何事。",
      "如有条件，请躺下睡觉1至1.5小时；如果没有，请找一个舒服的姿势闭上眼睛不张开，深呼吸一次默念一次“放松”，25分钟。",
      "躺下休息！当下优先只有一件事，尽快恢复到正常可以工作的状态。",
  ],
  sports:[
      "如果坐着，站起来走几步，伸伸懒腰，稍微活动四肢，看看远处风景；如果站着，坐下休息一分钟",
      "站起来走几步，做几个拉伸运动，扭动头和腰，体转，弯腰，下蹲站起等等之类，做3分钟。如果在家，做几个简单的家务，如扫地，整理，擦桌子之类，10分钟内能完成的家务。",
      "去跑步、打球等等，出一点汗强度的健身锻炼运动。",
  ],
  work:[
      "把这件事分为三部分，第一部分占工作量的10%，第二部分占30%，第三部分60%，先去完成第一部分。",
      "如果到时做不到，就把做这件事相关的物品资料等等，整理一下，准备好。 ",
      "现在的你一定能克服任何困难！"
  ],
  eat:[
      "如果现在是午/晚用餐时间，先用餐；如果不是，先吃一点零食。"
  ]
}


/**
 * 开始计算结果
 * @param val 中状态打分值
 * @param recordList 记录列表数据
 */
function start(val,recordList) {
  console.log("开始计算")
  console.log(recordList)
  var t;
  var n_delay,n_rest,n_sports,n_work,n_amu,n_eat;
  var delayItem={} //选定拖延的事项
  var delay_num =0 //延拖实现的个数，只能一个
  var strWork;
  var workEnd =''//延迟项执行文案判断后

  var actionItem ={
    amu:[],//需要行动的娱乐项
    eat:[],//吃东西
  }

  var result =[
    [],//第一步结果
    [],//第二步结果
    [],//第三步结果
  ]


  if (val && val!=''){
    t = parseInt(val)
  }else {
    console.log("总状态获取不到")
    return false
  }

  //获取分数值
  if(!recordList || recordList.length<=0){
    console.log("记录获取不到")
    return false
  }else{
    recordList.forEach(function (item, index) {

      //延迟项
      if(item.isDelay ==true){
        delayItem =item;
        n_delay= item.value

        delay_num++

        if(item.frequency == '单次任务'){
          strWork ='开始'+ delayItem.txt +'。'+data.work[0]
        }else{
          strWork ='这时的你可以开始'+ delayItem.txt +'了。'
        }
      }

      //娱乐
      if(item.itemTitle== '娱乐' && item.value >0){
        actionItem.amu.push(item)
      }

      //吃东西
      if(item.itemTitle== '吃东西' && item.value >7){
        actionItem.eat.push(item)
      }

      //判断任务是不是每天


    })
    if(delay_num>1){
      console.log("延迟项最多一个")
      return false
    }else if(delay_num == 0){
      console.log("获取不到延迟项")
      return false
    }
  }

  console.log("actionItem:")
  console.log(actionItem)

  //判断吃东西
  if(actionItem.eat.length >0){
    result[0].push(data.eat[0])
  }

  //主要判断逻辑
  if(t==1 || t==2){
    result[0].push(data.rest[4])
    return result
  }else if(t==9 || t==10){
    result[0].push(strWork + data.work[2])
    return result
  }else if(t==3 || t==4){

    //【3分和4分情况】
    if(actionItem.amu.length>0){
      //娱乐高分
      var amuItem =actionItem.amu[0];
      actionItem.amu.forEach(function (item, index) {
        if(item.value>amuItem.value){
          amuItem = item
        }
      })
      if(amuItem.value>6){
        if(n_delay>8){
          result[0].push(data.rest[4])
          result[1].push(data.sports[0])
          result[2].push(strWork)
        }else if (n_delay<8){
          var str = amuItem.txt +"半小时~1小时。"
          result[0].push(str)
          result[1].push(data.rest[2])
          result[2].push(strWork)
          result[2].push(data.work[1])
        }
      }else{
        if(n_delay>7){
          result[0].push(data.rest[4])
          result[1].push(data.sports[1])
          result[2].push(strWork)
        }else if (n_delay<7){
          result[0].push(data.rest[4])
          result[1].push(data.rest[2])
          result[2].push(strWork)
          result[2].push(data.work[1])
        }
      }
    }
    return result
  }else if(t==5 || t==6){

    //【5分和6分情况】
    if(actionItem.amu.length>0){
      //娱乐高分
      var amuItem =actionItem.amu[0];
      actionItem.amu.forEach(function (item, index) {
        if(item.value>amuItem.value){
          amuItem = item
        }
      })
      if(amuItem.value>5){
        if(n_delay>7){
          result[0].push(data.rest[0])
          result[1].push(data.sports[0])
          result[2].push(strWork)
        }else if (n_delay<7){
          result[0].push(data.rest[1])
          result[1].push(data.sports[1])
          result[2].push(strWork)
          result[2].push(data.work[1])
        }
      }else{
        if(n_delay>6){
          result[0].push(data.rest[0])
          result[1].push(data.sports[0])
          result[2].push(strWork)
        }else if (n_delay<6){
          result[0].push(data.rest[1])
          result[1].push(data.sports[1])
          result[2].push(strWork)
          result[2].push(data.work[1])
        }
      }
    }
    return result
  }else if(t==7 || t==8){

    //【7分和8分情况】
    if(n_delay>6){
      result[0].push(data.rest[0])
      result[1].push(strWork)
    }else{
      result[0].push(data.sports[1])
      result[1].push(strWork)
    }
    return result
  }

}

