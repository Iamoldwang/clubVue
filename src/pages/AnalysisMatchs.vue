<template>
<section class="mainContant">
  <!--工具条-->
  <el-row style="margin-top: 5%;">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">

        <el-form-item>
          <template>
            <el-select v-model="filters.newFrom" placeholder="请选择" style="width: 200px;">
              <el-option v-for="item in newFromSelectOptions"
                :key="item.basicCode"
                :label="item.basicName"
                :value="item.basicCode">
              </el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.title" placeholder="费用名称" style="width: 200px;" />
        </el-form-item>

        <el-form-item>
          <div class="block">
            <el-date-picker v-model="filters.releaseTimeStr" type="date" value-format="yyyy-MM-dd" placeholder="查询日期" style="width: 200px;">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

  <el-row style="margin-top: 5%;">
    <div id="myChart" style="width:100%;height:500px;"></div>
  </el-row>
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
    filters: {}
  }
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
  yData = [15,15,14,13,12,11,11,10,9,8]
  title = '2018赛季球员参赛榜TOP10'
  seriesName = '参赛次数'
  option = initBarOption(xData,yData,title,seriesName)
  clearTimeout(loadingData);
  loadingData = setTimeout(function() {
    chart.hideLoading();
    chart.setOption(option);
  }, 1000);
}
//初始化页面所有数据
export default {

  data: data,
  methods: {
    initEchart
  },
  mounted: function() {

    this.url_prefix = this.GLOBAL.httpRequestUrl
    this.initEchart()
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
