const API = '/urgencias'

const state = () => ({
  urgencias: []
})

const getters = {
  camas: (state) => state.urgencias.reduce((acc, cur) => {
    if (cur.estado === 'ACTIVO' || cur.estado === 'OBSERVACION') {
      acc[cur.cama] = cur
    }
    return acc
  }, {}),

  permisos: (state, getters, rootState, rootGetters) => {
    return rootGetters.permisos.urgencias || null
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

  addService ({ dispatch }, { urgencia, servicio }) {
    return dispatch('send', {
      command: 'addService',
      args: {
        _id: urgencia._id,
        servicio: servicio
      }
    })
  },

  finish ({ dispatch, state }, urgencia) {
    dispatch('send', {
      command: 'update',
      args: {
        _id: urgencia._id,
        estado: 'FINALIZADO'
      }
    })
  },

  toObservacion ({ dispatch, state }, urgencia) {
    dispatch('send', {
      command: 'update',
      args: {
        _id: urgencia._id,
        estado: 'OBSERVACION'
      }
    })
  },

  URGENCIAS_update ({ state, commit, dispatch }, data) {
    state.urgencias = [
      ...data,
      ...state.urgencias.filter(oldel => !data.find(newel => oldel._id === newel._id))
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
