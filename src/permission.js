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
// 设置flag，防止非权限路由，页面死循环重定向
let flag = 0

router.beforeEach(async (to, from, next) => {
  // 1.进度条开始
  NProgress.start()
  // 2.设置网页页签名【有默认值】
  document.title = getPageTitle(to.meta.title)
  // 在路由跳转前判断是否被添加成功--解决出首页外其他路由浏览器一刷新空白问题
  if (flag === 0 && to.matched.length === 0) {
    flag++
    next({ path: to.path }) // 从哪里来去哪里
  } else if (flag !== 0 && to.matched.length === 0) {
    // next({ path: '/' })
    next(false) // 阻止跳转
  } else {
    next()
  }
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
