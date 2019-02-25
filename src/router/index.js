import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Main from '@/pages/Main'
import Home from '@/pages/home'
import News from '@/pages/News'
import Team from '@/pages/Team'
import Player from '@/pages/Player'
import Lineup from '@/pages/Lineup'
import Match from '@/pages/Match'
import MatchGroup from '@/pages/MatchGroup'
import MatchDetails from '@/pages/MatchDetails'

import CostDetails from '@/pages/costDetails'
import ApplyDetails from '@/pages/applyDetails'
import MatchNotice from '@/pages/matchNotice'

import AnalysisCost from '@/pages/analysisCost'
import AnalysisMatchs from '@/pages/analysisMatchs'
import AnalysisPlayers from '@/pages/analysisPlayers'

import Log from '@/pages/Log'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/pages/Login'], resolve)

let routes = [{
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Main,
    hidden: true,
    children: [{
      path: '/home',
      component: Home,
      name: '首页'
    }]
  }
]

routes.push({
  path: '/',
  name: '统计分析',
  component: Main,
  iconCls: 'fa fa-bar-chart fa-fw',
  children: [{
    path: '/analysisMatchs',
    component: AnalysisMatchs,
    name: '比赛统计',
    iconCls: 'fa fa-line-chart fa-fw'
  },{
    path: '/analysisPlayers',
    component: AnalysisPlayers,
    name: '球员统计',
    iconCls: 'fa fa-pie-chart fa-fw'
  },{
    path: '/analysisCost',
    component: AnalysisCost,
    name: '费用统计',
    iconCls: 'fa fa-area-chart fa-fw'
  }]
})

routes.push({
  path: '/',
  name: '新闻管理',
  component: Main,
  iconCls: 'fa fa-newspaper-o fa-fw',
  children: [{
    path: '/news',
    component: News,
    name: '新闻管理',
    iconCls: 'fa fa-newspaper-o fa-fw'
  }]
})

routes.push({
  path: '/',
  name: '系统管理',
  component: Main,
  iconCls: 'fa fa-cog fa-fw',
  children: [
    {
      path: '/player',
      component: Player,
      name: '球员管理',
      iconCls: 'fa fa-user-o fa-fw'
    },
    {
      path: '/team',
      component: Team,
      name: '球队管理',
      iconCls: 'fa fa-users fa-fw'
    },
    {
      path: '/matchNotice',
      component: MatchNotice,
      name: '球队公告',
      iconCls: 'fa fa-bullhorn fa-fw'
    },
    {
      path: '/costDetails',
      component: CostDetails,
      name: '费用明细',
      iconCls: 'fa fa-jpy fa-fw'
    },
    {
      path: '/applyDetails',
      component: ApplyDetails,
      name: '申请记录',
      iconCls: 'fa fa-user-plus fa-fw'
    },
    {
      path: '/lineup',
      component: Lineup,
      name: '阵容管理',
      hidden: true
    },
    {
      path: '/match',
      component: Match,
      name: '赛事管理',
      iconCls: 'fa fa-futbol-o fa-fw'
    },
    {
      path: '/log',
      component: Log,
      name: '系统日志',
      iconCls: 'fa fa-file-text-o fa-fw'
    },
    {
      path: '/matchGroup',
      component: MatchGroup,
      name: 'matchGroup',
      hidden: true
    },
    {
      path: '/matchDetails',
      component: MatchDetails,
      name: 'matchDetails',
      hidden: true
    }
  ]
})

const router = new Router({
  //https://www.cnblogs.com/libo0125ok/p/9593741.html
  mode: 'history',
  base: '/club/',
  routes: routes

})


// 访问之前，都检查下是否登录了
router.beforeEach((to, from, next) => {
  //console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('token')
    next()
  } else {
    let token = window.sessionStorage.getItem('token')
    if (!token) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  }
})

export default router
