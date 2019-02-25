<script>
const colorList = [
  '#F9F900',
  '#6FB7B7',
]
//https://github.com/269941633/vue.js2.X-elementUI  demo
//https://blog.csdn.net/yanby921005/article/details/80532984全景变量，函数
const colorListLength = 20
const playerPageTop = 700
const playerLeftSpacing = 70
const httpRequestUrl = 'http://localhost:8090/club'
//const httpRequestUrl = 'https://www.xiaomidou.club/club'
const currentPlayerType = sessionStorage.getItem("playerType")
const currentPlayerIsJoin = sessionStorage.getItem("isJoin")
function getRandColor() {
  var tem = Math.round(Math.random() * colorListLength)
  return colorList[tem]
}


//时间比较（yyyy-MM-dd）
function compareDate(startDate, endDate) {
  var arrStart = startDate.split("-");
  var startTime = new Date(arrStart[0], arrStart[1], arrStart[2]);
  var startTimes = startTime.getTime();
  var arrEnd = endDate.split("-");
  var endTime = new Date(arrEnd[0], arrEnd[1], arrEnd[2]);
  var endTimes = endTime.getTime();
  if (endTimes < startTimes) {
    return false;
  }
  return true;
}
//时间比较（yyyy-MM-dd HH:mm:ss）
function compareTime(startTime, endTime) {
  var startTimes = startTime.substring(0, 10).split('-');
  var endTimes = endTime.substring(0, 10).split('-');
  startTime = startTimes[1] + '-' + startTimes[2] + '-' + startTimes[0] + ' ' + startTime.substring(10, 19);
  endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
  var thisResult = (Date.parse(endTime) - Date.parse(startTime)) / 3600 / 1000;
  if (thisResult < 0) {
    return true;
  } else {
    return false;
  }
}

function GMTToStr_YMD(time) {
  let date = new Date(time)
  let Str = date.getFullYear() + "-" +
    (date.getMonth() + 1) + "-" +
    date.getDate()
  return Str
}
function GMTToStr_YMDHMS(time) {
  let date = new Date(time)
  let Str = date.getFullYear() + "-" +
    (date.getMonth() + 1) + "-" +
    date.getDate() + " " +
    date.getHours() + ":" +
    date.getMinutes() + ":" +
    date.getSeconds()
  return Str
}

function StrToGMT(time) {
  let GMT = new Date(time)
  return GMT
}

export default {
  colorList,
  colorListLength,
  getRandColor,
  httpRequestUrl,
  playerPageTop,
  playerLeftSpacing,
  compareTime,
  compareDate,
  GMTToStr_YMD,
  GMTToStr_YMDHMS,
  StrToGMT,
  currentPlayerType,
  currentPlayerIsJoin
}
</script>
