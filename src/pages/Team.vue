<template>
<section class="mainContant">
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">


      <el-form-item>
        <el-input v-model="filters.name" placeholder="球队名称" style="width: 200px;" />
      </el-form-item>

      <el-form-item>
        <el-button type="blue" v-on:click="handleQuery" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-on:click="handleReset" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
      <el-form-item  v-if="currentPlayerType != 6 && currentPlayerIsJoin != 1">
        <el-button type="primary" v-on:click="handleAdd" icon="el-icon-plus">添加</el-button>
      </el-form-item>
    </el-form>
  </el-col>

  <el-table :data="tableData" style="width: 100%;" :height="clientHeight" stripe border highlight-current-row v-loading="pageLoading">

    <el-table-column label="球队队徽" style="padding-bottom: 0px;padding-top: 5px;">
      <template slot-scope="scope">
       <img :src="url_prefix + scope.row.teamImage" style="width: 30px;border-radius: 15px;height: 30px;"/>
     </template>
    </el-table-column>

    <el-table-column label="所在地区">
      <template slot-scope="scope">
       <span>{{ scope.row.name }}</span>
     </template>
    </el-table-column>

    <el-table-column label="球队编号">
      <template slot-scope="scope">
       <span>{{ scope.row.code }}</span>
     </template>
    </el-table-column>

    <el-table-column label="创建日期">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
       <span>{{ scope.row.establishDate }}</span>
     </template>
    </el-table-column>

    <el-table-column label="创建人">
      <template slot-scope="scope">
       <span>{{ scope.row.establishUserName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="所在地区">
      <template slot-scope="scope">
       <span>{{ scope.row.placeName }}</span>
     </template>
    </el-table-column>

    <el-table-column label="球队口号" width="300">
      <template slot-scope="scope">
       <el-popover trigger="hover" placement="top">
         <p>{{ scope.row.teamSlogan }}</p>
         <div slot="reference" class="name-wrapper">
           <el-tag size="medium">{{ scope.row.teamSlogan.substring(0,5)}}{{titleEllipsis}}</el-tag>
         </div>
       </el-popover>

     </template>
    </el-table-column>

    <el-table-column label="操作" v-if="currentPlayerType != 6">
      <template slot-scope="scope">
       <el-button
         size="mini"
         type="primary"
         @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit" style="margin-right: 5px;"></i>编辑</el-button>
       <!-- <el-button
         size="mini"
         type="danger"
         @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete" style="margin-right: 5px;"></i>删除</el-button> -->
     </template>
    </el-table-column>
  </el-table>
  <!--底部-->
  <el-col :span="24" class="toolbar">
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
    </el-pagination>
  </el-col>


  <!--对话框-->

  <el-dialog :title="'添加球队'" :visible.sync="formVisibleAdd" :close-on-click-modal="false" width="30%" @close="closeDialogAdd">
    <el-form :model="teamAddForm" label-width="100px" :rules="rules" ref="teamAddForm">
      <el-form-item label="球队名称" prop="name">
        <el-input v-model="teamAddForm.name" placeholder="请输入球队名称" />
      </el-form-item>

      <el-form-item label="所在省市" prop="provinceId">
        <el-select v-model="teamAddForm.provinceId" placeholder="请选择省市" @change="initCitysAdd" style="width:100%">
          <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所在地区" prop="cityId">
        <el-select v-model="teamAddForm.cityId" placeholder="请选择地区" style="width:100%">
          <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="球队口号" prop="teamSlogan">
        <el-input type="textarea" v-model="teamAddForm.teamSlogan" placeholder="请输入球队口号" />
      </el-form-item>

      <el-form-item label="球队队徽">
        <el-upload class="upload-demo" accept="image/jpeg,image/jpg,image/png" :auto-upload="false" ref="upload" action="" :on-change="uploadSectionFile" :on-remove="removeImage" list-type="picture">
          <el-button size="small" type="primary" v-show="isUploadShowHide">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" v-show="isUploadShowHide" style="margin-top: -40px;idth: 300px;margin-left: 100px;text-align: left;color: red;">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>

      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogAdd">取消</el-button>
      <el-button type="primary" @click.native="handleSubmitAdd" :loading="formLoading">提交</el-button>
    </div>
  </el-dialog>

  <el-dialog :title="'修改球队'" :visible.sync="formVisibleUpdate" :close-on-click-modal="false" width="30%" @close="closeDialogUpdate">
    <el-form :model="teamUpdateForm" label-width="100px" :rules="rules" ref="teamUpdateForm">
      <el-form-item label="球队名称" prop="name">
        <el-input v-model="teamUpdateForm.name" placeholder="请输入球队名称" />
      </el-form-item>

      <el-form-item label="所在省市" prop="provinceId">
        <el-select v-model="teamUpdateForm.provinceId" placeholder="请选择省市" @change="initCitysUpdate" style="width:100%">
          <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所在地区" prop="cityId">
        <el-select v-model="teamUpdateForm.cityId" placeholder="请选择地区" style="width:100%">
          <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="球队口号" prop="teamSlogan">
        <el-input type="textarea" v-model="teamUpdateForm.teamSlogan" placeholder="请输入球队口号" />
      </el-form-item>

      <el-form-item label="球队队徽">
        <el-upload class="upload-demo" accept="image/jpeg,image/jpg,image/png" :auto-upload="false" :file-list="updateImg" ref="upload" action="" :on-change="uploadSectionFile" :on-remove="removeImage" list-type="picture">
          <el-button size="small" type="primary" v-show="isUploadShowHide">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" v-show="isUploadShowHide" style="margin-top: -40px;idth: 300px;margin-left: 100px;text-align: left;color: red;">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogUpdate">取消</el-button>
      <el-button type="primary" @click.native="handleSubmitUpdate" :loading="formLoading">提交</el-button>
    </div>
  </el-dialog>

</section>
</template>

<script>
//form验证规则
const rules = {
  name: [{
      required: true,
      message: '请输入球队名称',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 20,
      message: '长度在 1 到 20 个字符',
      trigger: 'blur'
    }
  ],
  teamSlogan: [{
      required: true,
      message: '请输入球队口号',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 20,
      message: '长度在 1 到 20 个字符',
      trigger: 'blur'
    }
  ],
  provinceId: [{
    required: true,
    message: '请选择省市',
    trigger: 'change'
  }],
  cityId: [{
    required: true,
    message: '请选择地区',
    trigger: 'change'
  }]
}

//初始化数据
let data = () => {
  return {
    //url前缀
    url_prefix:'',
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
    teamAddForm: {
      name: '',
      teamSlogan: '',
      provinceId: '',
      cityId: ''
    },
    //修改from表单数据
    teamUpdateForm: {
      id: '',
      name: '',
      teamSlogan: '',
      provinceId: '',
      cityId: ''
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
    //省的option
    provinceOptions: [],
    //市的option
    cityOptions: [],
    //省设置选中的值
    provinceId: '',
    //市设置选中的值
    cityId: '',
    //所有省市list
    allPlace: [],
    //球队队徽图片
    teamImage: '',
    //上传的图片
    uploadFile: '',
    //上传按钮是否隐藏显示
    isUploadShowHide: true,
    //修改时如果有图片就设置显示
    updateImg: [],
    currentPlayerType:'',
    currentPlayerIsJoin:''
  }
}


//点击查询按钮
let handleQuery = function() {
  this.page = 1
  this.getRows()
}

//点击重置按钮
let handleReset = function() {
  this.filters.name = '';
  this.page = 1
  this.getRows()
}

//点击添加按钮
let handleAdd = function() {
  this.form = {}
  this.formVisibleAdd = true
  this.initProvinces()
  // this.cityId = ''
  // this.provinceId = ''
}
//点击修改按钮
let handleEdit = function(index, row) {
  this.teamUpdateForm = Object.assign({}, row)
  this.formVisibleUpdate = true

  this.allPlace = [];
  this.provinceOptions = [];
  this.cityOptions = [];

  if (this.teamUpdateForm.teamImage != null && this.teamUpdateForm.teamImage != '') {
    this.updateImg = [{
      name: this.teamUpdateForm.teamImage,
      url: this.url_prefix + this.teamUpdateForm.teamImage
    }]
    this.isUploadShowHide = false
  } else {
    this.isUploadShowHide = true
  }

  var forUpdateArr = [];
  this.$api.post('/tablePlace/getAll', null, response => {
    if (response.data.code == 0) {
      this.allPlace = response.data.content;
      forUpdateArr = this.allPlace;

      for (var i = 0; i < forUpdateArr.length; i++) {
        if (forUpdateArr[i].parentId == null) {
          this.provinceOptions.push(forUpdateArr[i])
        }
      }
      //this.provinceId = row.provinceId
      for (var index in forUpdateArr) {
        if (row.provinceId == forUpdateArr[index].parentId) {
          this.cityOptions.push(forUpdateArr[index])
        }
      }
      //this.cityId = '';
    } else {

    }

  });


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

    this.$api.post('/tableTeam/delete', params, res => {
      this.$common.recordLogs(encodeURI('删除球队'),'5','web')
      this.pageLoading = false
      if (res.data.code == 0) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        this.$message({
          type: 'error',
          message: '删除失败!'
        })
      }

      this.page = 1
      this.getRows()

    });

  }).catch(e => {})
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

  this.$api.post('/tableTeam/getAllByPage', params, response => {

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

  this.$refs.teamAddForm.validate(valid => {
    if (!valid) {
      return
    }
    this.formLoading = true

    var formData = new FormData;
    formData.append('name', this.teamAddForm.name);
    formData.append('teamSlogan', this.teamAddForm.teamSlogan);
    formData.append('provinceId', this.teamAddForm.provinceId);
    formData.append('cityId', this.teamAddForm.cityId);
    formData.append('file', this.uploadFile);

    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    this.$axios.post('http://localhost:8090/club/tableTeam/insert', formData, config)
      .then((res) => {
        if (res.data.code === 0) {
          this.$common.recordLogs(encodeURI('创建球队'),'3','web')
          this.page = 1
          this.getRows()
          this.formLoading = false
          this.$refs.upload.clearFiles();
          this.formVisibleAdd = false
          this.$message({
            message: '创建成功!',
            type: 'success'
          });
        }
      })
      .catch((res) => {
      })
  })

}
//点击修改提交按钮
let handleSubmitUpdate = function() {
  if (this.formLoading) {
    return
  }

  this.$refs.teamUpdateForm.validate(valid => {
    if (!valid) {
      return
    }

    this.formLoading = true
    this.formVisibleUpdate = false
    var formData = new FormData;
    formData.append('id', this.teamUpdateForm.id);
    formData.append('name', this.teamUpdateForm.name);
    formData.append('teamSlogan', this.teamUpdateForm.teamSlogan);
    formData.append('provinceId', this.teamUpdateForm.provinceId);
    formData.append('cityId', this.teamUpdateForm.cityId);
    formData.append('file', this.uploadFile);

    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };


    this.$axios.post('http://localhost:8090/club/tableTeam/update', formData, config)
      .then((res) => {
        if (res.data.code === 0) {
          this.$common.recordLogs(encodeURI('修改球队'),'4','web')
          this.page = 1
          this.getRows()
          this.formLoading = false
          this.$refs.upload.clearFiles();
          this.$message({
            message: '创建成功!',
            type: 'success'
          });
        }
      })
      .catch((res) => {
      })
  })
}
//初始化省数据
let initProvinces = function() {
  this.allPlace = [];
  this.provinceOptions = [];
  this.$api.post('/tablePlace/getAll', null, response => {
    if (response.data.code == 0) {
      this.allPlace = response.data.content;
      var arr = this.allPlace;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].parentId == null) {
          this.provinceOptions.push(arr[i])
        }
      }
    } else {

    }

  });
}
//初始化市数据（添加）
let initCitysAdd = function(e) {
  //this.cityId = ''
  this.teamAddForm.cityId = ''
  var arr = this.allPlace;
  this.cityOptions = [];
  for (var index in this.allPlace) {
    if (e == this.allPlace[index].parentId) {
      this.cityOptions.push(this.allPlace[index])
    }
  }
}
//初始化市数据（修改）
let initCitysUpdate = function(e) {
  //this.cityId = ''
  this.teamUpdateForm.cityId = ''
  var arr = this.allPlace;
  this.cityOptions = [];
  for (var index in this.allPlace) {
    if (e == this.allPlace[index].parentId) {
      this.cityOptions.push(this.allPlace[index])
    }
  }
}

//关闭对话框时的操作（添加）
let closeDialogAdd = function() {
  this.formVisibleAdd = false;
  this.$refs.teamAddForm.resetFields()
  this.cityOptions = [];
  this.provinceOptions = [];
  this.$refs.upload.clearFiles();
  this.isUploadShowHide = true
}
//关闭对话框时的操作（修改）
let closeDialogUpdate = function() {
  this.formVisibleUpdate = false;
  this.$refs.teamUpdateForm.resetFields()
  this.cityOptions = [];
  this.provinceOptions = [];
  this.$refs.upload.clearFiles();
  this.isUploadShowHide = true
}

//上传图片判断格式和大小
let uploadSectionFile = function(param) {

  this.uploadFile = param.raw;
  if (param != null) {
    this.isUploadShowHide = false
  }

  // this.teamImage = param.target.files[0];
  // if (this.teamImage.size < 1100000) {
  //
  //   var fileName = this.teamImage.name
  //   var suffix = fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase()
  //   if (suffix == "BMP" || suffix == "JPG" || suffix == "JPEG" || suffix == "PNG" || suffix == "GIF") {
  //
  //   }
  // }

}
//删除图片
let removeImage = function(param) {
  this.isUploadShowHide = true
  this.uploadFile = ''

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
    //初始化省下拉框
    initProvinces,
    //初始化市下拉框（添加）
    initCitysAdd,
    //初始化市下拉框（修改）
    initCitysUpdate,
    //上传图片判断格式和大小
    uploadSectionFile,
    //删除图片
    removeImage
  },
  mounted: function() {
    //监听屏幕改变
    window.addEventListener('resize', this.initHeight)
    //获取屏幕高度
    this.initHeight()
    //获取table数据
    this.getRows()
    this.url_prefix = this.GLOBAL.httpRequestUrl
    this.currentPlayerType = this.GLOBAL.currentPlayerType
    this.currentPlayerIsJoin = this.GLOBAL.currentPlayerIsJoin
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
