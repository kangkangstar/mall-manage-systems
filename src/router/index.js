// 引入 vue | vue-router
import Vue from 'vue'
import Router from 'vue-router'
import list from '@/views/acl/user/list'

// 使用路由插件
Vue.use(Router)

/* 引入最外层骨架的一级路由组件Layout大的框架 */
import Layout from '@/layout'

// 路由的配置：为什么不同用户登录我们的项目，菜单显示都是一样的
// 因为目前的路由是死的，不管是哪个用户，能看见的，操作的都是一样
// 需要把项目中的路由进行拆分

// 常量路由：不管用户什么角色都可以看见的路由，没有权限区分
//  不管什么角色，都能看到登录，首页和404路由
export const constantRoutes = [{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index'),
  // 不在菜单栏展示
  hidden: true
},
{
  path: '/404',
  name: '404',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    // 设置在侧边栏展示的文字
    meta: {
      title: '首页',
      icon: 'dashboard'
    }
  }]
}
]
// 异步路由：不同的用户(角色)，需要过滤筛选出的路由，称为异步路由
export const asyncRoutes = [
  // 用户
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        // component: () => import('@/views/acl/user/list'),
        component: list,
        meta: {
          title: '用户管理'
        }
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理'
        }
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权'
        },
        hidden: true
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理'
        }
      }
    ]
  },
  // 商品
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'trademark',
        name: 'TradeMark',
        component: () => import('@/views/product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        meta: { title: '平台属性管理' }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: { title: 'Spu管理' }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: { title: 'Sku管理' }
      }
    ]
  }
]

// 错误路由：当路径出现错误的时候重定向至404
export const anyRoutes = [
  // 404 页面必须在最后
  { path: '*', name: '404', redirect: '/404', hidden: true }
]

// 重置路由
export function resetRouter() {
  // 生成新的路由
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  // 鼠标滚动行为
  scrollBehavior: () => ({
    y: 0
  }),
  // 注册的路由是死的，没有权限要求，可以访问所有角色，活得路由可以根据不同用户展示不同的菜单
  routes: constantRoutes
})

const router = createRouter()
export default router

