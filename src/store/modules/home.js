import requestmock from '@/utils/requestmock'
const state = {
  list: {}
}
const mutations = {
  GETDATA(state, list) {
    state.list = list
  }
}
const actions = {
  // 发请求获取首页的mock数据
  async getData({ commit }) {
    const result = await requestmock.get('/home/list')
    if (result.code === 20000) {
      commit('GETDATA', result.data)
    }
  }
}
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
