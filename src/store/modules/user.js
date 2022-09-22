
// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 引入获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
// 引入路由
import router from '@/router'

// 箭头函数
const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 菜单路由权限标记
    routes: [],
    // 按钮权限标记
    buttons: [],
    // 角色信息
    roles: [],
    // 【项目中已有的异步路由】和【服务器返回的标记信息】进行对比，最终需要展示的路由
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes: []
  }
}

// state就是箭头函数的返回值
const state = getDefaultState()

// 唯一修改state的地方
const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    // ES6新增的合并对象合法，会清空state
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户名
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单路由权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色信息
    state.roles = userInfo.roles
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // vuex保存当前用户的异步路由，注意一个用户需要展示完成路由：常量，异步，任意路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要展示所有路由,全部连接后再复制给
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }

}

// 定义函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 两个数组取交集
  // 过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item => {
    // 不等于-1代表有这个元素
    if (routes.indexOf(item.name) !== -1) {
      // 递归,还有二级，三级等路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // 登录业务
  async login({ commit }, userInfo) {
    // 解构用户名与密码
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    // 注意：当前登录请求使用mock数据，code等于20000代表成功
    if (result.code === 20000) {
      // 成功提交mutation,持久化存储token
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      // 失败
      return Promise.reject(new Error('faile'))
    }
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户信息：返回的数据包含：用户名name 用户头像 avatar routes[返回的标志：不同的用户应该展示哪些菜单的标记]
        // roles[用户角色信息] buttons[按钮的信息：按钮权限用户的标记]
        const { data } = response
        // vuex存储用户全部的信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  async logout({ commit, state }) {
    const { token } = state
    const result = await logout(token)
    if (result.code === 20000) {
      removeToken() // 先移除token
      resetRouter() // 重置路由
      commit('RESET_STATE')// 重置state
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }

    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // 先移除token
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 移出token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

