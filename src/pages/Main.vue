<template>
<section>
  <el-container class="container">
    <!--左边-->
    <el-aside width="200px">
      <el-container>
        <el-header>
          <span class="system-name" @click="$router.push('/home')">
            <el-row>
              <el-col :span="10">
                <img src="../assets/img/waka.png" class="logoImg"/>
              </el-col>
              <el-col :span="14">
                <span>{{systemName}}</span>
              </el-col>

            </el-row>
          </span>
        </el-header>
        <el-main>
          <el-menu :default-active="$route.path" :collapse="collapsed">
            <template v-for="(item,index) in menus">
              <el-submenu :index="index+''" v-if="!item.leaf">
                <template slot="title"><i :class="item.iconCls" style="margin-left: -20px;margin-right: 10px;"></i><span>{{item.name}}</span></template>
            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" @click="$router.push(child.path)"><i :class="child.iconCls" style="margin-left: -20px;margin-right: 10px;"></i>{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls" style="margin-left: -20px;margin-right: 10px;"></i>{{item.children[0].name}}</el-menu-item>
            </template>
          </el-menu>
        </el-main>
      </el-container>
    </el-aside>
    <!--内容-->
    <el-container>
      <!--页眉-->
      <el-header class="header">
        <el-row>
          <el-col :span="20" class="header-title">
            <span class="system-name">{{teamName}}</span>
          </el-col>
          <el-col :span="4">
            <img :src="url_prefix + headImage" class="headImage">
            <span class="el-dropdown-link userinfo-inner">  {{playerName}}</span>
            <span style="margin-left:20px;">|</span>
            <span class="el-dropdown-link userinfo-inner" style="margin-left:20px;" v-on:click="logout">退出</span>
          </el-col>
        </el-row>
      </el-header>
      <!--中间-->
      <el-main class="main">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</section>
</template>

<script>
let data = () => {
  return {
    url_prefix: '',
    collapsed: false,
    systemName: '哇咔传奇',
    playerName: '',
    menus: [],
    teamName: '',
    headImage: ''
  }
}

let initMenu = function() {
  for (let i in this.$router.options.routes) {
    let root = this.$router.options.routes[i]
    if (root.hidden)
      continue
    let children = []
    for (let j in root.children) {
      let item = root.children[j]
      if (item.hidden)
        continue
      children.push(item)
    }

    if (children.length < 1)
      continue

    this.menus.push(root)
    root.children = children
  }
}

let logout = function(){
  this.$confirm('确定退出系统吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.$common.recordLogs(encodeURI('退出登录'),'2','web')
    this.$api.post('/tablePlayer/logout', null, res => {

      if (res.data.code == 0) {

        sessionStorage.setItem('headImage', '');
        sessionStorage.setItem('playerId', '');
        sessionStorage.setItem('playerName', '');
        sessionStorage.setItem('playerType', '');
        sessionStorage.setItem('teamId', '');
        sessionStorage.setItem('teamName', '');
        sessionStorage.setItem('token', '');
        sessionStorage.setItem('isJoin', '');
        this.$message({
          type: 'success',
          message: '退出成功！'
        })

        this.$router.push({
          path: '/login'
        });
      } else {
        this.$message({
          type: 'error',
          message: '退出失败！'
        })
      }

      this.GLOBAL.currentPlayerType = ''

    });

  }).catch(e => {})
}

let initPlayerInfo = function() {
  this.$api.post('/tablePlayer/getPlayerInfo', null, response => {

    if (response.data.code == 0) {
      var vo = response.data.content;
      sessionStorage.setItem('playerId', vo.id);
      sessionStorage.setItem('playerName', vo.name);
      sessionStorage.setItem('teamId', vo.teamId);
      sessionStorage.setItem('teamName', vo.teamName);
      sessionStorage.setItem('headImage', vo.headImage);
      sessionStorage.setItem('playerType', vo.playerType);
      sessionStorage.setItem('isJoin', vo.isJoin);
      this.teamName = vo.teamName
      this.playerName = vo.name
      this.headImage = vo.headImage

      this.GLOBAL.currentPlayerType = vo.playerType
    } else {

    }
  });
}
export default {
  data: data,
  methods: {
    initMenu,
    logout,
    initPlayerInfo
  },
  mounted: function() {
    this.initMenu()
    this.initPlayerInfo()
    this.url_prefix = this.GLOBAL.httpRequestUrl

  }
}
</script>

<style scoped="scoped" lang="scss">
$width: 100%;
$height: 100%;
$background-color: #e1d92e;
$header-color: #fff;
$header-height: 60px;

.container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .el-aside {
        .el-header {
            line-height: $header-height;
            background-color: $background-color;
            color: $header-color;
            text-align: center;
        }
        .el-container {
            height: $height;
            .el-main {
                padding: 0;
            }
        }
    }

    .main {
        width: $width;
        height: $height;
    }

    .menu-button {
        width: 14px;
        cursor: pointer;
    }

    .userinfo-inner {
        cursor: pointer;
        margin-left: 50px;
    }

    .el-menu {
        height: $height;
    }
    .el-main {
        height: $height;
    }
    .header {
        background-color: $background-color;
        color: $header-color;
        text-align: center;
        line-height: $header-height;
        padding: 0;

        .header-title {
            text-align: left;
            span {
                padding: 0 20px;
            }
        }
    }

    .system-name {
        font-size: large;
        font-weight: bold;
        cursor: pointer;
    }
    .headImage {
        width: 30px;
        border-radius: 15px;
        height: 30px;
        position: fixed;
        margin-top: 15px;
    }
    .logoImg{
      width: 50px;
      border-radius: 30px;
      margin-top: 5px;
    }
}
</style>
