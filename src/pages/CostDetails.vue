<template>
<section class="mainContant">
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">

      <el-form-item>
        <el-input v-model="filters.description" placeholder="费用描述" style="width: 200px;" />
      </el-form-item>

      <el-form-item>
        <template>
          <el-select v-model="filters.accountType" placeholder="请选择账户类型" style="width: 200px;">
            <el-option v-for="type in accountTypeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item>
        <template>
          <el-select v-model="filters.costType" placeholder="请选择费用类型" style="width: 200px;">
            <el-option v-for="cost in costTypeOptions"
              :key="cost.basicCode"
              :label="cost.basicName"
              :value="cost.basicCode">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item>
        <div class="block">
          <el-date-picker v-model="filters.accountTimeStr" type="date" value-format="yyyy-MM-dd" placeholder="记账时间" style="width: 200px;">
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

    <el-table-column label="账户类型">
      <template slot-scope="scope">
       <span>{{ scope.row.accountTypeName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="金额(元)">
      <template slot-scope="scope">
       <span>{{ scope.row.money }}</span>
     </template>
    </el-table-column>

    <el-table-column label="费用类型">
      <template slot-scope="scope">
       <el-tag v-if="scope.row.costType == 6" type="danger">{{ scope.row.costTypeName }}</el-tag>
       <el-tag v-else type="success">{{ scope.row.costTypeName }}</el-tag>
     </template>
    </el-table-column>

    <el-table-column label="发生人">
      <template slot-scope="scope">
       <span>{{ scope.row.playerName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="记账人">
      <template slot-scope="scope">
       <span>{{ scope.row.bookkeeperName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="记账日期">
      <template slot-scope="scope">
       <span>{{ scope.row.accountTimeStr }}</span>
     </template>
    </el-table-column>

    <el-table-column label="本期余额(元)">
      <template slot-scope="scope">
       <span>{{ scope.row.currentBalance }}</span>
     </template>
    </el-table-column>

    <el-table-column label="描述">
      <template slot-scope="scope">
       <span>{{ scope.row.description }}</span>
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

  <el-dialog :title="'添加费用明细'" :visible.sync="formVisibleAdd" :close-on-click-modal="false" width="30%" @close="closeDialogAdd">
    <el-form :model="costAddForm" label-width="100px" :rules="rules" ref="costAddForm">

      <el-form-item label="账户类型" prop="accountType">
        <template>
          <el-select v-model="costAddForm.accountType" placeholder="请选择账户类型" style="width: 100%;">
            <el-option v-for="item in accountTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item label="费用类型" prop="costType">
        <template>
          <el-select v-model="costAddForm.costType" placeholder="请选择费用类型" style="width: 100%;">
            <el-option v-for="cost in costTypeOptions"
              :key="cost.basicCode"
              :label="cost.basicName"
              :value="cost.basicCode">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item label="选择球员" prop="players">
        <template>
          <el-select v-model="costAddForm.players" multiple placeholder="请选择球员" style="width: 100%;">
            <el-option v-for="player in playersOptions"
              :key="player.id"
              :label="player.name"
              :value="player.id">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item label="费用金额" prop="money">
        <el-input v-model="costAddForm.money" placeholder="请输入费用金额" />
      </el-form-item>

      <el-form-item label="费用描述" prop="description">
        <el-input type="textarea" v-model="costAddForm.description" placeholder="请输入费用描述" />
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogAdd">取消</el-button>
      <el-button type="primary" @click.native="handleSubmitAdd" :loading="formLoading">提交</el-button>
    </div>
  </el-dialog>

</section>
</template>

<script>
import rulesUtil from '../utils/rules'
//form验证规则
const rules = {
  accountType: [{
      required: true,
      message: '请选择账户类型',
      trigger: 'change'
    }
  ],
  costType: [{
      required: true,
      message: '请选择费用类型',
      trigger: 'change'
    }
  ],
  players: [{
      required: true,
      message: '请选择球员',
      trigger: 'change'
    }
  ],
  money: [{
      required: true,
      validator: rulesUtil.checkNumPot2,
      message: '请输入数字，最多2位小数',
      trigger: 'blur'
    }
  ],
  description: [{
      required: true,
      message: '请输入费用描述',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 20,
      message: '长度在 1 到 20 个字符',
      trigger: 'blur'
    }
  ]
}
let data = () => {
  return {
    rulesUtil,
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
    rules: rules,
    //页面载入状态
    pageLoading: false,
    formVisibleAdd:false,
    //列表高度
    clientHeight: '100%',
    //对话框隐藏状态
    formVisible: false,
    formLoading:false,
    //省略号
    currentPlayerType:'',
    titleEllipsis: '...',
    accountTypeOptions:[{
          value: '0',
          label: '入账'
        },
        {
          value: '1',
          label: '出账'
        }],
    costTypeOptions:[],
    costAddForm:{
      accountType:'',
      costType:'',
      money:'',
      description:'',
      players:''
    },
    playersOptions:[],
    currentPage:''
  }
}

//初始化基数数据下拉框
let initSelectOption = function() {

  let params = {
    type: 1
  }

  this.$api.post('/tableBasicData/getBasicDataByType', params, response => {

    if (response.status == 200) {
      this.costTypeOptions = response.data.data
    } else {

    }
  });

}
//点击重置按钮
let handleReset = function() {
  this.filters.accountTimeStr = '';
  this.filters.accountType = '';
  this.filters.costType = '';
  this.filters.description = '';
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
    accountTimeStr: '',
    accountType:'',
    costType:'',
    description:''
  }
  if (this.filters.accountTimeStr != undefined && this.filters.accountTimeStr != null && this.filters.accountTimeStr != '') {
    params.accountTimeStr = this.filters.accountTimeStr
  }

  if (this.filters.accountType != undefined && this.filters.accountType != null && this.filters.accountType != '') {
    params.accountType = this.filters.accountType
  }
  if (this.filters.costType != undefined && this.filters.costType != null && this.filters.costType != '') {
    params.costType = this.filters.costType
  }
  if (this.filters.description != undefined && this.filters.description != null && this.filters.description != '') {
    params.description = this.filters.description
  }

  this.$api.post('/tableAccountDetails/getAllByPage', params, response => {

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
  this.currentPage = val
}
//初始化高度
let initHeight = function() {
  this.clientHeight = (document.documentElement.clientHeight - 258) + 'px'
}

let handleAdd = function() {
  this.formVisibleAdd = true
  this.initAllPlayers()
}

let handleSubmitAdd = function() {
  if (this.formLoading) {
    return
  }

console.log('---------' + this.costAddForm.accountType);
  this.$refs.costAddForm.validate(valid => {
    if (!valid) {
      return
    }
    this.formLoading = true

    let params = {
      accountType: this.costAddForm.accountType,
      costType: this.costAddForm.costType,
      players: this.costAddForm.players,
      money: this.costAddForm.money,
      description: this.costAddForm.description
    }

    this.$api.post('/tableAccountDetails/insert', params, response => {
      if (response.data.code == 0) {
        this.$common.recordLogs(encodeURI('添加费用明细'),'3','web')
        this.$message({
          message: '添加费用明细成功!',
          type: 'success'
        });

      } else {
        this.$message({
          message: response.data.message,
          type: 'error'
        });
      }
      this.page = this.currentPage
      this.getRows()
      this.formLoading = false
      this.formVisibleAdd = false
    });
  })
}

let initAllPlayers = function(){
  var params = null
  this.$api.post('/tablePlayer/getAll', params, response => {
    this.playersOptions = response.data.content
  });
}

let closeDialogAdd = function() {
  this.formVisibleAdd = false;
  this.$refs.costAddForm.resetFields()
  //this.costTypeOptions = [];
  //this.playersOptions = [];
}

let handleDelete = function(index, row){
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

    this.$api.post('/tableAccountDetails/delete', params, res => {

      this.pageLoading = false
      if (res.data.code == 0) {
        this.$common.recordLogs(encodeURI('删除费用明细'),'5','web')
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

      this.page = this.currentPage
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

    initSelectOption,
    handleSubmitAdd,
    handleAdd,
    initAllPlayers,
    closeDialogAdd,
    handleDelete
  },
  mounted: function() {
    window.addEventListener('resize', this.initHeight)
    this.initHeight()
    this.getRows()
    this.url_prefix = this.GLOBAL.httpRequestUrl
    this.initSelectOption()
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
