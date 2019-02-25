<template>
<section class="mainContant">
  <!--工具条-->

  <el-scrollbar style="height:100%">

  <el-row>
    <el-col :span="8" class="topCol">
      <div class="topDiv">
        <el-row>
          比赛名称：{{matchName}}
        </el-row>
        <el-row>
          比赛时间：{{matchDate}}  {{matchTime}}
        </el-row>
        <el-row>
          比赛地址：{{matchAddress}}
        </el-row>
      </div>
    </el-col>
    <el-col :span="8" class="topCol">
      <div class="topDiv">
        <el-row>
          创建比赛：{{buildPlayerName}}
        </el-row>
        <el-row>
          阵容分组：{{groupPlayerName}}
        </el-row>
        <el-row>
          分组方式：{{groupMethodName}}
        </el-row>
      </div>
    </el-col>
    <el-col :span="8" class="topCol">
      <div class="topDiv">
        <el-row>
          最终比分：{{finalScore}}
        </el-row>
        <el-row>
          场地费用：{{fieldCost}}  (元)
        </el-row>
        <el-row>
          场地水费：{{waterCost}}  (元)
        </el-row>
      </div>
    </el-col>
  </el-row>
  <el-row style="margin-top:20px;margin-bottom:20px;margin-left:10px;margin-right:10px;">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <img :src="url_prefix + lineUpImage" style="width: 100%;border-radius: 15px;"/>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="报名日期"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.signTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="球员">
          <template slot-scope="scope">

           <el-tag v-if="scope.row.groupType == 1" type="warning">
             {{scope.row.playerName}}
           </el-tag>

           <el-tag v-else type="success">
             {{scope.row.playerName}}
           </el-tag>
         </template>
        </el-table-column>
        <el-table-column label="上场时间">
          <template slot-scope="scope">
           <span>{{ scope.row.playTimes }}</span>
         </template>
        </el-table-column>
        <el-table-column label="进球(点)/助攻/扑救">
          <template slot-scope="scope">
           <span>{{ scope.row.goalStr }}</span>
         </template>
        </el-table-column>
        <el-table-column label="黄/红牌">
          <template slot-scope="scope">
           <span>{{ scope.row.cardStr }}</span>
         </template>
        </el-table-column>
        <el-table-column label="步数">
          <template slot-scope="scope">
           <span>{{ scope.row.moveSteps }}</span>
         </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
           <span v-if="scope.row.playStatus == 1" style="color:#67C23A;"><i class="el-icon-success"></i>  {{ scope.row.playStatusName }}</span>
           <span v-else-if="scope.row.playStatus == 2" style="color:#F56C6C;"><i class="el-icon-error"></i>  {{ scope.row.playStatusName }}</span>
           <span v-else-if="scope.row.playStatus == 3" style="color:#E6A23C;"><i class="el-icon-time"></i>  {{ scope.row.playStatusName }}</span>
           <span v-else-if="scope.row.playStatus == 4" style="color:#909399;"><i class="el-icon-warning"></i>  {{ scope.row.playStatusName }}</span>
           <span v-else-if="scope.row.playStatus == 5" style="color:#409EFF;"><i class="el-icon-bell"></i>  {{ scope.row.playStatusName }}</span>
           <span v-else-if="scope.row.playStatus == 6" style="color:orange;"><i class="el-icon-warning"></i>  {{ scope.row.playStatusName }}</span>
         </template>
        </el-table-column>
        <el-table-column label="评分">
          <template slot-scope="scope">
           <el-rate
             v-model="scope.row.playerPoint"
             disabled
             show-score
             text-color="#ff9900"
             score-template="{value}">
           </el-rate>
         </template>
        </el-table-column>

        <el-table-column label="操作" v-if="currentPlayerType != 6">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)" type="blue" icon="el-icon-edit-outline">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</el-scrollbar>

<!-- 编辑球员开始 -->
<el-dialog :title="editPlayerName" :visible.sync="dialogShowPlayer" width="40%" :close-on-click-modal="false">
  <el-form :model="playerEditForm" label-width="100px" ref="playerEditForm">
    <el-row>
      <el-col :span="12">
        <el-form-item label="比赛状态" prop="playStatus">
          <el-select v-model="playerEditForm.playStatus" placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in playerStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="上场时间" prop="playTimes">
          <el-input-number v-model="playerEditForm.playTimes" :min="0" :max="120"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="进球总数" prop="goalCount">
          <el-input-number v-model="playerEditForm.goalCount" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="点球总数" prop="penaltyCount">
          <el-input-number v-model="playerEditForm.penaltyCount" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="助攻总数" prop="assistCount">
          <el-input-number v-model="playerEditForm.assistCount" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="扑救总数" prop="saveGoalCount">
          <el-input-number v-model="playerEditForm.saveGoalCount" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="黄牌总数" prop="yellowCard">
          <el-input-number v-model="playerEditForm.yellowCard" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="红牌总数" prop="redCard">
          <el-input-number v-model="playerEditForm.redCard" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="球员评分" prop="playerPoint">
          <el-input-number v-model="playerEditForm.playerPoint" :precision="1" :step="0.5" :min="0" :max="5"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="迟到时长" prop="lateTime">
          <el-input-number v-model="playerEditForm.lateTime" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="playerEditForm.playStatus == 2 || playerEditForm.playStatus == 3 || playerEditForm.playStatus == 5">
      <el-col :span="12">
        <el-form-item label="比赛罚款" prop="rewardAndPunishmentPoint">
          <el-input-number v-model="playerEditForm.rewardAndPunishmentPoint" :min="0" :max="100"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="罚款说明" prop="rewardAndPunishmentDesc">
          <el-input v-model="playerEditForm.rewardAndPunishmentDesc" placeholder="请输入罚款说明" style="width:180px;"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogShowPlayer = false" icon="el-icon-error">关闭</el-button>
    <el-button type="success" @click.native="handleSubmitEdit" :loading="saveFormLoading" icon="el-icon-success">保存</el-button>
  </span>
</el-dialog>
<!-- 编辑球员结束 -->
</section>
</template>

<script>
import global from '../components/Global'
//初始化数据
let data = () => {
  return {
    //url前缀
    url_prefix: global.httpRequestUrl,
    lineUpImage:'',
    tableData:[],
    dialogShowPlayer:false,
    saveFormLoading:false,
    playerEditForm:{
      playStatus:1,
      playTimes:120,
      goalCount:0,
      penaltyCount:0,
      assistCount:0,
      saveGoalCount:0,
      yellowCard:0,
      redCard:0,
      playerPoint:4.5,
      lateTime:0,
      rewardAndPunishmentPoint:0,
      rewardAndPunishmentDesc:null,
      editPlayerName:''
    },
    playerStatus: [{
      value: 1,
      label: '已报名，正常参赛'
    }, {
      value: 2,
      label: '缺勤'
    }, {
      value: 3,
      label: '迟到'
    }, {
      value: 4,
      label: '早退'
    }, {
      value: 5,
      label: '未报名，正常参赛'
    }, {
      value: 6,
      label: '伤退'
    }],
    playerId:'',
    matchName:'',
    matchDate:'',
    matchTime:'',
    matchAddress:'',
    buildPlayerName:'',
    groupPlayerName:'',
    groupMethodName:'',
    finalScore:'',
    fieldCost:'',
    waterCost:'',
    currentPlayerType:''
  }

}

let handleEdit = function(index,row){
  this.playerEditForm = Object.assign({}, row)
  this.dialogShowPlayer = true
  this.playerId = row.playerId
  this.editPlayerName = row.playerName + '技术统计'
}

let initLineUpImage = function(){
  let matchId = this.$route.query.matchId

  let params = {
    id: matchId
  }
  this.$api.post('/tableMatch/getById', params, res => {
    if(res.data.code == 0){
      var vo = res.data.content
      if(vo.lineUpImage == null || vo.lineUpImage == ''){
        this.lineUpImage = '/image/football.jpg'
      }else{
        this.lineUpImage = vo.lineUpImage
      }

      this.matchName = vo.matchName
      this.matchDate = vo.matchDate
      this.matchTime = vo.matchTime
      this.matchAddress = vo.matchAddress
      this.buildPlayerName = vo.buildPlayerName
      if(vo.groupPlayerName != null && vo.groupPlayerName != ''){
        this.groupPlayerName = vo.groupPlayerName
        this.groupMethodName = vo.groupMethodName
      }else{
        this.groupPlayerName = '--'
        this.groupMethodName = '--'
      }

      this.finalScore = '主队' + vo.homeGoal + ' VS 客队' + vo.awayGoal
      this.fieldCost = vo.fieldCost
      this.waterCost = vo.waterCost
    }
  })
}


let initAllPlayers = function(){

  let matchId = this.$route.query.matchId

  let params = {
    matchId: matchId
  }
  this.$api.post('/tableMatchDetails/getAllPlayersByMatchId', params, res => {

    if (res.status == 200) {
      this.tableData = res.data.content
    } else {

    }
  });
}

let handleSubmitEdit = function(){
  this.saveFormLoading = true
  let params = {
    matchId:this.$route.query.matchId,
    playerId: this.playerId,
    playStatus: this.playerEditForm.playStatus,
    playTimes: this.playerEditForm.playTimes,
    goalCount: this.playerEditForm.goalCount,
    penaltyCount: this.playerEditForm.penaltyCount,
    assistCount: this.playerEditForm.assistCount,
    saveGoalCount: this.playerEditForm.saveGoalCount,
    yellowCard: this.playerEditForm.yellowCard,
    redCard: this.playerEditForm.redCard,
    playerPoint: this.playerEditForm.playerPoint
  }
  if(this.playerEditForm.playStatus == 3){

    if(this.playerEditForm.lateTime == 0){
      this.$notify.warning({
          title: '提醒',
          message: '请输入迟到时长！'
        });
      this.saveFormLoading = false
      return
    }
    params.lateTime = this.playerEditForm.lateTime
  }
  if(this.playerEditForm.rewardAndPunishmentPoint != null && this.playerEditForm.rewardAndPunishmentPoint != 0){
    params.rewardAndPunishmentPoint = this.playerEditForm.rewardAndPunishmentPoint
  }
  if(this.playerEditForm.rewardAndPunishmentDesc != null && this.playerEditForm.rewardAndPunishmentDesc != '' && this.playerEditForm.rewardAndPunishmentDesc.length > 0){
    params.rewardAndPunishmentDesc = this.playerEditForm.rewardAndPunishmentDesc
  }

  this.$api.post('/tableMatchDetails/updatePlayerMatchInfo', params, response => {
    if (response.data.code == 0) {
      this.$common.recordLogs(encodeURI('更新球员数据'),'4','web')
      this.$message({
        message: '球员数据编辑成功!',
        type: 'success'
      });
      this.dialogShowPlayer = false
      this.initAllPlayers()
    } else {
      this.$message({
        message: '球员数据编辑失败!',
        type: 'error'
      });
    }
    this.saveFormLoading = false
  });
}
//初始化页面所有数据
export default {

  data: data,
  methods: {
    initLineUpImage,
    initAllPlayers,
    handleEdit,
    handleSubmitEdit
  },
  mounted: function() {
    //this.url_prefix = this.GLOBAL.httpRequestUr

    this.initLineUpImage()
    this.initAllPlayers()
    this.currentPlayerType = this.GLOBAL.currentPlayerType
  }

}
</script>

<style scoped="scoped" lang="scss">
$width: 100%;
$height: 100%;
$header-height: 15%;

.mainContant {
    height: $height;
}
.topCol{
  padding-left: 10px;
  padding-right: 10px;
}
.topDiv{
  background-color: #67C23A;
  border-radius: 5px;
  color: white;
  text-align: left;
  padding-left: 20px;
}
.topDiv .el-row{
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
