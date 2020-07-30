const API = '/internaciones'

const state = () => ({
  internaciones: []
})

const getters = {
  salas: (state) => state.internaciones.reduce((acc, cur) => {
    if (cur.estado === 'ACTIVO') {
      acc[cur.sala] = cur
    }
    return acc
  }, {}),

  permisos: (state, getters, rootState, rootGetters) => {
    return rootGetters.permisos.internaciones || null
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

  finish ({ dispatch, state }, { _id }) {
    dispatch('send', {
      command: 'update',
      args: {
        _id,
        estado: 'FINALIZADO'
      }
    })
  },

  INTERNACIONES_update ({ state, commit, dispatch }, data) {
    state.internaciones = [
      ...data,
      ...state.internaciones.filter(oldel => !data.find(newel => oldel._id === newel._id))
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
