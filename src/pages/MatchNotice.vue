<template>
<section class="mainContant">
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">

      <el-form-item>
        <el-input v-model="filters.noticeTitle" placeholder="公告标题" style="width: 200px;" />
      </el-form-item>

      <el-form-item>
        <div class="block">
          <el-date-picker v-model="filters.releaseTimeStr" type="date" value-format="yyyy-MM-dd" placeholder="公告时间" style="width: 200px;">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="blue" v-on:click="handleQuery" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-on:click="handleReset" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
      <el-form-item v-if="currentPlayerType != 6">
        <el-button type="primary" v-on:click="handleAdd" icon="el-icon-plus">添加</el-button>
      </el-form-item>
    </el-form>
  </el-col>


  <el-table :data="tableData" style="width: 100%;" :height="clientHeight" stripe border highlight-current-row v-loading="pageLoading">

    <el-table-column label="标题">
      <template slot-scope="scope">
       <span>{{ scope.row.noticeTitle }}</span>
     </template>
    </el-table-column>

    <el-table-column label="发布人">
      <template slot-scope="scope">
       <span>{{ scope.row.playerName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="发布时间">
      <template slot-scope="scope">
       <span>{{ scope.row.releaseTimeStr }}</span>
     </template>
    </el-table-column>

    <el-table-column label="浏览次数">
      <template slot-scope="scope">
       <span>{{ scope.row.browseCount }}</span>
     </template>
    </el-table-column>

    <el-table-column label="公告内容">
      <template slot-scope="scope">
       <el-button
         size="mini"
         type="primary"
         @click="handleSee(scope.$index, scope.row)"><i class="el-icon-view" style="margin-right: 5px;"></i>查看</el-button>
     </template>
    </el-table-column>

    <el-table-column label="删除" v-if="currentPlayerType != 6">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete" style="margin-right: 5px;"></i>删除</el-button>
     </template>
    </el-table-column>

  </el-table>
  <!--底部-->
  <el-col :span="24" class="toolbar">
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
    </el-pagination>
  </el-col>

  <el-dialog :title="'添加公告'" :visible.sync="formVisibleAdd" :close-on-click-modal="false" width="30%" @close="formVisibleAdd = false">
    <el-form :model="noticeAddForm" label-width="100px" :rules="rules" ref="noticeAddForm">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="noticeAddForm.noticeTitle" placeholder="请输入公告标题" />
      </el-form-item>

      <el-form-item label="公告内容" prop="noticeContent">
        <el-input type="textarea" v-model="noticeAddForm.noticeContent" placeholder="请输入公告内容" />
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisibleAdd = false">取消</el-button>
      <el-button type="primary" @click.native="handleSubmitAdd" :loading="formLoading">提交</el-button>
    </div>
  </el-dialog>

  <el-dialog
    title="公告内容"
    :visible.sync="dialogContent"
    width="30%">
    <span>{{noticeContent}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogContent = false">关闭</el-button>
    </span>
  </el-dialog>

</section>
</template>

<script>
//form验证规则
const rules = {
  noticeTitle: [{
      required: true,
      message: '请输入公告标题',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 20,
      message: '长度在 1 到 20 个字符',
      trigger: 'blur'
    }
  ],
  noticeContent: [{
      required: true,
      message: '请输入公告内容',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 1000,
      message: '长度在 1 到 1000 个字符',
      trigger: 'blur'
    }
  ]
}
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
    rules: rules,
    //页面数据
    tableData: [],
    //页面载入状态
    pageLoading: false,
    formLoading: false,
    //列表高度
    clientHeight: '100%',
    //对话框隐藏状态
    formVisibleAdd:false,
    formVisible: false,
    dialogContent:false,
    currentPlayerType:'',
    noticeContent:'',
    noticeAddForm: {
      noticeTitle: '',
      noticeContent: ''
    },
  }
}

//点击重置按钮
let handleReset = function() {
  this.filters.noticeTitle = '';
  this.filters.releaseTimeStr = '';
  this.page = 1
  this.getRows()
}
//点击查看详细按钮
let handleSee = function(index, row) {
  this.dialogContent = true
  this.noticeContent = row.noticeContent

  let params = {
    id: row.id,
    browseCount:row.browseCount
  }
  this.$api.post('/tableNotice/plusBrowseCount', params, response => {
    this.getRows()
  });
}

//获取table数据
let getRows = function() {

  if (this.pageLoading)
    return
  this.pageLoading = true

  let params = {
    page: this.page,
    size: this.size,
    noticeTitle: '',
    releaseTimeStr:''
  }
  if (this.filters.noticeTitle != undefined && this.filters.noticeTitle != null && this.filters.noticeTitle != '') {
    params.noticeTitle = this.filters.noticeTitle
  }

  if (this.filters.releaseTimeStr != undefined && this.filters.releaseTimeStr != null && this.filters.releaseTimeStr != '') {
    params.releaseTimeStr = this.filters.releaseTimeStr
  }


  this.$api.post('/tableNotice/getAllByPage', params, response => {

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

let handleAdd = function() {
  this.formVisibleAdd = true
}
let handleDelete = function(index, row) {
  if (this.pageLoading)
    return

  let params = {
    id: row.id
  }

  this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.pageLoading = true

    this.$api.post('/tableNotice/delete', params, res => {

      this.pageLoading = false
      if (res.data.code == 0) {
        this.$common.recordLogs(encodeURI('删除公告'),'5','web')
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }

      this.page = 1
      this.getRows()

    });

  }).catch(e => {})
}

let handleSubmitAdd = function() {
  if (this.formLoading) {
    return
  }

  this.$refs.noticeAddForm.validate(valid => {
    if (!valid) {
      return
    }

    let params = {
      noticeTitle: this.noticeAddForm.noticeTitle,
      noticeContent: this.noticeAddForm.noticeContent
    }

    this.$api.post('/tableNotice/insert', params, response => {
      if (response.data.code == 0) {
        this.$common.recordLogs(encodeURI('添加公告'),'3','web')
        this.$message({
          message: '添加公告成功!',
          type: 'success'
        });

      } else {
        this.$message({
          message: response.data.message,
          type: 'error'
        });
      }
      this.page = 1
      this.getRows()
      this.formVisibleAdd = false
    });
  })
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
    handleAdd,
    handleDelete,
    handleSubmitAdd
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
