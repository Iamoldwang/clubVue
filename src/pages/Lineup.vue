<template>
<section class="mainContant">


  <el-row style="margin-bottom: 20px;">

    <el-col :span="24">
      <el-button type="success" v-on:click="saveLineUp" icon="el-icon-success">保存</el-button>
      <el-button type="warning" v-on:click="resetAllPlayers" icon="el-icon-refresh">重置</el-button>
      <el-button type="blue" v-on:click="html2canvasImage" icon="el-icon-download">下载图片</el-button>
    </el-col>
  </el-row>
<el-scrollbar style="height:100%">
  <el-row>
    <el-col :span="24">

      <div class="bgDiv" ref="imageDiv" v-loading="lineupLoading" element-loading-text="正在保存阵容..." element-loading-background="rgba(0, 0, 0, 0.8)">

        <el-tag type="warning" v-if="this.$route.query.lineUp == 0" class="teamTag-1">(主队)</el-tag>
        <el-tag type="success" v-if="this.$route.query.lineUp == 0" class="teamTag-2">(客队)</el-tag>
        <template v-for="player in players" v-loading="pageLoading">
          <div ref="player" :id="player.playerId" class="drag" @mousedown="moveUp" :style="{backgroundImage: 'url(' + player.image + ')',left:player.left + 'px',top:player.top + 'px'}">
          </div>
          <div class="nameDiv" @mousedown="moveDown" :style="{left:player.left + 'px',top:player.top + 'px'}">{{player.name}}</div>
        </template>

      </div>


    </el-col>
  </el-row>
</el-scrollbar>

</section>
</template>

<script>
let data = () => {
  return {
    //url前缀
    url_prefix: '',
    lineupLoading: false,
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
    players: [],
    canMove: false,
    imageDase64Str:''
  }
}

let initAllPlayers = function(){
  let matchId =  this.$route.query.matchId
  let lineUp = this.$route.query.lineUp
  let params = {
    matchId:matchId
  }
  this.$api.post('/tableMatchDetails/getAllPlayersByMatchId', params, res => {
    if (res.status == 200) {

      var list = res.data.content
      if(list != null && list.length > 0){
        var index_1 = 1;
        var index_2 = 1;
        for(var i = 0; i < list.length; i ++){
          if(lineUp == 0){
            if(list[i].groupType == 1){
              this.players.push({
                playerId : list[i].playerId,
                name : list[i].playerName,
                image : this.url_prefix + list[i].headImage,
                left : index_1*this.GLOBAL.playerLeftSpacing,
                top : this.GLOBAL.playerPageTop
              })
              index_1 ++
            }else if(list[i].groupType == 2){
              this.players.push({
                playerId : list[i].playerId,
                name : list[i].playerName,
                image : this.url_prefix + list[i].headImage,
                left : index_2*this.GLOBAL.playerLeftSpacing,
                top : this.GLOBAL.playerPageTop + 80
              })
              index_2 ++
            }
          }else{
            this.players.push({
              playerId : list[i].playerId,
              name : list[i].playerName,
              image : this.url_prefix + list[i].headImage,
              left : list[i].positionLeft,
              top : list[i].positionTop
            })
          }


        }
      }
    } else {

    }
  });
}

let saveLineUp = function(){
  this.lineupLoading = true
  let playerOffset = [];
  let playerArr = [];
  playerOffset = this.$refs.player;

  let breakFlag = true;
  playerOffset.forEach(item => {
    if(item.offsetTop > 630){
      if(breakFlag == true){
        this.$notify({
          title: '警告',
          message: '还有未移动的球员',
          type: 'warning',
          duration:2000
        });
      }
      breakFlag = false
      return
    }

    playerArr.push({
      playerId : item.id,
      left : item.offsetLeft,
      top : item.offsetTop
    })
  })
  console.log(JSON.stringify(playerArr));
  html2canvas(document.querySelector(".bgDiv"), {
    useCORS: true
  }).then(canvas => {
      var img = canvas.toDataURL("image/jpeg")
      var params = {
        playerArr : JSON.stringify(playerArr),
        matchId:this.$route.query.matchId,
        imageDase64:img
      }

      this.$api.post('/tableMatchDetails/updateAllPlayersPosition', params, response => {
        if (response.data.code == 0) {
          this.$common.recordLogs(encodeURI('阵容编辑'),'4','web')
          this.$message({
            message: '阵容编辑成功!',
            type: 'success'
          });

        } else {
          this.$message({
            message: '阵容编辑失败!',
            type: 'error'
          });
        }
        this.lineupLoading = false
        this.$router.push({
          path: '/match'
        });
      });

  });


}

let resetAllPlayers = function(){
  this.$confirm('此操作将重置所有球员位置, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    var nodesDrag = document.querySelectorAll('.drag')
    var nodesName = document.querySelectorAll('.nameDiv')
    nodesDrag.forEach(item => {
      item.remove()
    })
    nodesName.forEach(item => {
      item.remove()
    })

    this.initAllPlayers()

  }).catch(e => {})
}

let html2canvasImage = function(){
  let playerOffset = [];

  playerOffset = this.$refs.player;

  let breakFlag = true;
  playerOffset.forEach(item => {
    if(item.offsetTop > 630){
      if(breakFlag == true){
        this.$notify({
          title: '警告',
          message: '还有未移动的球员',
          type: 'warning',
          duration:2000
        });

      }
      breakFlag = false
      return
    }

  })

  html2canvas(document.querySelector(".bgDiv"), {
    useCORS: true
  }).then(canvas => {
      var imgUri = canvas.toDataURL("image/jpeg")
      saveFile(imgUri,'lineup.jpeg')
  });

}
var saveFile = function(data, filename){
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.href = data;
  save_link.download = filename;
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false,    false, false, 0, null);
  save_link.dispatchEvent(event);
}

//初始化数据
export default {
  data: data,
  methods: {
    //https://www.imooc.com/article/40094
    moveUp(e) {
      let oDiv = e.target; //获取点击的目标元素
      let gDiv = e.path[1]; //获取点击元素的父级元素

      let positionX = 0
      let positionY = 0

      var imageWidth = this.$refs.imageDiv.offsetWidth;
      var imageHeight = this.GLOBAL.playerPageTop;
      var currentLeft = oDiv.style.left
      var currentTop = oDiv.style.top
      if(currentLeft.indexOf('px') > -1){
        positionX = currentLeft.replace('px','')
      }

      if(currentTop.indexOf('px') > -1){
        positionY = currentTop.replace('px','')
      }

      let disX = e.clientX - positionX;
      let disY = e.clientY - positionY;

      this.canMove = true;
      document.onmousemove = (e) => {
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        if (this.canMove) {
          if(left < 0 || left > (imageWidth - 50)){
            this.$notify({
              title: '警告',
              message: '无法移动到外面',
              type: 'warning',
              duration:2000
            });

            this.canMove = false
            return
          }

          if(top < 0 || top > (imageHeight + 150)){
            this.$notify({
              title: '警告',
              message: '无法移动到外面',
              type: 'warning',
              duration:2000
            });
            this.canMove = false
            return
          }
          oDiv.style.left = left + 'px';
          oDiv.style.top = top + 'px';
          oDiv.nextElementSibling.style.left = left + 'px';
          oDiv.nextElementSibling.style.top = top + 'px';

          positionX = left;
          positionY = top;
        }
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmousedown = null;
        this.canMove = false;
      };
    },
    moveDown(e) {
      let oDiv = e.target; //获取点击的目标元素
      let gDiv = e.path[1]; //获取点击元素的父级元素

      let positionX = 0
      let positionY = 0
      var imageWidth = this.$refs.imageDiv.offsetWidth;
      var imageHeight = this.GLOBAL.playerPageTop;
      var currentLeft = oDiv.style.left
      var currentTop = oDiv.style.top
      if(currentLeft.indexOf('px') > -1){
        positionX = currentLeft.replace('px','')
      }

      if(currentTop.indexOf('px') > -1){
        positionY = currentTop.replace('px','')
      }

      let disX = e.clientX - positionX;
      let disY = e.clientY - positionY;

      this.canMove = true;
      document.onmousemove = (e) => {
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        if (this.canMove) {

          if(left < 0 || left > (imageWidth - 50)){
            this.$notify({
              title: '警告',
              message: '无法移动到外面',
              type: 'warning',
              duration:2000
            });

            this.canMove = false
            return
          }

          if(top < 0 || top > (imageHeight + 150)){
            this.$notify({
              title: '警告',
              message: '无法移动到外面',
              type: 'warning',
              duration:2000
            });
            this.canMove = false
            return
          }

          oDiv.style.left = left + 'px';
          oDiv.style.top = top + 'px';
          oDiv.previousElementSibling.style.left = left + 'px';
          oDiv.previousElementSibling.style.top = top + 'px';
          positionX = left;
          positionY = top;
        }
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmousedown = null;
        this.canMove = false;
      };
    },
    initAllPlayers,
    saveLineUp,
    resetAllPlayers,
    html2canvasImage
  },
  mounted: function() {
    this.url_prefix = this.GLOBAL.httpRequestUrl
    this.initAllPlayers()


  },
  directives: {
    drag(el, bindings) {
      el.onmousedown = function(e) {
        var disx = e.pageX - el.offsetLeft;
        var disy = e.pageY - el.offsetTop;
        document.onmousemove = function(e) {
          el.style.left = e.pageX - disx + 'px';
          el.style.top = e.pageY - disx + 'px';
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null;
        }
      }
    }
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

.bgDiv {
    width: 100%;
    height: 700px;
    background-image: url("../assets/img/football.jpg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;

}
.bottomDiv {
    position: relative;
}

.teamTag-1 {
    position: absolute;
    top:710px;
    left:0px;
    user-select: none;
}
.teamTag-2 {
    position: absolute;
    top:790px;
    left:0px;
    user-select: none;
}

.drag {
    width: 50px;
    height: 50px;
    position: absolute;
    border-radius: 15px;
    // background-image: url("../assets/logo.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.nameDiv {
    width: 50px;
    height: 20px;
    margin-top: 50px;
    position: absolute;
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Chrome/Safari/Opera */
    -khtml-user-select: none;
    /* Konqueror */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
    user-select: none;
    background-color: #e1d92e;
    border-radius: 15px;
    color: #8a8a8a;
}
</style>
