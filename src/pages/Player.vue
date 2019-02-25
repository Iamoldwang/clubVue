<template>
<section class="mainContant">
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">

      <el-form-item>
        <el-input v-model="filters.name" placeholder="球员姓名" style="width: 200px;" />
      </el-form-item>

      <el-form-item>
        <el-button type="blue" v-on:click="handleQuery" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-on:click="handleReset" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
  </el-col>


  <el-table :data="tableData" style="width: 100%;" :height="clientHeight" stripe border highlight-current-row v-loading="pageLoading">

    <el-table-column label="头像" style="padding-bottom: 0px;padding-top: 5px;">
      <template slot-scope="scope">
       <img :src="url_prefix + scope.row.headImage" style="width: 30px;border-radius: 15px;height: 30px;"/>
     </template>
    </el-table-column>

    <el-table-column label="球衣号码">
      <template slot-scope="scope">
       <span>{{ scope.row.number }}</span>
     </template>
    </el-table-column>

    <el-table-column label="姓名">
      <template slot-scope="scope">
       <span>{{ scope.row.name }}</span>
     </template>
    </el-table-column>

    <el-table-column label="位置">
      <template slot-scope="scope">
       <span>{{ scope.row.positionName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="电话">
      <template slot-scope="scope">
       <span>{{ scope.row.phone }}</span>
     </template>
    </el-table-column>

    <el-table-column label="年龄">
      <template slot-scope="scope">
       <span>{{ scope.row.age }}</span>
     </template>
    </el-table-column>

    <el-table-column label="身高(cm)">
      <template slot-scope="scope">
       <span>{{ scope.row.height }}</span>
     </template>
    </el-table-column>

    <el-table-column label="体重(kg)">
      <template slot-scope="scope">
       <span>{{ scope.row.weight }}</span>
     </template>
    </el-table-column>

    <el-table-column label="入队时间" width="200">
      <template slot-scope="scope">
       <i class="el-icon-time"></i>
       <span style="margin-left: 10px">{{ scope.row.joinDate }}</span>
     </template>
    </el-table-column>



    <el-table-column label="查看">
      <template slot-scope="scope">
       <el-button
         size="mini"
         type="primary"
         @click="handleSee(scope.$index, scope.row)"><i class="el-icon-view" style="margin-right: 5px;"></i>查看</el-button>
     </template>
    </el-table-column>
  </el-table>
  <!--底部-->
  <el-col :span="24" class="toolbar">
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
    </el-pagination>
  </el-col>

  <!--对话框-->
  <el-dialog title="球员信息" :visible.sync="formVisible" :close-on-click-modal="false" >

    <table class="playerInfoTable">
      <tbody>
        <tr>
          <td>外号</td>
          <td>asd</td>
          <td>总场次</td>
          <td>50</td>
        </tr>
        <tr>
          <td>注册时间</td>
          <td>2018-05-05</td>
          <td>参赛场次</td>
          <td>22</td>
        </tr>
        <tr>
          <td>国籍</td>
          <td>中国</td>
          <td>迟到次数</td>
          <td>11</td>
        </tr>
        <tr>
          <td>球员类型</td>
          <td>会员</td>
          <td>缺勤次数</td>
          <td>11</td>
        </tr>
        <tr>
          <td>惯用脚</td>
          <td>右脚</td>
          <td>住址</td>
          <td>北京</td>
        </tr>
      </tbody>
    </table>

    <el-col :span="12">
      <div id="radarChart" :style="{width: '100%', height: '260px',paddingTop:'15px',paddingBottom:'15px'}"></div>
    </el-col>
    <el-col :span="12">
      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
    </el-col>


    <div slot="footer" class="dialog-footer">
      <el-button @click.native="formVisible = false">关闭</el-button>
    </div>

  </el-dialog>

</section>
</template>

<script>

// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/pie')
require('echarts/lib/chart/radar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
let data = () => {
  return {
    //url前缀
    url_prefix: '',
    //页码
    page: 1,
    //每页数量
    size: 10,
    //总数
    total: 0,
    //查询条件
    filters: {},
    //页面数据
    tableData: [],
    //页面载入状态
    pageLoading: false,
    //列表高度
    clientHeight: '100%',
    //对话框隐藏状态
    formVisible: false
  }
}
//点击重置按钮
let handleReset = function() {
  this.filters.name = '';
  this.page = 1
  this.getRows()
}
//点击查看详细按钮
let handleSee = function(index, row) {
  this.formVisible = true
  //initEchart()
  //echarts必须在dom完成渲染之后初始化
  this.$nextTick(()=> { initEchart(); initRadarChart(); })
}

//获取table数据
let getRows = function() {
  if (this.pageLoading)
    return
  this.pageLoading = true

  let params = {
    page: this.page,
    size: this.size,
    name: ''
  }
  if (this.filters.name != undefined && this.filters.name != null && this.filters.name != '') {
    params.name = this.filters.name
  }

  this.$api.post('/tablePlayer/getAllByPage', params, response => {

    if (response.status == 200) {
      this.pageLoading = false
      this.total = response.data.iTotalRecords
      this.page++;
      this.tableData = response.data.data
    } else {

    }
  });


}

//点击查询按钮
let handleQuery = function() {
  this.page = 1
  this.getRows()
}

//翻页获取数据
let handleCurrentChange = function(val) {
  this.page = val
  this.getRows()
}
//初始化高度
let initHeight = function() {
  this.clientHeight = (document.documentElement.clientHeight - 258) + 'px'
}

let initRadarChart = function() {
  // 基于准备好的dom，初始化echarts实例
  let myChart = echarts.init(document.getElementById('radarChart'))
  // 绘制图表
  var dataBJ = [
    [8.8,7.6,6.9,8.4,9.4,6.6,5.9],
  ];
  var lineStyle = {
      normal: {
          width: 1,
          opacity: 0.5
      }
  }
  myChart.setOption({
    backgroundColor: 'white',
    tooltip: {},
    radar: {
        indicator: [
            {name: '进攻', max: 10},
            {name: '防守', max: 10},
            {name: '速度', max: 10},
            {name: '技术', max: 10},
            {name: '身体', max: 10},
            {name: '意识', max: 10}
        ],
        shape: 'circle',
        splitNumber: 5,
        name: {
            textStyle: {
                color: '#fff',
                backgroundColor: '#e1d92e',
                borderRadius: 5,
                padding: [5, 5]
           }
        },
        splitLine: {
            lineStyle: {
                color: ['#e1d92e'].reverse()
            }
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(0, 0, 0, 0.3)'
            }
        }
    },
    series: [
        {
            name: '技术统计',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            itemStyle: {
                normal: {
                    color: 'black'
                }
            },
            areaStyle: {
                normal: {
                    opacity: 0.3
                }
            }
        }
    ]
  });
}
let initEchart = function() {
  // 基于准备好的dom，初始化echarts实例
  let myChart = echarts.init(document.getElementById('myChart'))
  // 绘制图表
  myChart.setOption({
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series : [
        {
            name: '参赛统计',
            type: 'pie',
            radius : '50%',
            center: ['50%', '50%'],
            label: {
                normal: {
                    formatter: '{b}：{c} ({d}%) '
                }
            },
            data:[
                {value:335, name:'参赛'},
                {value:235, name:'请假'},
                {value:310, name:'迟到'},
                {value:234, name:'缺勤'},
                {value:135, name:'早退'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0
                }
            }
        }
    ]
  });
}

//初始化数据
export default {
  data: data,
  methods: {
    //查询
    handleQuery,
    //添加
    handleReset,
    //查看详细新闻
    handleSee,
    //页数改变
    handleCurrentChange,
    //获取分页
    getRows,
    //初始化高度
    initHeight,
    //初始化echarts
    initEchart,
    initRadarChart
  },
  mounted: function() {
    window.addEventListener('resize', this.initHeight)
    this.initHeight()
    this.getRows()
    this.url_prefix = this.GLOBAL.httpRequestUrl
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
.playerInfoTable{
  border-spacing: 0px;
  border-collapse: collapse;
  width: 100%;
}
.playerInfoTable > tbody > tr > td{
  border: 1px solid #8a8a8a;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
