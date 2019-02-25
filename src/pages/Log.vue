<template>
<section class="mainContant">
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">

      <el-form-item>
        <el-input v-model="filters.playerName" placeholder="球员姓名" style="width: 200px;" />
      </el-form-item>

      <el-form-item>
        <template>
          <el-select v-model="filters.typeName" placeholder="请选择类型" style="width: 200px;">
            <el-option v-for="item in typeNameOptions"
              :key="item.basicCode"
              :label="item.basicName"
              :value="item.basicCode">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item>
        <template>
          <el-select v-model="filters.visit" placeholder="请选择方式" style="width: 200px;">
            <el-option v-for="item in visitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item>
        <div class="block">
          <el-date-picker v-model="filters.logTimeStr" type="date" value-format="yyyy-MM-dd" placeholder="日志日期" style="width: 200px;">
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


  <el-table :data="tableData" style="width: 100%;" :height="clientHeight" stripe border highlight-current-row v-loading="pageLoading">

    <el-table-column label="内容">
      <template slot-scope="scope">
       <span>{{ scope.row.content }}</span>
     </template>
    </el-table-column>

    <el-table-column label="类型">
      <template slot-scope="scope">
       <span>{{ scope.row.typeName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="球员">
      <template slot-scope="scope">
       <span>{{ scope.row.playerName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="时间">
      <template slot-scope="scope">
       <span>{{ scope.row.logTimeStr }}</span>
     </template>
    </el-table-column>

    <el-table-column label="ip">
      <template slot-scope="scope">
       <span>{{ scope.row.ip }}</span>
     </template>
    </el-table-column>

    <el-table-column label="VISIT">
      <template slot-scope="scope">
       <span>{{ scope.row.visit }}</span>
     </template>
    </el-table-column>

  </el-table>
  <!--底部-->
  <el-col :span="24" class="toolbar">
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
    </el-pagination>
  </el-col>

</section>
</template>

<script>

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
    formVisible: false,
    visitOptions:[{
          value: 'web',
          label: 'web'
        },
        {
          value: 'H5',
          label: 'H5'
        },
        {
          value: 'wechat',
          label: 'wechat'
        }],
    typeNameOptions:[]
  }
}

//初始化基数数据下拉框
let initSelectOption = function() {

  let params = {
    type: 8
  }

  this.$api.post('/tableBasicData/getBasicDataByType', params, response => {

    if (response.status == 200) {
      this.typeNameOptions = response.data.data
    } else {

    }
  });

}
//点击重置按钮
let handleReset = function() {
  this.filters.playerName = '';
  this.filters.typeName = '';
  this.filters.visit = '';
  this.filters.logTimeStr = '';
  this.page = 1
  this.getRows()
}
//点击查看详细按钮
let handleSee = function(index, row) {
  this.formVisible = true
  //initEchart()
  //echarts必须在dom完成渲染之后初始化
  this.$nextTick(()=> { initEchart() })
}

//获取table数据
let getRows = function() {

  if (this.pageLoading)
    return
  this.pageLoading = true

  let params = {
    page: this.page,
    size: this.size,
    playerName: '',
    type:'',
    visit:'',
    logTimeStr:''
  }
  if (this.filters.playerName != undefined && this.filters.playerName != null && this.filters.playerName != '') {
    params.playerName = this.filters.playerName
  }

  if (this.filters.typeName != undefined && this.filters.typeName != null && this.filters.typeName != '') {
    params.type = this.filters.typeName
  }
  if (this.filters.visit != undefined && this.filters.visit != null && this.filters.visit != '') {
    params.visit = this.filters.visit
  }
  if (this.filters.logTimeStr != undefined && this.filters.logTimeStr != null && this.filters.logTimeStr != '') {
    params.logTimeStr = this.filters.logTimeStr
  }

  this.$api.post('/tableLog/getAllByPage', params, response => {

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

let initEchart = function() {

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
    initSelectOption
  },
  mounted: function() {
    window.addEventListener('resize', this.initHeight)
    this.initHeight()
    this.getRows()
    this.url_prefix = this.GLOBAL.httpRequestUrl
    this.initSelectOption()
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
