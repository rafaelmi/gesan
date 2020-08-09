const API = '/internaciones/indicaciones/nuevo'

const state = () => ({
})

const getters = {
}

const mutations = {
}

const actions = {
  send ({ dispatch, state }, props) {
    return dispatch('send', Object.assign(props, { url: API }), { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
