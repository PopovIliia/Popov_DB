//import axios from 'axios'
import jwtDecode from 'jwt-decode'

// initial state
const state = () => ({
  user: {},
  is_auth: false,
})

// getters
const getters = {}

// actions
const actions = {
  async signIn({ commit }, credentials) {
    const resp = await this._vm.$axios.post('/sign_in,',credentials)
    const token =resp.data.token
    this._vm.$axios.default.headers.common['Authorization']=`Bearer ${token}`
    
    const user = jwtDecode(resp.data.token)
    commit('setUser',user)
  },
}

// mutations
const mutations = {
  setUser(state, user) {
    state.user = user
    state.is_auth = true
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

