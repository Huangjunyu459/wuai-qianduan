import Vue from 'vue'
import VueRouter from 'vue-router'

// 后台管理路由
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import DelUsers from '../components/user/DelUsers.vue'
import Roles from '../components/roles/Roles.vue'
import DelRoles from '../components/roles/DelRoles.vue'
import Category from '../components/category/Category.vue'
import DelCategory from '../components/category/DelCategory.vue'
import Game from '../components/game/Game.vue'
import GameNoExamine from '../components/game/GameNoExmaine.vue'
import DelGame from '../components/game/DelGame.vue'
import Wallpaper from '../components/wallpaper/Wallpaper.vue'
import WallpaperNoExamine from '../components/wallpaper/WallpaperNoExamine.vue'
import DelWallpaper from '../components/wallpaper/DelWallpaper.vue'
import Article from '../components/article/Article.vue'
import ArticleNoExamine from '../components/article/ArticleNoExamine.vue'
import DelArticle from '../components/article/DelArticle.vue'
import Music from '../components/music/Music.vue'
import MusicNoExamine from '../components/music/MusicNoExamine.vue'
import DelMusic from '../components/music/DelMusic.vue'
import Video from '../components/video/Video.vue'
import VideoNoExamine from '../components/video/VideoNoExamine.vue'
import DelVideo from '../components/video/DelVideo.vue'
import Comment from '../components/comment/Comment.vue'
import CommentNoExamine from '../components/comment/CommentNoExamine.vue'
import DelComment from '../components/comment/DelComment.vue'

// 前端首页路由
import Index from '../components/qiandaun/Index.vue'
import Main from '../components/qiandaun/Main.vue'
import ShowWallpaper from '../components/qiandaun/show/Wallpaper.vue'
import ShowArticle from '../components/qiandaun/show/Article.vue'
import ShowGame from '../components/qiandaun/show/Game.vue'
import ShowMusic from '../components/qiandaun/show/Music.vue'
import ShowVideo from '../components/qiandaun/show/Video.vue'

import MoreWallpaper from '../components/qiandaun/more/MoreWallpaper.vue'
import MoreArticle from '../components/qiandaun/more/MoreArticle.vue'
import MoreGame from '../components/qiandaun/more/MoreGame.vue'
import MoreMusic from '../components/qiandaun/more/MoreMusic.vue'
import MoreVideo from '../components/qiandaun/more/MoreVideo.vue'

import DetailWallpaer from '../components/qiandaun/deltail/WallpaperDetail.vue'
import DetaiArticle from '../components/qiandaun/deltail/ArticleDetail.vue'
import DetailGame from '../components/qiandaun/deltail/GameDetail.vue'
import DetailMusic from '../components/qiandaun/deltail/MusicDetail.vue'
import DetailVideo from '../components/qiandaun/deltail/VideoDetail.vue'

import GameDownload from '../components/qiandaun/show/GameDownload.vue'
import PersonInfo from '../components/qiandaun/show/PersonInfo.vue'
import PersonSetting from '../components/qiandaun/show/PersionSetting.vue'
import Contribution from '../components/qiandaun/show/Contribution.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/admin/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    //  重定向到 welcome 子路由
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/user/findAllUser',
        component: Users
      },
      {
        path: '/user/findIsDelete',
        component: DelUsers
      },
      {
        path: '/roles/findAllRoles',
        component: Roles
      },
      {
        path: '/roles/findIsDelete',
        component: DelRoles
      },
      {
        path: '/category/findAllCategory',
        component: Category
      },
      {
        path: '/category/findIsDelete',
        component: DelCategory
      },
      {
        path: '/game/findAllGameExamine',
        component: Game
      },
      {
        path: '/game/findAllGameNoExamine',
        component: GameNoExamine
      },
      {
        path: '/game/findIsDelete',
        component: DelGame
      },
      {
        path: '/wallpaper/findAllWallpaperExamine',
        component: Wallpaper
      },
      {
        path: '/wallpaper/findAllWallpaperNoExamine',
        component: WallpaperNoExamine
      },
      {
        path: '/wallpaper/findIsDelete',
        component: DelWallpaper
      },
      {
        path: '/article/findAllArticleExamine',
        component: Article
      },
      {
        path: '/article/findAllArticleNoExamine',
        component: ArticleNoExamine
      },
      {
        path: '/article/findIsDelete',
        component: DelArticle
      },
      {
        path: '/music/findAllMusicExamine',
        component: Music
      },
      {
        path: '/music/findAllMusicNoExamine',
        component: MusicNoExamine
      },
      {
        path: '/music/findIsDelete',
        component: DelMusic
      },
      {
        path: '/video/findAllVideoExamine',
        component: Video
      },
      {
        path: '/video/findAllVideoNoExamine',
        component: VideoNoExamine
      },
      {
        path: '/video/findIsDelete',
        component: DelVideo
      },
      {
        path: '/comment/findAllCommentExamine',
        component: Comment
      },
      {
        path: '/comment/findAllCommentNoExamine',
        component: CommentNoExamine
      },
      {
        path: '/comment/findIsDelete',
        component: DelComment
      }
    ]
  },
  {
    path: '/index',
    component: Index,
    //  重定向到主页面
    redirect: '/main',
    children: [
      {
        path: '/main',
        component: Main
      },
      {
        path: '/wallpaper',
        component: ShowWallpaper
      },
      {
        path: '/article',
        component: ShowArticle
      },
      {
        path: '/game',
        component: ShowGame
      },
      {
        path: '/music',
        component: ShowMusic
      },
      {
        path: '/video',
        component: ShowVideo
      },
      {
        path: '/showMoreWallpaper',
        component: MoreWallpaper
      },
      {
        path: '/showMoreArticle',
        component: MoreArticle
      },
      {
        path: '/showMoreGame',
        component: MoreGame
      },
      {
        path: '/showMoreMusic',
        component: MoreMusic
      },
      {
        path: '/showMoreVideo',
        component: MoreVideo
      },
      {
        path: '/showDetailWallpaper',
        component: DetailWallpaer
      },
      {
        path: '/showDetailArticle',
        component: DetaiArticle
      },
      {
        path: '/showDetailGame',
        component: DetailGame
      },
      {
        path: '/showDetailMusic',
        component: DetailMusic
      },
      {
        path: '/showDetailVideo',
        component: DetailVideo
      },
      {
        path: '/gameDownload',
        component: GameDownload
      },
      {
        path: '/personInfo',
        component: PersonInfo
      },
      {
        path: '/personSetting',
        component: PersonSetting
      },
      {
        path: '/contribution',
        component: Contribution
      }
    ]

  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// //  挂在路由导航守卫（先注释）
// router.beforeEach((to, from, next) => {
//   //  to 将要访问的路径
//   //  from 代表从哪个路径跳转过来
//   //  next 是一个函数，表示放行
//   //   next()  放行        next('/login') 强制跳转
//   if (to.path === '/login') return next()
//   //  获取 token
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })

export default router
