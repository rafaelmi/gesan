const API = '/productos'

const state = () => ({
  productos: []
})

const getters = {
  permisos: (state, getters, rootState, rootGetters) => {
    return rootGetters.permisos.productos || null
  }
}

const mutations = {
}

const actions = {
  setup ({ state, getters, dispatch }) {
    return getters.permisos && dispatch('send', {
      command: 'get'
    })
  },

  send ({ dispatch, state }, props) {
    return dispatch('send', Object.assign(props, { url: API }), { root: true })
  },

  PRODUCTOS_update ({ state, commit, dispatch }, data) {
    state.productos = [
      ...data,
      ...state.productos.filter(oldel => !data.find(newel => oldel._id === newel._id))
    ]
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
