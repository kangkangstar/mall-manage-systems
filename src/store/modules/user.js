
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
    // 【项目中已有的异步路由】和【服务器返回的标记信息】进行对比，最终需要展示的异步路由
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes: [],
    ifchange: false
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
  // vuex存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
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
    // 在通过vuex中的state属性存储路由在sessionStorage中，只是存储了左侧菜单栏展示的信息path地址，但是并没有存进去路由详细信息，比如name，meta值
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要展示所有路由:常量+异步+任意路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // 将计算好的新路由添加到路由器上
    router.addRoutes(state.resultAllRoutes)
    state.ifchange = true // 走到这步代表获取过路由了
  }

}

// 定义函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
// routes[返回的标志：不同的用户应该展示哪些菜单的标记]
// asyncRoutes 所有的异步路由
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
  // 登录业务---后台返回token，做vuex和本地存储
  async login({ commit }, userInfo) {
    // 解构用户名与密码——
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    // 注意：当前登录请求使用mock数据，code等于20000代表成功
    if (result.code === 20000) {
      // 成功提交mutation,vuex存储
      commit('SET_TOKEN', result.data.token)
      // 持久化存储token
      setToken(result.data.token)
      return 'ok'
    } else {
      // 失败
      return Promise.reject(new Error('faile'))
    }
  },
  // 再次登录
  async againlogin({
    commit
  }, hebing) {
    try {
      if (hebing) {
        commit('SET_RESULTASYNCROUTES', constantRoutes.concat(asyncRoutes))
        return hebing
      }
    } catch (err) {
      console.log(err)
    }
  },
  // 获取用户信息——这步是最先触发的，获取用户信息后保存起来
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token)
    if (result.code === 20000) {
      // 获取用户信息：返回的数据包含：用户名name 用户头像 avatar routes[返回的标志：不同的用户应该展示哪些菜单的标记]
      // roles[用户角色信息] buttons[按钮的信息：按钮权限用户的标记]
      const { data } = result
      // vuex存储用户全部的信息
      commit('SET_USERINFO', data)
      // 存储路由信息,带着的数据是当前用户应该展示的所有异步路由信息
      commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
      return 'ok'
    } else {
      // 失败
      return Promise.reject(new Error('faile'))
    }
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

