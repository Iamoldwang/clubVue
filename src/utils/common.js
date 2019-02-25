
import commonApi from '../axios/axios'


// 类似金钱,首位不为0,最多2位小数
export function recordLogs(content,type,visit) {

  let params = {
    content: content,
    type: type,
    visit: visit
  }

  commonApi.post('/tableLog/insert', params, response => {

  });
}

export function getCurrentFormatDate(format){
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (day >= 1 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 1 && hour <= 9) {
    hour = "0" + hour;
  }
  if (min >= 1 && min <= 9) {
    min = "0" + min;
  }
  if (sec >= 1 && sec <= 9) {
    sec = "0" + sec;
  }
  var currentdate = '';
  if(format == 'yyyy'){
    currentdate = year;
  }else if(format == 'yyyy-MM-dd'){
    currentdate = year + "-" + month + "-" + day
  }else if(format == 'yyyy-MM-dd HH:mm:ss'){
    currentdate = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  }else if(format == 'yyyyMMddHHmmss'){
    currentdate = year + "" + month + "" + day + "" + hour + "" + min + "" + sec;
  }
  return currentdate;
}

export default {
  recordLogs,
  getCurrentFormatDate
}
