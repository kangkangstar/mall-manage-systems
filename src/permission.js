// 路由配置相关的文件
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
// 定义变量判断是否已经动态添加过，如果刷新后load永远为 0
// let load = 0
// // 全局路由守卫
// router.beforeEach((to, from, next) => {
//   // 4.获取路由菜单
//   const menuTree = store.state.user.resultAsyncRoutes
//   // 非登录、有菜单数据、 没有进行添加（或者刷新了）
//   if (load === 0 && menuTree.length && to.path !== '/login') {
//     load++
//     // 再次调用存储菜单数据(前提是在存储的地方有调用添加路由规则)、或者直接调用动态添加路由规则事件
//     store.dispatch('SET_RESULTASYNCROUTES', menuTree)
//     // 添加后跳转到应访问的地址
//     next({ path: to.fullPath })
//   }
// })
router.beforeEach(async (to, from, next) => {
  // 1.进度条开始
  NProgress.start()
  // 2.设置网页页签名【有默认值】
  document.title = getPageTitle(to.meta.title)
  // 3.获取token
  const hasToken = getToken()
  // 判断token是否存在进行路由拦截
  if (hasToken) {
    // 就不能再去login
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果有name直接放行
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        // 没有就获取到再放行
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // 获取失败就重置token，
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 没有token，白名单的放行，这样后面如果新增其他路径可以直接用白名单解决
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 将想去的路径重定向下
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
