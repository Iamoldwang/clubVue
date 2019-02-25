<template>
<section class="mainContant">
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">


      <el-form-item>
        <el-input v-model="filters.matchName" placeholder="赛事名称" style="width: 200px;" />
      </el-form-item>

      <el-form-item>
        <div class="block">
          <el-date-picker v-model="filters.matchDateStr" type="date" value-format="yyyy-MM-dd" placeholder="比赛日期" style="width: 200px;">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="blue" v-on:click="handleQuery" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-on:click="handleReset" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="this.GLOBAL.currentPlayerType != '6'" v-on:click="handleAdd" icon="el-icon-plus">创建比赛</el-button>
      </el-form-item>
    </el-form>
  </el-col>

  <el-table :data="tableData" style="width: 100%;" :height="clientHeight" stripe border highlight-current-row v-loading="pageLoading">

    <el-table-column label="赛事名称">
      <template slot-scope="scope">
       <span>{{ scope.row.matchName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="赛事时间" width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span>{{ scope.row.matchDate }}({{ scope.row.matchTime }}-{{ scope.row.matchTime - 0 + 2 }})</span>
     </template>
    </el-table-column>

    <el-table-column label="赛事状态">
      <template slot-scope="scope">
        <el-tag type="blue" v-if="scope.row.matchStatus == 1">{{scope.row.matchStatusName}}</el-tag>
        <el-tag type="danger" v-else-if="scope.row.matchStatus == 2">{{scope.row.matchStatusName}}</el-tag>
        <el-tag type="danger" v-else-if="scope.row.matchStatus == 3">{{scope.row.matchStatusName}}</el-tag>
        <el-tag type="info" v-else>{{scope.row.matchStatusName}}</el-tag>

     </template>
    </el-table-column>

    <el-table-column label="报名人数">
      <template slot-scope="scope">
       <span>{{ scope.row.signTotal }}</span>
     </template>
    </el-table-column>

    <el-table-column label="实到/缺勤人数">
      <template slot-scope="scope">
       <span>{{ scope.row.shiDaoQueQinTotal }}</span>
     </template>
    </el-table-column>

    <el-table-column label="迟到/早退人数">
      <template slot-scope="scope">
       <span>{{ scope.row.chiDaoZaoTuiTotal }}</span>
     </template>
    </el-table-column>

    <el-table-column label="最终比分(主/客)">
      <template slot-scope="scope">
       <span>{{ scope.row.homeGoal }} - {{ scope.row.awayGoal }}</span>
     </template>
    </el-table-column>

    <el-table-column label="分组">
      <template slot-scope="scope">
        <el-button v-if="currentPlayerType != 6 && scope.row.groupMethod != 0"
          size="mini"
          type="success"
          @click="goToGroup(scope.$index, scope.row)"><i class="el-icon-menu" style="margin-right: 5px;"></i>已分组</el-button>

        <el-button v-else-if="currentPlayerType != 6 && scope.row.groupMethod == 0"
          size="mini"
          type="primary"
          @click="goToGroup(scope.$index, scope.row)"><i class="el-icon-menu" style="margin-right: 5px;"></i>未分组</el-button>
        <el-button v-else="currentPlayerType == 6 && scope.row.groupMethod != 0"
          size="mini"
          type="blue"
          @click="showGroup(scope.$index, scope.row)"><i class="el-icon-view" style="margin-right: 5px;"></i>查看分组</el-button>
     </template>
    </el-table-column>

    <el-table-column label="阵容" v-if="currentPlayerType != 6">
      <template slot-scope="scope">
        <el-button v-if="scope.row.lineUp == 1"
          size="mini"
          type="warning"
          @click="goToLineUp(scope.$index, scope.row)"><i class="el-icon-location" style="margin-right: 5px;"></i>首发阵容</el-button>
        <el-button v-else
          size="mini"
          type="success"
          @click="goToLineUp(scope.$index, scope.row)"><i class="el-icon-location" style="margin-right: 5px;"></i>编辑阵容</el-button>


     </template>
    </el-table-column>


    <el-table-column label="操作" width="300">
      <template slot-scope="scope">
       <el-button v-if="currentPlayerType != 6"
         size="mini"
         type="primary"
         @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit" style="margin-right: 5px;"></i>编辑</el-button>
       <el-button v-if="currentPlayerType != 6"
         size="mini"
         type="danger"
         @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete" style="margin-right: 5px;"></i>删除</el-button>
       <el-button
         size="mini"
         type="blue"
         @click="handleShowInfo(scope.$index, scope.row)"><i class="el-icon-view" style="margin-right: 5px;"></i>查看</el-button>
     </template>
    </el-table-column>
  </el-table>
  <!--底部-->
  <el-col :span="24" class="toolbar">
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
    </el-pagination>
  </el-col>


  <!--创建比赛对话框开始-->
  <el-dialog :title="'创建比赛'" :visible.sync="formVisibleAdd" :close-on-click-modal="false" width="25%" @close="closeDialogAdd">
    <el-form :model="matchAddForm" label-width="100px" :rules="rules" ref="matchAddForm">
      <el-form-item label="比赛名称" prop="matchName">
        <el-input v-model="matchAddForm.matchName" placeholder="请输入比赛名称" />
      </el-form-item>

      <el-form-item label="比赛日期" required>
        <el-col :span="11">
          <el-form-item prop="matchDate">
            <el-date-picker type="date" placeholder="请选择比赛日期" v-model="matchAddForm.matchDate" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="matchTime">
            <el-select v-model="matchAddForm.matchTime" placeholder="请选择比赛时间">
              <el-option
                v-for="item in hours"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="报名截止" required>
        <el-col :span="11">
          <el-form-item prop="signEndTimeDate">
            <el-date-picker type="date" placeholder="请选择截止日期" v-model="matchAddForm.signEndTimeDate" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="signEndTimeHour">
            <el-select v-model="matchAddForm.signEndTimeHour" placeholder="请选择截止时间">
              <el-option
                v-for="item in hours"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="比赛地址" prop="matchAddress">
        <el-input v-model="matchAddForm.matchAddress" placeholder="请输入比赛地址" />
      </el-form-item>

      <el-form-item label="比赛说明" prop="matchDesc">
        <el-input type="textarea" v-model="matchAddForm.matchDesc" placeholder="请输入比赛说明" />
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogAdd">取消</el-button>
      <el-button type="primary" @click.native="handleSubmitAdd" :loading="formLoading">提交</el-button>
    </div>
  </el-dialog>
  <!--创建比赛对话框结束-->

  <!--修改比赛对话框开始-->
  <el-dialog :title="'修改比赛'" :visible.sync="formVisibleUpdate" :close-on-click-modal="false" width="30%" @close="closeDialogUpdate">
    <el-form :model="matchUpdateForm" label-width="100px" :rules="rules" ref="matchUpdateForm">
      <el-form-item label="比赛名称" prop="matchName">
        <el-input v-model="matchUpdateForm.matchName" placeholder="请输入比赛名称" />
      </el-form-item>

      <el-form-item label="比赛日期" required>
        <el-col :span="11">
          <el-form-item prop="matchDate">
            <el-date-picker type="date" placeholder="请选择比赛日期" v-model="matchUpdateForm.matchDate" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="matchTime">
            <el-select v-model="matchUpdateForm.matchTime" placeholder="请选择比赛时间">
              <el-option
                v-for="item in hours"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="报名截止" required>
        <el-col :span="11">
          <el-form-item prop="signEndTimeDate">
            <el-date-picker type="date" placeholder="请选择截止日期" v-model="matchUpdateForm.signEndTimeDate" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="signEndTimeHour">
            <el-select v-model="matchUpdateForm.signEndTimeHour" placeholder="请选择截止时间">
              <el-option
                v-for="item in hours"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="比赛地址" prop="matchAddress">
        <el-input v-model="matchUpdateForm.matchAddress" placeholder="请输入比赛地址" />
      </el-form-item>

      <el-form-item label="比赛说明" prop="matchDesc">
        <el-input type="textarea" v-model="matchUpdateForm.matchDesc" placeholder="请输入比赛说明" />
      </el-form-item>

      <el-form-item label="场地费用" prop="fieldCost">
        <el-input v-model="matchUpdateForm.fieldCost" placeholder="请输入场地费用" />
      </el-form-item>

      <el-form-item label="比赛水费" prop="waterCost">
        <el-input v-model="matchUpdateForm.waterCost" placeholder="请输入比赛水费" />
      </el-form-item>

      <el-form-item label="最终比分">
        <el-col :span="11">
          <el-input-number v-model="matchUpdateForm.homeGoal" :min="0" :max="20" style="width: 100%;"></el-input-number>
        </el-col>
        <el-col class="line" :span="2">主/客</el-col>
        <el-col :span="11">
          <el-input-number v-model="matchUpdateForm.awayGoal" :min="0" :max="20" style="width: 100%;"></el-input-number>
        </el-col>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogUpdate">取消</el-button>
      <el-button type="primary" @click.native="handleSubmitUpdate" :loading="formLoading">提交</el-button>
    </div>
  </el-dialog>
  <!--修改比赛对话框结束-->

  <!-- 查看分组开始 -->
  <el-dialog
    title="分组情况"
    :visible.sync="dialogShowGroup"
    width="40%">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>(主队)</span>
          </div>
          <el-tag v-for="item in randomLeft" :key="item.name" type="success">
            {{item.name}}
          </el-tag>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>(客队)</span>
          </div>
          <el-tag v-for="item in randomRight" :key="item.name" type="warning">
            {{item.name}}
          </el-tag>
        </el-card>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogShowGroup = false">关闭</el-button>
    </span>
  </el-dialog>
  <!-- 查看分组结束 -->
</section>
</template>

<script>

import rulesUtil from '../utils/rules'
//form验证规则
const rules = {
  matchName: [{
      required: true,
      message: '请输入比赛名称',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 20,
      message: '长度在 1 到 20 个字符',
      trigger: 'blur'
    }
  ],
  matchDate: [{
    type: 'string',
    required: true,
    message: '请选择比赛日期',
    trigger: 'change'
  }],
  matchTime: [{
    required: true,
    message: '请选择比赛时间',
    trigger: 'change'
  }],
  signEndTimeDate: [{
    type: 'string',
    required: true,
    message: '请选择截止日期',
    trigger: 'change'
  }],
  signEndTimeHour: [{
    required: true,
    message: '请选择截止时间',
    trigger: 'change'
  }],
  matchAddress: [{
      required: true,
      message: '请输入比赛地址',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 20,
      message: '长度在 1 到 20 个字符',
      trigger: 'blur'
    }
  ],
  fieldCost:[{
      required: true,
      validator: rulesUtil.checkNumPot2,
      message: '请输入数字，最多2位小数',
      trigger: 'blur'
  }],
  waterCost:[{
      required: true,
      validator: rulesUtil.checkNumPot2,
      message: '请输入数字，最多2位小数',
      trigger: 'blur'
  }]
}

//初始化数据
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
    //页面载入状态
    pageLoading: false,
    //列表高度
    clientHeight: '100%',
    //添加from表单数据
    matchAddForm: {
      matchName: '',
      matchDesc: '',
      matchDate: '',
      matchTime: '',
      signEndTimeHour: '',
      signEndTimeDate: '',
      matchAddress: ''
    },
    //修改from表单数据
    matchUpdateForm: {
      id: '',
      name: '',
      matchSlogan: '',
      provinceId: '',
      cityId: '',
      fieldCost:'',
      waterCost:'',
      homeGoal:'',
      awayGoal:''
    },
    //验证规则
    rules: rules,
    //添加对话框隐藏状态
    formVisibleAdd: false,
    //修改对话框隐藏状态
    formVisibleUpdate: false,
    //表单提交状态
    formLoading: false,
    //省略号
    titleEllipsis: '...',
    hours:[{value:'8',label:'8'},{value:'9',label:'9'},{value:'10',label:'10'},{value:'11',label:'11'},{value:'12',label:'12'},{value:'13',label:'13'},{value:'14',label:'14'},
    {value:'15',label:'15'},{value:'16',label:'16'},{value:'17',label:'17'},{value:'18',label:'18'},{value:'19',label:'19'},{value:'20',label:'20'},{value:'21',label:'21'}],
    currentPlayerType:'',
    dialogShowGroup:false,
    randomLeft: [],
    randomRight: []
  }
}


//点击查询按钮
let handleQuery = function() {
  this.page = 1
  this.getRows()
}

//点击重置按钮
let handleReset = function() {
  this.filters.matchName = '';
  this.filters.matchDateStr = '';
  this.page = 1
  this.getRows()
}

//点击添加按钮
let handleAdd = function() {
  this.form = {}
  this.formVisibleAdd = true
}
//点击修改按钮
let handleEdit = function(index, row) {
  this.matchUpdateForm = Object.assign({}, row)
  this.formVisibleUpdate = true
}
//点击删除按钮
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

    this.$api.post('/tableMatch/delete', params, res => {

      this.pageLoading = false
      if (res.data.code == 0) {
        this.$common.recordLogs(encodeURI('删除比赛'),'5','web')
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

let handleShowInfo = function(index, row) {
  this.$router.push({
      path: '/matchDetails',
      query: {
          matchId: row.id
      }
  })
}

//点击修改按钮
let goToGroup = function(index, row) {
  if(row.matchStatus == 1){
    this.$message({
      message: '当前状态是报名中，报名结束才可以分组！',
      type: 'warning'
    });
    return
  }
  this.$router.push({
      path: '/matchGroup',
      query: {
          matchId: row.id,
          groupMethod:row.groupMethod
      }
  })

}
//获取table数据
let getRows = function() {

  if (this.pageLoading)
    return
  this.pageLoading = true

  let params = {
    page: this.page,
    size: this.size,
    matchName: '',
    matchDateStr:''
  }
  if (this.filters.matchName != undefined && this.filters.matchName != null && this.filters.matchName != '') {
    params.matchName = this.filters.matchName
  }
  if (this.filters.matchDateStr != undefined && this.filters.matchDateStr != null && this.filters.matchDateStr != '') {
    params.matchDateStr = this.filters.matchDateStr
  }

  this.$api.post('/tableMatch/getAllByPage', params, response => {

    if (response.status == 200) {
      this.pageLoading = false
      this.total = response.data.iTotalRecords
      this.page++;
      this.tableData = response.data.data
    } else {

    }
  });


}
//点击翻页
let handleCurrentChange = function(val) {
  this.page = val
  this.getRows()
}
//获取屏幕高度
let initHeight = function() {
  this.clientHeight = (document.documentElement.clientHeight - 258) + 'px'
}

//点击添加提交按钮
let handleSubmitAdd = function() {

  if (this.formLoading) {
    return
  }

  this.$refs.matchAddForm.validate(valid => {
    if (!valid) {
      return
    }

    let hourMatch = this.matchAddForm.matchTime < 10 ? '0' + this.matchAddForm.matchTime : this.matchAddForm.matchTime
    let hourSign = this.matchAddForm.signEndTimeHour < 10 ? '0' + this.matchAddForm.signEndTimeHour : this.matchAddForm.signEndTimeHour
    let biSaiShiJian = this.matchAddForm.matchDate + ' ' + hourMatch + ':00:00';
    let baoMingShiJian = this.matchAddForm.signEndTimeDate + ' ' + hourSign + ':00:00';

    var compare = this.GLOBAL.compareTime(biSaiShiJian,baoMingShiJian);
    if(!compare){
      this.$message({
        message: '报名截止时间必须大于比赛时间!',
        type: 'warning'
      });
      return
    }
    this.formLoading = true
    this.formVisibleAdd = false

    let params = {
      matchName: this.matchAddForm.matchName,
      matchDate: this.matchAddForm.matchDate,
      matchTime: this.matchAddForm.matchTime,
      signEndTime: baoMingShiJian,
      matchAddress: this.matchAddForm.matchAddress,
      matchDesc: this.matchAddForm.matchDesc
    }

    this.$api.post('/tableMatch/insert', params, response => {
      if (response.data.code == 0) {
        this.$common.recordLogs(encodeURI('创建比赛'),'3','web')
        this.$message({
          message: '比赛创建成功!',
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
      this.formLoading = false
    });
  })

}
//点击修改提交按钮
let handleSubmitUpdate = function() {
  if (this.formLoading) {
    return
  }

  this.$refs.matchUpdateForm.validate(valid => {
    if (!valid) {
      return
    }

    this.formLoading = true
    this.formVisibleUpdate = false
    let hourMatch = this.matchUpdateForm.matchTime < 10 ? '0' + this.matchUpdateForm.matchTime : this.matchUpdateForm.matchTime
    let hourSign = this.matchUpdateForm.signEndTimeHour < 10 ? '0' + this.matchUpdateForm.signEndTimeHour : this.matchUpdateForm.signEndTimeHour
    let biSaiShiJian = this.matchUpdateForm.matchDate + ' ' + hourMatch + ':00:00';
    let baoMingShiJian = this.matchUpdateForm.signEndTimeDate + ' ' + hourSign + ':00:00';

    var compare = this.GLOBAL.compareTime(biSaiShiJian,baoMingShiJian);
    if(!compare){
      this.$message({
        message: '报名截止时间必须大于比赛时间!',
        type: 'warning'
      });
      return
    }
    this.formLoading = true


    let params = {
      id:this.matchUpdateForm.id,
      matchName: this.matchUpdateForm.matchName,
      matchDate: this.matchUpdateForm.matchDate,
      matchTime: this.matchUpdateForm.matchTime,
      signEndTime: baoMingShiJian,
      matchAddress: this.matchUpdateForm.matchAddress,
      matchDesc: this.matchUpdateForm.matchDesc,
      fieldCost:this.matchUpdateForm.fieldCost,
      waterCost:this.matchUpdateForm.waterCost,
      homeGoal:this.matchUpdateForm.homeGoal,
      awayGoal:this.matchUpdateForm.awayGoal
    }

    this.$api.post('/tableMatch/update', params, response => {
      if (response.data.code == 0) {
        this.$common.recordLogs(encodeURI('修改比赛'),'4','web')
        this.$message({
          message: '比赛修改成功!',
          type: 'success'
        });
      } else {
        this.$message({
          message: '比赛修改失败!',
          type: 'error'
        });
      }
      this.page = 1
      this.getRows()
      this.formLoading = false
      this.formVisibleAdd = false
    });
  })
}


//关闭对话框时的操作（添加）
let closeDialogAdd = function() {
  this.formVisibleAdd = false;
  this.$refs.matchAddForm.resetFields()
}
//关闭对话框时的操作（修改）
let closeDialogUpdate = function() {
  this.formVisibleUpdate = false;
  this.$refs.matchUpdateForm.resetFields()
}
let showGroup = function(index, row){
  if(row.matchStatus){
    //asd报名没结束，无法查看分组
  }
  this.dialogShowGroup = true
  this.randomLeft = []
  this.randomRight = []

  let params = {
    matchId: row.id
  }
  this.$api.post('/tableMatchDetails/getAllPlayersByMatchId', params, res => {
    if (res.status == 200) {
      let list = res.data.content
      for (let i = 0; i < list.length; i++) {
        if (list[i].groupType != 0) {
          //如果已经分组
          if (list[i].groupType == 1) {
            this.randomLeft.push({
              id: list[i].playerId,
              name: list[i].playerName
            })
          } else {
            this.randomRight.push({
              id: list[i].playerId,
              name: list[i].playerName
            })
          }
        }
      }
    }
  })
}

let goToLineUp = function(index, row){
  if(row.matchStatus == 1){
    this.$message({
      message: '当前状态是报名中，报名结束才可以编辑阵容！',
      type: 'warning'
    });
    return
  }
  this.$router.push({
      path: '/lineup',
      query: {
          matchId: row.id,
          lineUp:row.lineUp

      }
  })
}

let showLineUp = function(){

}
//初始化页面所有数据
export default {
  data: data,
  methods: {
    //查询
    handleQuery,
    //添加
    handleReset,
    //添加
    handleAdd,
    //修改
    handleEdit,
    //删除
    handleDelete,
    //页数改变
    handleCurrentChange,
    //获取分页
    getRows,
    //初始化高度
    initHeight,
    //添加提交数据
    handleSubmitAdd,
    //修改提交数据
    handleSubmitUpdate,
    //关闭对话框（添加）
    closeDialogAdd,
    //关闭对话框（修改）
    closeDialogUpdate,
    handleShowInfo,
    goToGroup,
    showGroup,
    goToLineUp,
    showLineUp

  },
  mounted: function() {
    //监听屏幕改变
    window.addEventListener('resize', this.initHeight)
    //获取屏幕高度
    this.initHeight()
    //获取table数据
    this.getRows()
    this.url_prefix = this.GLOBAL.httpRequestUrl

    console.log('--------2222----' + this.url_prefix);
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
</style>
