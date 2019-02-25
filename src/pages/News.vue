<template>
<section class="mainContant">
  <!--工具条-->
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
        <el-input v-model="filters.title" placeholder="新闻标题" style="width: 200px;" />
      </el-form-item>

      <el-form-item>
        <div class="block">
          <el-date-picker v-model="filters.releaseTimeStr" type="date" value-format="yyyy-MM-dd" placeholder="发布日期" style="width: 200px;">
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

    <el-table-column label="序号">
      <template slot-scope="scope">
       <span>{{ scope.row.id }}</span>
     </template>
    </el-table-column>

    <el-table-column label="作者">
      <template slot-scope="scope">
       <span>{{ scope.row.author }}</span>
     </template>
    </el-table-column>

    <el-table-column label="新闻来源">
      <template slot-scope="scope">
       <span>{{ scope.row.newFromStr }}</span>
     </template>
    </el-table-column>

    <el-table-column label="新闻类型">
      <template slot-scope="scope">
       <span>{{ scope.row.newTypeStr }}</span>
     </template>
    </el-table-column>

    <el-table-column label="发布时间" width="200">
      <template slot-scope="scope">
       <i class="el-icon-time"></i>
       <span style="margin-left: 10px">{{ scope.row.releaseTimeStr }}</span>
     </template>
    </el-table-column>

    <el-table-column label="新闻标题" width="300">
      <template slot-scope="scope">
       <el-popover trigger="hover" placement="top">
         <p>{{ scope.row.title }}</p>
         <div slot="reference" class="name-wrapper">
           <el-tag size="medium">{{ scope.row.title.substring(0,5)}}{{titleEllipsis}}</el-tag>
         </div>
       </el-popover>

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
  <el-dialog title="新闻" :visible.sync="formVisible" :close-on-click-modal="false" top="10px">

    <span v-html="newsContent"></span>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="formVisible = false">关闭</el-button>
    </div>

  </el-dialog>

</section>
</template>

<script>
//https://www.jianshu.com/p/4e00f11583fa
let data = () => {
  return {
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
    //表单提交状态
    formLoading: false,
    //下拉框
    newFromSelectOptions: [],
    //新闻来源
    newFrom: '',
    //新闻内容
    newsContent: '',
    //省略号
    titleEllipsis: '...'
  }
}
//点击重置按钮
let handleReset = function() {
  this.filters.title = '';
  this.filters.releaseTimeStr = '';
  this.filters.newFrom = '';
  this.page = 1
  this.getRows()
}
//点击查看详细按钮
let handleSee = function(index, row) {
  this.formVisible = true
  var str = row.content;
  str = insertStr(' style="width:500px;" ', str, '<img');
  this.newsContent = str
}

//获取table数据
let getRows = function() {
  if (this.pageLoading)
    return
  this.pageLoading = true

  let params = {
    page: this.page,
    size: this.size,
    title: '',
    releaseTimeStr: '',
    newFrom: '',
  }
  if (this.filters.title != undefined && this.filters.title != null && this.filters.title != '') {
    params.title = this.filters.title
  }
  if (this.filters.releaseTimeStr != undefined && this.filters.releaseTimeStr != null && this.filters.releaseTimeStr != '') {
    params.releaseTimeStr = this.filters.releaseTimeStr
  }
  if (this.filters.newFrom != undefined && this.filters.newFrom != null && this.filters.newFrom != '') {
    params.newFrom = this.filters.newFrom
  }

  this.$api.post('/tableNews/getAllByPage', params, response => {

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

//初始化基数数据下拉框
let initSelectOption = function() {

  let params = {
    type: 3
  }

  this.$api.post('/tableBasicData/getBasicDataByType', params, response => {

    if (response.status == 200) {
      this.newFromSelectOptions = response.data.data
    } else {

    }
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
    //下拉框初始化
    initSelectOption
  },
  mounted: function() {
    window.addEventListener('resize', this.initHeight)
    this.initHeight()
    this.getRows()
    this.initSelectOption()
  }

}

//在指定的字符串后面加入字符串
function insertStr(str1, str2, str3) {
  var ary = str2.split(str3);

  //当数组长度大于1，即str2中包含了str3
  if (ary.length > 1) {

    for (var i = 0; i < ary.length; i++) {
      //将数组的第二个元素前拼上str1
      if (i > 0) {
        ary[i] = str1 + ary[i];
      } else {
        ary[i] = ary[i];
      }
      //再用str3做为分隔符将数组拼成字符串
      str2 = ary.join(str3);
    }

  }
  return str2;
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
