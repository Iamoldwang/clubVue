<template>
<section class="mainContant">
  <!--工具条-->
  <el-row>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <div>
        <el-radio v-model="groupMethod" label="1" border @change="changeView">自选分组</el-radio>
        <el-radio v-model="groupMethod" label="2" border @change="changeView">随机分组</el-radio>
      </div>
    </el-col>
  </el-row>
  <el-row v-if="this.groupMethod == '1'">
    <el-col :span="24">
      <template>
        <el-transfer v-model="rightSelect" :data="optionDatas" :titles="['(主队)', '(客队)']" style="margin-top: 30px;margin-bottom: 30px;"></el-transfer>
      </template>
    </el-col>
  </el-row>

  <el-row v-if="this.groupMethod == '2'" style="margin-top:50px;margin-bottom:50px;">
    <el-col :span="10">
      <el-card class="box-card" style="width:80%;float: right;" v-loading="randomLoading" element-loading-text="正在随机分组中..." element-loading-background="rgba(0, 0, 0, 0.8)">
        <div slot="header" class="clearfix">
          <span>(主队)</span>
        </div>
        <el-tag v-for="item in randomLeft" :key="item.name" :playerId="item.id" type="success" ref="leftTag">
          {{item.name}}
        </el-tag>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-alert title="公平起见随机只能使用一次！" type="warning" :closable="false" show-icon center style="width:90%;margin-left:5%;">
      </el-alert>
      <el-button type="primary" v-on:click="handleRandom" icon="el-icon-menu" style="margin-top: 20px;" :disabled="canRandom == true">随机</el-button>
    </el-col>
    <el-col :span="10">
      <el-card class="box-card" style="width:80%;float: left;" v-loading="randomLoading" element-loading-text="正在随机分组中..." element-loading-background="rgba(0, 0, 0, 0.8)">
        <div slot="header" class="clearfix">
          <span>(客队)</span>
        </div>
        <el-tag v-for="item in randomRight" :key="item.name" :playerId="item.id" type="warning" ref="rightTag">
          {{item.name}}
        </el-tag>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-button type="primary" v-on:click="handleSave" icon="el-icon-success">保存</el-button>
      <el-button type="primary" v-on:click="handleReset" icon="el-icon-refresh">重置</el-button>
    </el-col>
  </el-row>
</section>
</template>

<script>
//初始化数据
let data = () => {
  return {
    //url前缀
    url_prefix: '',
    randomLoading: false,
    canRandom: false,
    groupMethod: '1',
    optionDatas: [],
    leftSelect: [],
    rightSelect: [],
    randomLeft: [],
    randomRight: [],
    allPlayers:[]
  }
}

let initPlayers = function() {
  // 将数据放在当前组件的数据内
  let matchId = this.$route.query.matchId

  let params = {
    matchId: matchId
  }
  this.$api.post('/tableMatchDetails/getAllPlayersByMatchId', params, res => {

    if (res.status == 200) {
      this.optionDatas = []
      this.leftSelect = []
      this.randomLeft = []
      this.randomRight = []
      let list = res.data.content
      for (let i = 0; i < list.length; i++) {
        this.optionDatas.push({
          key: list[i].playerId,
          label: list[i].playerName
        });
        this.allPlayers.push(
          list[i].playerId
        )

        if (list[i].groupType != 0) {
          //如果已经分组
          if (list[i].groupType == 1) {
            this.leftSelect.push(
              list[i].playerId
            )
            this.randomLeft.push({
              id: list[i].playerId,
              name: list[i].playerName
            })
          } else {
            this.rightSelect.push(
              list[i].playerId
            )
            this.randomRight.push({
              id: list[i].playerId,
              name: list[i].playerName
            })
          }
        } else {
          //如果没有分组
          if (i % 2 == 1) {
            this.leftSelect.push(
              list[i].playerId
            )
            this.randomLeft.push({
              id: list[i].playerId,
              name: list[i].playerName
            })
          } else {
            this.rightSelect.push(
              list[i].playerId
            )
            this.randomRight.push({
              id: list[i].playerId,
              name: list[i].playerName
            })
          }
        }

      }
    } else {

    }
  });

}
let handleRandom = function() {
  this.randomLoading = true
  this.canRandom = true
  var load = this
  let list = randomSort(this.optionDatas);
  setTimeout(function() {
    load.randomLoading = false
    load.optionDatas = list
    load.randomLeft = []
    load.randomRight = []

    for (let i = 0; i < list.length; i++) {
      if (i % 2 == 1) {
        load.randomLeft.push({
          id: list[i].key,
          name: list[i].label
        })
      } else {
        load.randomRight.push({
          id: list[i].key,
          name: list[i].label
        })
      }
    }
    load.canRandom = false
  }, 3 * 1000);

}

let handleSave = function() {

  var leftArr = []
  var rightArr = []
  if (this.groupMethod == 1) {
    //leftArr = this.leftSelect
    rightArr = this.rightSelect
    leftArr = diffrentArr(this.allPlayers,this.rightSelect)
  } else {
    var leftList = this.$refs.leftTag
    var rightList = this.$refs.rightTag

    if (leftList.length > 0) {
      for (var k = 0; k < leftList.length; k++) {
        leftArr.push(leftList[k].$attrs.playerId)
      }
    }
    if (rightList.length > 0) {
      for (var k = 0; k < rightList.length; k++) {
        rightArr.push(rightList[k].$attrs.playerId)
      }
    }
  }

  let params = {
    leftArr: leftArr,
    rightArr: rightArr,
    groupType: this.groupMethod,
    matchId: this.$route.query.matchId
  }

  this.$api.post('/tableMatchDetails/updatePlayersGroup', params, response => {
    if (response.data.code == 0) {
      this.$common.recordLogs(encodeURI('保存分组阵容'),'4','web')
      this.$message({
        message: '分组成功！',
        type: 'success'
      });

    } else {
      this.$message({
        message: '分组失败!',
        type: 'error'
      });
    }
    this.$router.push({
      path: '/match'
    });

  });
}

let handleReset = function() {
  this.initPlayers();
}

let changeView = function(value) {
  if (value == 1) {
    //this.initPlayers();
  } else {

  }
}

function diffrentArr(array1, array2) {  
  var array3 = [];    
  for (var k = 0; k < array1.length; k++) {      
    var stra = array1[k];      
    var count = 0;      
    for (var j = 0; j < array2.length; j++) {        
      var strb = array2[j];        
      if (stra == strb) {          
        count++;        
      }      
    }      
    if (count === 0) {
      array3.push(stra);      
    }    
  }    
  return array3;
}

function randomSort(array) {
  var m = array.length,
    t, i;
  while (m) {
    // 随机选取一个元素…
    i = Math.floor(Math.random() * m--);
    // 与当前元素进行交换
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
//初始化页面所有数据
export default {

  data: data,
  methods: {
    initPlayers,
    handleRandom,
    handleSave,
    handleReset,
    changeView
  },
  mounted: function() {

    this.url_prefix = this.GLOBAL.httpRequestUrl
    if(this.$route.query.groupMethod == 0){
      this.groupMethod = '1'
    }else{
      this.groupMethod = this.$route.query.groupMethod + ''
    }
    this.initPlayers()
  }

}
</script>

<style scoped="scoped" lang="scss">
$width: 100%;
$height: 100%;
$header-height: 15%;

.mainContant {
    height: $height - $header-height;
}
</style>
