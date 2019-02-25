<template>
<section class="mainContant">

  <el-scrollbar style="height:100%">
  <!--工具条-->
  <el-row style="margin-top: 5%;">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">

        <el-form-item>
          <template>
            <el-select v-model="filters.orderByField" placeholder="请选择" style="width: 200px;">
              <el-option v-for="item in orderByFieldOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item>
          <div class="block">
            <el-date-picker v-model="filters.searchDate" type="year" placeholder="查询日期" style="width: 200px;">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" v-on:click="handleQuery" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" v-on:click="handleReset" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

  <el-row style="margin-top: 5%;">
    <div id="myChart" style="width:100%;height:500px;"></div>
  </el-row>

  <el-row style="margin-top: 5%;">
    <el-table :data="tableData" style="width: 100%;" :height="clientHeight" stripe border highlight-current-row v-loading="pageLoading">

      <el-table-column label="姓名">
        <template slot-scope="scope">
         <span>{{ scope.row.playerName }}</span>
       </template>
      </el-table-column>

      <el-table-column label="参赛">
        <template slot-scope="scope">
         <span>{{ scope.row.totalPlay }}</span>
       </template>
      </el-table-column>

      <el-table-column label="迟到">
        <template slot-scope="scope">
         <span>{{ scope.row.totalLate }}</span>
       </template>
      </el-table-column>

      <el-table-column label="罚款">
        <template slot-scope="scope">
         <span>{{ scope.row.totalFakuan }}</span>
       </template>
      </el-table-column>

      <el-table-column label="进球">
        <template slot-scope="scope">
         <span>{{ scope.row.totalGoal }}</span>
       </template>
      </el-table-column>

      <el-table-column label="助攻">
        <template slot-scope="scope">
         <span>{{ scope.row.totalAssist }}</span>
       </template>
      </el-table-column>

      <el-table-column label="扑救">
        <template slot-scope="scope">
         <span>{{ scope.row.totalSave }}</span>
       </template>
      </el-table-column>

      <el-table-column label="评分">
        <template slot-scope="scope">
         <span>{{ Number(scope.row.avgPoint).toFixed(2)}}</span>
       </template>
      </el-table-column>

      <el-table-column label="场均进球">
        <template slot-scope="scope">
         <span>{{ scope.row.avgGoal }}</span>
       </template>
      </el-table-column>

    </el-table>
  </el-row>
  </el-scrollbar>
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
//初始化数据
let data = () => {
  return {
    //url前缀
    url_prefix: '',
    filters: {
      orderByField:'totalPlay',
      searchDate:''
    },
    //页面数据
    tableData: [],
    //页面载入状态
    pageLoading: false,
    //列表高度
    clientHeight: '1900px',
    orderByFieldOptions:[{
      value: 'totalPlay',
      label: '按参赛排序'
    }, {
      value: 'totalLate',
      label: '按迟到排序'
    }, {
      value: 'totalFakuan',
      label: '按罚款排序'
    }, {
      value: 'totalGoal',
      label: '按进球排序'
    }, {
      value:'totalAssist',
      label: '按助攻排序'
    }, {
      value: 'totalSave',
      label: '按扑救排序'
    }, {
      value: 'avgPoint',
      label: '按评分排序'
    }, {
      value: 'avgGoal',
      label: '按场均进球排序'
    }]
  }
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

let initEchart = function() {
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
  xData = ['许为民','王攀','张小强','李金柱','谢然','许树刚','王飞','黄海','彭晓辉','黄峰']
  yData = [15,22,14,13,12,17,11,10,13,8]
  title = '2018赛季球员参赛榜TOP10'
  seriesName = '参赛次数'
  option = initLineOption(xData,yData,title,seriesName)
  clearTimeout(loadingData);
  loadingData = setTimeout(function() {
    chart.hideLoading();
    chart.setOption(option);
  }, 1000);
}

let initDataTable = function(){
  let param = {}

  if (this.filters.orderByField != undefined && this.filters.orderByField != null && this.filters.orderByField != '') {
    param.orderByField = this.filters.orderByField
  }else{
    param.orderByField = 'totalPlay'
  }
  if (this.filters.searchDate != undefined && this.filters.searchDate != null && this.filters.searchDate != '') {
    param.searchDate = this.filters.searchDate
  }

  param.limit = 40
  this.$api.post('/tableMatchDetails/matchTechnicalData', param, response => {
    this.pageLoading = false
    var vo = response.data.content
    this.tableData = vo.matchDataLists
  });
}

//点击查询按钮
let handleQuery = function() {
  this.initDataTable()
}

//点击重置按钮
let handleReset = function() {
  this.filters.orderByField = '';
  this.filters.searchDate = '';
  this.initDataTable()
}

//初始化页面所有数据
export default {

  data: data,
  methods: {
    initEchart,
    initDataTable,
    handleQuery,
    handleReset
  },
  mounted: function() {

    this.url_prefix = this.GLOBAL.httpRequestUrl
    this.initEchart()
    this.initDataTable()
    this.filters.searchDate = '' + this.$common.getCurrentFormatDate('yyyy');
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
</style>
