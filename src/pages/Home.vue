<template>
<section class="mainContant">
  <el-scrollbar style="height:100%">
    <el-row>
      <el-col :span="12" class="colSty1" :style="{'width':colWidth}">
        <el-row class="rowTitle">
          <el-tag type="success" class="leftTitle"><i class="fa fa-user"></i> 个人信息</el-tag>
        </el-row>
        <el-row>
          <img :src="url_prefix + playerHead" class="headImage" />
        </el-row>
        <el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="success">球员外号</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{nickname}}</span></el-col>
            <el-col :span="5">
              <el-tag type="success">比赛场次</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{totalMatchCount}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="success">注册时间</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{registerDate}}</span></el-col>
            <el-col :span="5">
              <el-tag type="success">参赛场次</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{joinMatchCount}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="success">球员国籍</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{nationality}}</span></el-col>
            <el-col :span="5">
              <el-tag type="danger">迟到次数</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan-error">{{lateTimes}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="success">球员类型</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{playerTypeName}}</span></el-col>
            <el-col :span="5">
              <el-tag type="danger">缺勤次数</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan-error">{{noJoinMatchCount}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="success">习惯用脚</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{habitFoot}}</span></el-col>
            <el-col :span="5">
              <el-tag type="danger">早退次数</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan-error">{{zaoTuiMatchCount}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="success">球员住址</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{playerAddress}}</span></el-col>
            <el-col :span="5">
              <el-tag type="danger">空降次数</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan-error">{{kongJiangMatchCount}}</span></el-col>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="12" class="colSty" :style="{'width':colWidth}">
        <el-row class="rowTitle">
          <el-tag type="warning" class="leftTitle"><i class="fa fa-users"></i> 球队信息</el-tag>
          <span class="grid-content-notice"><i class="fa fa-bullhorn"></i>球队公告</span>
        </el-row>
        <el-row>
          <img :src="url_prefix + teamHead" class="headImage" />
        </el-row>
        <el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="warning">球队名称</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{teamName}}</span></el-col>
            <el-col :span="5">
              <el-tag type="warning">创建日期</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{establishDate}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="warning">创始人员</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{establishUserName}}</span></el-col>
            <el-col :span="5">
              <el-tag type="warning">所在地区</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{placeName}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="warning">球队口号</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{teamSlogan}}</span></el-col>
            <el-col :span="5">
              <el-tag type="warning">球队余额</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{teamBalance}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="warning">球队人数</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{playersCount}}</span></el-col>
            <el-col :span="5">
              <el-tag type="warning">球队领队</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{teamCoach}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="warning">第一队长</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{firstCaptain}}</span></el-col>
            <el-col :span="5">
              <el-tag type="warning">第二队长</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{secondCaptain}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="warning">第三队长</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{thirdCaptain}}</span></el-col>
            <el-col :span="5">
              <el-tag type="warning">平均体重</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{avgWeight}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-tag type="warning">平均年龄</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{avgAge}}</span></el-col>
            <el-col :span="5">
              <el-tag type="warning">平均身高</el-tag>
            </el-col>
            <el-col :span="7"><span class="contentSpan">{{avgHeight}}</span></el-col>
          </el-row>

        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="colSty2" :style="{'width':colWidth}">
        <el-row class="rowTitle">
          <el-tag type="info" class="leftTitle"><i class="fa fa-futbol-o"></i> 最近比赛</el-tag>
          <span v-if="matchStatus == 1" class="grid-content-notice-signing"><i class="fa fa-user-plus"></i> 报名中</span>
          <span v-else-if="matchStatus == 2" class="grid-content-notice-signend"><i class="fa fa-user-times"></i> 报名结束</span>
          <span v-else-if="matchStatus == 3" class="grid-content-notice-playing"><i class="fa fa-futbol-o"></i> 比赛中</span>
          <span v-else class="grid-content-notice-playend"><i class="fa fa-check-circle"></i> 已结束</span>
        </el-row>
        <!-- 报名中 -->
        <el-row v-if="matchStatus == 1">
          <el-row class="rowSty">
            <el-col :span="24" class="colSpanSty-left" style="padding-right: 20px;">
              <div class="grid-content-sign"><i class="el-icon-warning"></i>本次比赛报名截止时间{{signEndTime}}，还剩{{leftHours}}  {{timeUnit}}，已有{{signCount}}人报名</div>
            </el-col>
          </el-row>

          <el-row class="rowSty">
            <el-col :span="6" class="colSpanSty-left">
              <div class="grid-content-sign">比赛时间</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content-sign">{{matchDate}}</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content-sign">创建人员</div>
            </el-col>
            <el-col :span="6" class="colSpanSty-right">
              <div class="grid-content-sign">{{buildPlayerName}}</div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="12">
              <el-button type="primary" icon="el-icon-date" @click="showSignPlayers">查看报名</el-button>
            </el-col>
            <el-col :span="12">
              <el-button v-if="currentPlayerIsSign == 0" type="primary" icon="el-icon-circle-plus-outline" @click="signMatch(1)">我要报名</el-button>
              <el-button v-else type="danger" icon="el-icon-error" @click="signMatch(0)">取消报名</el-button>
            </el-col>
          </el-row>
        </el-row>
        <!-- 已结束 -->
        <el-row v-else-if="matchStatus == 4">
          <el-row class="rowSty">
            <el-col :span="6" class="colSpanSty-left">
              <div class="grid-content">比赛时间</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">{{matchDate}}</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">创建人员</div>
            </el-col>
            <el-col :span="6" class="colSpanSty-right">
              <div class="grid-content">{{buildPlayerName}}</div>
            </el-col>
          </el-row>
          <el-row class="rowSty">
            <el-col :span="6" class="colSpanSty-left">
              <div class="grid-content">场地费用</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">{{fieldCost}}</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">比赛水费</div>
            </el-col>
            <el-col :span="6" class="colSpanSty-right">
              <div class="grid-content">{{waterCost}}</div>
            </el-col>
          </el-row>
          <el-row class="rowSty">
            <el-col :span="6" class="colSpanSty-left">
              <div class="grid-content">分组人员</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">{{groupPlayerName}}</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">分组方式</div>
            </el-col>
            <el-col :span="6" class="colSpanSty-right">
              <div class="grid-content">{{groupMethod}}</div>
            </el-col>
          </el-row>
          <el-row class="rowSty">

            <el-col :span="6" class="colSpanSty-left">
              <div class="grid-content">最终比分</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">{{finalPoint}}</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">报名人数</div>
            </el-col>
            <el-col :span="6" class="colSpanSty-right">
              <div class="grid-content">{{totalSign}}</div>
            </el-col>
          </el-row>
          <el-row class="rowSty">
            <el-col :span="6" class="colSpanSty-left">
              <div class="grid-content">迟到人数</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">{{totalLate}}</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content">罚款金额</div>
            </el-col>
            <el-col :span="6" class="colSpanSty-right">
              <div class="grid-content">{{faKuan}}</div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col>
              <el-button type="primary" icon="el-icon-tickets" @click="showLineUp">查看阵容</el-button>
            </el-col>
          </el-row>
        </el-row>
        <!-- 进行中/报名结束 -->
        <el-row v-else>
          <el-row class="rowSty">
            <el-col :span="6" class="colSpanSty-left">
              <div class="grid-content-signEnd">截止时间</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content-signEnd">{{signEndTime}}</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content-signEnd">报名人数</div>
            </el-col>
            <el-col :span="6" class="colSpanSty-right">
              <div class="grid-content-signEnd">{{signCount}}</div>
            </el-col>
          </el-row>
          <el-row class="rowSty">
            <el-col :span="6" class="colSpanSty-left">
              <div class="grid-content-signEnd">比赛时间</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content-signEnd">{{matchDate}}</div>
            </el-col>
            <el-col :span="6" class="colSpanSty">
              <div class="grid-content-signEnd">创建人员</div>
            </el-col>
            <el-col :span="6" class="colSpanSty-right">
              <div class="grid-content-signEnd">{{buildPlayerName}}</div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-button type="primary" icon="el-icon-date" @click="showSignPlayers">查看报名</el-button>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="12" class="colSty" :style="{'width':colWidth}">
        <el-row class="rowTitle">
          <el-tag class="leftTitle"><i class="fa fa-line-chart"></i> 数据统计</el-tag>
          <el-button-group>
            <el-button type="primary" @click="initAnalysisData(1)">报名</el-button>
            <el-button type="primary" @click="initAnalysisData(2)">参赛</el-button>
            <el-button type="primary" @click="initAnalysisData(3)">迟到</el-button>
            <el-button type="primary" @click="initAnalysisData(4)">罚款</el-button>
            <el-button type="primary" @click="initAnalysisData(5)">进球</el-button>
            <el-button type="primary" @click="initAnalysisData(6)">助攻</el-button>
            <el-button type="primary" @click="initAnalysisData(7)">扑救</el-button>
            <el-button type="primary" @click="initAnalysisData(8)">评分</el-button>
          </el-button-group>
        </el-row>
        <el-row style="padding-left:20px;padding-right:20px;">
          <div id="myChart" style="width:100%;height:300px;"></div>
        </el-row>
      </el-col>
    </el-row>
  </el-scrollbar>

  <!--对话框-->
  <el-dialog title="分组阵容" :visible.sync="formVisible" :close-on-click-modal="false" width="60%">
    <img :src="url_prefix + lineUpImage" style="width: 100%;"/>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="formVisible = false">关闭</el-button>
    </div>

  </el-dialog>

  <!--对话框-->
  <el-dialog title="已报名球员" :visible.sync="signDialog" :close-on-click-modal="false" width="50%" top="10%">
    <el-tag v-for="item in signPlayers" :key="item.name" :playerId="item.id" type="success">
      {{item.name}}
    </el-tag>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="signDialog = false">关闭</el-button>
    </div>

  </el-dialog>

</section>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
let data = () => {
  return {
    formVisible:false,
    collapsed: false,
    systemName: '这是首页',
    userName: 'admin',
    rowHeight: '',
    colWidth: '',
    nickname: '--',
    totalMatchCount: '--',
    registerDate: '--',
    joinMatchCount: '--',
    nationality: '--',
    lateTimes: '--',
    playerTypeName: '--',
    noJoinMatchCount: '--',
    habitFoot: '--',
    zaoTuiMatchCount: '--',
    playerAddress: '--',
    kongJiangMatchCount: '--',
    teamName: '--',
    establishDate: '--',
    establishUserName: '--',
    placeName: '--',
    teamSlogan: '--',
    teamBalance: '--',
    playersCount: '--',
    teamCoach: '--',
    firstCaptain: '--',
    secondCaptain: '--',
    thirdCaptain: '--',
    avgWeight: '--',
    avgAge: '--',
    avgHeight: '--',
    matchStatus: '',
    playerHead: '',
    teamHead: '',
    url_prefix: '',

    matchDate:'',
    fieldCost:'',
    waterCost:'',
    buildPlayerName:'',
    groupMethod:'',
    groupPlayerName:'',
    finalPoint:'',
    totalSign:'',
    totalLate:'',
    faKuan:'',
    lineUpImage:'',
    signEndTime:'',
    leftHours:'0',
    signCount:'0',
    recentlyMatchId:'',
    signPlayers:[],
    signDialog:false,
    currentPlayerIsSign:'',
    timeUnit:'',
    matchDataLists:'',
    technicalStatisticsLists:''
  }
}

let initCurrentPlayerInfo = function() {
  this.$api.post('/tablePlayer/getPlayerInfo', null, res => {
    if (res.data.code == 0) {
      let vo = res.data.content
      this.nickname = vo.nickname
      this.totalMatchCount = vo.matchTotal
      this.registerDate = vo.registerDate
      this.joinMatchCount = vo.joinMatchTotal
      this.nationality = vo.nationality
      this.lateTimes = vo.lateMatchTotal
      this.playerTypeName = vo.playerTypeName
      this.noJoinMatchCount = vo.absenceMatchTotal
      this.habitFoot = vo.habitFoot == 1 ? '左脚' : '右脚'
      this.zaoTuiMatchCount = vo.zaoTuiMatchTotal
      this.playerAddress = vo.address
      this.kongJiangMatchCount = vo.kongJiangMatchTotal
      this.playerHead = vo.headImage
    }
  })
}

let initCurrentTeamInfo = function() {
  this.$api.post('/tableTeam/getTeamInfo', null, res => {
    let vo = res.data.content
    this.teamName = vo.name
    this.establishDate = vo.establishDate
    this.establishUserName = vo.establishUserName
    this.placeName = vo.placeName
    this.teamSlogan = vo.teamSlogan
    this.teamBalance = vo.teamBalance
    this.playersCount = vo.playersCount
    this.teamCoach = vo.teamCoach
    this.firstCaptain = vo.firstCaptain
    this.secondCaptain = vo.secondCaptain
    this.thirdCaptain = vo.thirdCaptain
    this.avgWeight = vo.avgWeight + 'kg'
    this.avgAge = vo.avgAge
    this.avgHeight = vo.avgHeight + 'cm'
    this.teamHead = vo.teamImage
  })
}

let initRecentlyMatchData = function() {
  this.$api.post('/tableMatch/getRecentlyMatchData', null, res => {
    let vo = res.data.content
    this.matchStatus = vo.matchStatus
    this.recentlyMatchId = vo.id
    this.currentPlayerIsSign = vo.isSignOfRecentlyMatch
    if(vo.matchStatus == '4'){
      this.fieldCost = vo.fieldCost + '元'
      this.waterCost = vo.waterCost + '元'

      this.groupMethod = vo.groupMethod == '1' ? '自选分组' : '随机分组'
      this.groupPlayerName = vo.groupPlayerName
      this.finalPoint = '(主)' + vo.homeGoal + ' : (客)' + vo.awayGoal
      this.totalSign = vo.signTotal + '人'
      this.totalLate = vo.chiDaoZaoTuiTotal + '人'
      this.faKuan = vo.totalFaKuan + '元'
      this.lineUpImage = vo.lineUpImage
    }else if(vo.matchStatus == '1'){
      this.signEndTime = vo.signEndTimeDate + '(' + vo.signEndTimeHour + ')'
      this.leftHours = vo.leftHours
      this.signCount = vo.signTotal
      this.timeUnit = vo.timeUnit
    }
    this.signCount = vo.signTotal
    this.signEndTime = vo.signEndTimeDate + '(' + vo.signEndTimeHour + ')'
    this.matchDate = vo.matchDate + '(' + vo.matchTime + '-' + (vo.matchTime - 0 + 2) + ')'
    this.buildPlayerName = vo.buildPlayerName

  })
}

let initLineOption = function(xData,yData,title,seriesName) {
  var option = {
    color: ['#8a8a8a'],
    title: {
      text: title,
      left: 'center'
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '1%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis: {
      type: 'category',
      axisLabel: {
         interval:0
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8a8a8a'
        }
      },
      axisTick: {
        show: false
      },
      data: xData
    },
    yAxis: {
      type: 'value',

      axisLine: {
        show: true,
        lineStyle: {
          color: '#8a8a8a'
        }
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [{
      name: seriesName,
      data: yData,
      type: 'line',
      smooth: true
    }]
  }
  return option
}

let initBarOption = function(xData,yData,title,seriesName) {
  var option = {
    color: ['#8a8a8a'],
    title: {
      text: title,
      left: 'center'
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '1%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },

    xAxis: [{
      type: 'category',
      axisLabel: {
         interval:0
      },
      axisTick: {
        show: false

      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8a8a8a'
        }
      },
      boundaryGap: [0, 0.01],
      data: xData,
      axisPointer: {
        type: 'shadow'
      }
    }],
    yAxis: [{
      type: 'value',
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8a8a8a'
        }
      },
      name: '个'
    }],
    series: [{
      name: seriesName,
      type: 'bar',
      barCategoryGap: '80%',
      data: yData
    }]
  }
  return option
}

let initAnalysisData = function(index){

  if(index == 1){
    this.$api.post('/tableMatchDetails/analysisMatchSignData', null, response => {

      var vo = response.data.content
      this.matchDataLists = vo.matchDataLists
    });
  }else if(index == 4){

  }else{
    let param = {}
    if(index == 2){
      param.orderByField = 'totalPlay'
      param.limit = 10
    }else if(index == 3){
      param.orderByField = 'totalLate'
      param.limit = 10
    }else if(index == 5){
      param.orderByField = 'totalGoal'
      param.limit = 10
    }else if(index == 6){
      param.orderByField = 'totalAssist'
      param.limit = 10
    }else if(index == 7){
      param.orderByField = 'totalSave'
      param.limit = 10
    }else if(index == 8){
      param.orderByField = 'avgPoint'
      param.limit = 10
    }
    this.$api.post('/tableMatchDetails/matchTechnicalData', param, response => {

      var vo = response.data.content
      this.technicalStatisticsLists = vo.matchDataLists
    });

  }

  //setTimeout(this.initEchart(1),3000)
  setTimeout(() => {
    this.initEchart(index)
  }, 500)
}

let initEchart = function(index) {
  var loadingData;
  // 基于准备好的dom，初始化echarts实例
  var chart = echarts.init(document.getElementById('myChart'));
  chart.showLoading({
    text: 'loading',
    color: '#8a8a8a', //圆圈颜色
    textColor: 'white', //字体颜色
    maskColor: 'rgba(225,217,46, 0.6)', //背景颜色
    zlevel: 0
  });
  var option = {}
  var title = ''
  var xData = []
  var yData = []
  var seriesName = ''

  // 绘制图表
  switch (index) {
    case 1:
      xData = []
      yData = []
      for(var i = 0; i < this.matchDataLists.length; i ++){
        xData[i] = this.matchDataLists[i].matchDate
        yData[i] = this.matchDataLists[i].totalSign
      }
      title = '报名趋势图LAST10'
      seriesName = '报名人数'
      option = initLineOption(xData,yData,title,seriesName)
      break;
    case 2:
      xData = []
      yData = []
      for(var i = 0; i < this.matchDataLists.length; i ++){
        xData[i] = this.technicalStatisticsLists[i].playerName
        yData[i] = this.technicalStatisticsLists[i].totalPlay
      }
      title = '2018赛季球员参赛榜TOP10'
      seriesName = '参赛次数'
      option = initBarOption(xData,yData,title,seriesName)
      break;
    case 3:
      xData = []
      yData = []
      for(var i = 0; i < this.matchDataLists.length; i ++){
        xData[i] = this.technicalStatisticsLists[i].playerName
        yData[i] = this.technicalStatisticsLists[i].totalLate
      }
      title = '2018赛季球员迟到榜TOP10'
      seriesName = '迟到次数'
      option = initLineOption(xData,yData,title,seriesName)
      break;
    case 4:
      xData = ['许为民','王攀','张小强','李金柱','谢然','许树刚','王飞','黄海','彭晓辉','黄峰']
      yData = [15,15,14,13,12,11,11,10,9,8]
      title = '2018赛季球员罚款榜TOP10'
      seriesName = '罚款金额'
      option = initBarOption(xData,yData,title,seriesName)
      break;
    case 5:
      xData = []
      yData = []
      for(var i = 0; i < this.matchDataLists.length; i ++){
        xData[i] = this.technicalStatisticsLists[i].playerName
        yData[i] = this.technicalStatisticsLists[i].totalGoal
      }
      title = '2018赛季球员进球榜TOP10'
      seriesName = '进球个数'
      option = initLineOption(xData,yData,title,seriesName)
      break;
    case 6:
      xData = []
      yData = []
      for(var i = 0; i < this.matchDataLists.length; i ++){
        xData[i] = this.technicalStatisticsLists[i].playerName
        yData[i] = this.technicalStatisticsLists[i].totalAssist
      }
      title = '2018赛季球员助攻榜TOP10'
      seriesName = '助攻个数'
      option = initBarOption(xData,yData,title,seriesName)
      break;
    case 7:
      xData = []
      yData = []
      for(var i = 0; i < this.matchDataLists.length; i ++){
        xData[i] = this.technicalStatisticsLists[i].playerName
        yData[i] = this.technicalStatisticsLists[i].totalSave
      }
      title = '2018赛季球员扑救榜TOP10'
      seriesName = '扑救个数'
      option = initBarOption(xData,yData,title,seriesName)
      break;
    case 8:
      xData = []
      yData = []
      for(var i = 0; i < this.matchDataLists.length; i ++){
        xData[i] = this.technicalStatisticsLists[i].playerName
        yData[i] = this.technicalStatisticsLists[i].avgPoint
      }
      title = '2018赛季球员评分榜TOP10'
      seriesName = '分数'
      option = initBarOption(xData,yData,title,seriesName)
      break;
    default:

  }
  clearTimeout(loadingData);
  loadingData = setTimeout(function() {
    chart.hideLoading();
    chart.setOption(option);
  }, 1000);
}

let showLineUp = function (){
  this.formVisible = true
}

let showSignPlayers = function(){
  this.signDialog = true
  this.signPlayers = []
  let params = {
    matchId: this.recentlyMatchId
  }
  this.$api.post('/tableMatchDetails/getAllPlayersByMatchId', params, res => {

    if (res.status == 200) {
      let list = res.data.content
      for (let i = 0; i < list.length; i++) {
        this.signPlayers.push({
          id: list[i].playerId,
          name: list[i].playerName
        })
      }

    }

  })
}

let signMatch = function(signIndex){
  let params = {
    matchId: this.recentlyMatchId,
    sign:signIndex
  }
  this.$api.post('/tableMatchDetails/playerSign', params, res => {

    if (res.data.code == 0) {
      if(signIndex == 1){
        this.$common.recordLogs(encodeURI('报名'),'6','web')
      }else{
        this.$common.recordLogs(encodeURI('取消报名'),'7','web')
      }

      this.$message({
        message: signIndex == 1 ? '报名成功！' : '取消报名成功！',
        type: 'success'
      });
    }else{
      this.$message({
        message: signIndex == 1 ? '报名成功！' : '取消报名成功！',
        type: 'error'
      });
    }
    this.initRecentlyMatchData()
  })
}
export default {
  data: data,
  methods: {
    initCurrentPlayerInfo,
    initCurrentTeamInfo,
    initRecentlyMatchData,
    initEchart,
    showLineUp,
    showSignPlayers,
    signMatch,
    initAnalysisData
  },
  mounted: function() {
    this.url_prefix = this.GLOBAL.httpRequestUrl
    //var heightStyle =this.$refs.pageMain.style.height;
    var clientHeight = document.documentElement.clientHeight
    var clientWidth = document.documentElement.clientWidth
    this.rowHeight = (clientHeight - 120) / 2 + 'px'
    this.colWidth = (clientWidth - 260) / 2 + 'px !important'
    this.initCurrentPlayerInfo()
    this.initCurrentTeamInfo()
    this.initRecentlyMatchData()
    this.initAnalysisData(1)
    //this.initEchart()
    // this.$nextTick(() => {
    //   initEchart(1)
    // })
  }
}
</script>

<style scoped="scoped" lang="scss">
$width: 100%;
$height: 100%;
$header-height: 15%;
$colHeight: 450px;
.colSty {
    border: 1px solid #e4e4e4;
    border-radius: 15px;
    box-shadow: #dadada 10px 5px 30px 0;
    height: $colHeight;
}
.colSty1 {
    border: 1px solid #e4e4e4;
    border-radius: 15px;
    box-shadow: #dadada 10px 5px 30px 0;
    margin-bottom: 20px;
    margin-right: 20px;
    height: $colHeight;
}
.colSty2 {
    border: 1px solid #e4e4e4;
    border-radius: 15px;
    box-shadow: #dadada 10px 5px 30px 0;
    margin-right: 20px;
    height: $colHeight;
}
.headImage {
    width: 50px;
    border-radius: 15px;
}
.rowTitle {
    text-align: left;
    margin-top: 20px;
    margin-left: 20px;
}
.playerInfoTable {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
}
.playerInfoTable > tbody > tr > td {
    border: 1px solid #8a8a8a;
    padding-top: 5px;
    padding-bottom: 5px;
}
.contentSpan {
    height: 32px;
    line-height: 30px;
    color: #8a8a8a;
}
.contentSpan-error {
    height: 32px;
    line-height: 30px;
    color: #F56C6C;
}
.mainContant {
    height: $height;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
    background: #d3dce6;
    line-height: 36px;
    color: #8a8a8a;
}
.grid-content-sign {
    border-radius: 4px;
    min-height: 36px;
    background: #d3dce6;
    line-height: 36px;
    color: #F56C6C;
}

.grid-content-signEnd {
    border-radius: 4px;
    min-height: 36px;
    background: #d3dce6;
    line-height: 36px;
    color: #E6A23C;
}
.colSpanSty {
    padding-left: 10px;
    padding-right: 10px;
    background-color: #f9fafc;
}
.colSpanSty-left {
    padding-left: 20px;
    padding-right: 10px;
    background-color: #f9fafc;
}
.colSpanSty-right {
    padding-left: 10px;
    padding-right: 20px;
    background-color: #f9fafc;
}
.rowSty {
    margin-top: 20px;
}
.grid-content-notice {
    border-radius: 5px;
    min-height: 36px;
    background: #d3dce6;
    padding: 7px;
    color: #8a8a8a;
}
.leftTitle{
  font-size: 18px;
  font-weight: bold;
}
.grid-content-notice-signing{
  border-radius: 5px;
  min-height: 36px;
  background: #d3dce6;
  padding: 7px;
  color: #F56C6C;
}
.grid-content-notice-signend{
  border-radius: 5px;
  min-height: 36px;
  background: #d3dce6;
  padding: 7px;
  color: #E6A23C;
}
.grid-content-notice-playing{
  border-radius: 5px;
  min-height: 36px;
  background: #d3dce6;
  padding: 7px;
  color: #67C23A;
}
.grid-content-notice-playend{
  border-radius: 5px;
  min-height: 36px;
  background: #d3dce6;
  padding: 7px;
  color: #8a8a8a;
}
</style>
