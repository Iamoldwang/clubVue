<template>
<section class="mainContant">
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">

      <el-form-item>
        <el-input v-model="filters.name" placeholder="姓名" style="width: 200px;" />
      </el-form-item>

      <el-form-item>
        <div class="block">
          <el-date-picker v-model="filters.applyTimeStr" type="date" value-format="yyyy-MM-dd" placeholder="申请时间" style="width: 200px;">
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

    <el-table-column label="姓名">
      <template slot-scope="scope">
       <span>{{ scope.row.name }}</span>
     </template>
    </el-table-column>

    <el-table-column label="电话">
      <template slot-scope="scope">
       <span>{{ scope.row.phone }}</span>
     </template>
    </el-table-column>

    <el-table-column label="申请时间">
      <template slot-scope="scope">
       <span>{{ scope.row.applyTimeStr }}</span>
     </template>
    </el-table-column>

    <el-table-column label="申请说明">
      <template slot-scope="scope">
       <span>{{ scope.row.applyDesc }}</span>
     </template>
    </el-table-column>

    <el-table-column label="审批时间">
      <template slot-scope="scope">
       <span>{{ scope.row.adoptTimeStr }}</span>
     </template>
    </el-table-column>

    <el-table-column label="审批人">
      <template slot-scope="scope">
       <span>{{ scope.row.adoptPlayerName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="审批">
      <template slot-scope="scope">
       <el-button v-if="scope.row.applyStatus == 0 && currentPlayerType != 6"
         size="mini"
         type="primary"
         @click="applyPlayer(scope.$index, scope.row)"><i class="el-icon-edit-outline" style="margin-right: 5px;"></i>审批</el-button>
       <el-button v-else-if="scope.row.applyStatus == 0 && currentPlayerType == 6"
         size="mini"
         type="info"
         disabled><i class="el-icon-edit-outline" style="margin-right: 5px;"></i>审批</el-button>
       <el-button v-else
         size="mini"
         type="success"><i class="el-icon-success" style="margin-right: 5px;"></i>已审批</el-button>
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

    currentPlayerType:''
  }
}

//点击重置按钮
let handleReset = function() {
  this.filters.name = '';
  this.filters.applyTimeStr = '';
  this.page = 1
  this.getRows()
}


//获取table数据
let getRows = function() {

  if (this.pageLoading)
    return
  this.pageLoading = true

  let params = {
    page: this.page,
    size: this.size,
    name: '',
    applyTimeStr:''
  }
  if (this.filters.name != undefined && this.filters.name != null && this.filters.name != '') {
    params.name = this.filters.name
  }

  if (this.filters.applyTimeStr != undefined && this.filters.applyTimeStr != null && this.filters.applyTimeStr != '') {
    params.applyTimeStr = this.filters.applyTimeStr
  }


  this.$api.post('/tableApplyJoinRecord/getAllByPage', params, response => {

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

let applyPlayer = function(index,row){
  let params = {
    id: row.id,
    applyStatus:1
  }
  this.$confirm('确定批准该球员加入球队？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.pageLoading = true

    this.$api.post('/tableApplyJoinRecord/apply', params, res => {

      this.pageLoading = false
      if (res.data.code == 0) {
        this.$common.recordLogs(encodeURI('批准入队'),'4','web')
        this.$message({
          message: '审批成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '审批失败',
          type: 'error'
        })
      }

      this.page = 1
      this.getRows()

    });

  }).catch(e => {})
}
//初始化数据
export default {
  data: data,
  methods: {
    //查询
    handleQuery,
    //添加
    handleReset,
    //页数改变
    handleCurrentChange,
    //获取分页
    getRows,
    //初始化高度
    initHeight,
    applyPlayer
  },
  mounted: function() {
    window.addEventListener('resize', this.initHeight)
    this.initHeight()
    this.getRows()
    this.url_prefix = this.GLOBAL.httpRequestUrl
    this.currentPlayerType = this.GLOBAL.currentPlayerType
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
