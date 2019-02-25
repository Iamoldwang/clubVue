<template>
<!--背景图-->

<div class="note" :style="note">
  <!--login框，表单+tab标签页的组合-->
  <div class="loginFrame">
    <el-form ref="loginForm" :model="account" :rules="rules" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <div class="titleSty">
        哇咔传奇足球管理平台V1.0
      </div>

      <el-form-item prop="username">
        <el-input type="text" v-model="account.username" auto-complete="off" placeholder="请输入您的账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="account.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-row>
          <el-col :span="8">
            <el-button type="primary" style="width: 95%;float: left;" @click.native.prevent="handleLogin" :loading="logining">登录</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" style="width:95%;" @click.native.prevent="handleRegister" :loading="logining">注册</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" style="width:95%;float: right;" @click.native.prevent="handleForget" :loading="logining">忘记密码</el-button>
          </el-col>
        </el-row>

      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
let handleRegister = function(){

}

let handleForget = function(){

}
export default {
  name: 'login',
  data() {
    return {
      logining: false,
      note: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        backgroundImage: "url(" + require("../assets/img/bg.jpg") + ")",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",


      },
      account: {
        username: '',
        password: '',
      },
      rules: {
        username: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          //{ validator: validaePass }
        ],
        password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          //{ validator: validaePass2 }
        ]
      },
      activeName:'first'

    };

  },
  methods: {
    handleRegister,
    handleForget,
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {

          this.logining = true;

          var loginParams = {
            username: this.account.username,
            password: md5(this.account.password)
          };

          this.$api.post(this.GLOBAL.httpRequestUrl + '/tablePlayer/login', loginParams, response => {
            this.logining = false;
            if (response.data.code == 0) {
              //登录成功，把用户信息保存在sessionStorage中
              this.$common.recordLogs(encodeURI('系统登陆'),'1','web')
              sessionStorage.setItem('token', response.data.content);
              //跳转到后台主界面
              this.$router.push({
                path: '/home'
              });

            } else {
              this.$message({
                message: response.data.message,
                type: 'error'
              });
            }

          });

        } else {
          return false;
        }
      });
    }

  }
}
</script>

<style scoped>
.login-container {
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 250px auto;
  margin-bottom: 0px;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

}
.titleSty{
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}
</style>
