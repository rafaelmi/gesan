const API = '/internaciones/historia'

const state = () => ({
})

const getters = {
  salas: (state, getters, rootState, rootGetters) => {
    return rootGetters['internaciones/salas'] || []
  },

  permisos: (state, getters, rootState, rootGetters) => {
    return rootGetters['internaciones/permisos']
  }
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
