const API = '/historial'

const state = () => ({
  pacientes: [],
  paciente: null
})

const getters = {
  pacientes: (state, getters, rootState) => state.pacientes.map(el => {
    const paciente = Object.assign({}, el, rootState.personas.find(per => per._id === el._id))
    paciente.cedula = paciente._id
    // delete paciente._id
    delete paciente.fecha
    delete paciente.modificado
    return paciente
  }),

  paciente: (state, getters, rootState) => {
    const paciente = getters.pacientes.find(el => el._id === state.paciente) || {}
    paciente.historial && paciente.historial.sort((el1, el2) => el2.fecha - el1.fecha)
    return paciente
  },

  permisos: (state, getters, rootState, rootGetters) => {
    return rootGetters.permisos.historial || null
  }
}

const mutations = {
  selectPaciente (state, paciente) {
    state.paciente = paciente
  }
}

const actions = {
  setup ({ state, getters, commit, dispatch }, callback) {
    return getters.permisos && new Promise((resolve, reject) => {
      dispatch('send',
        {
          modulo: 'pacientes',
          command: 'get'
        }
      ).then(resolve).catch(reject)
    })
  },

  send ({ dispatch, state }, props) {
    return dispatch('send', Object.assign(props, { url: API }), { root: true })
  },

  selectPaciente ({ commit }, paciente) {
    commit('selectPaciente', parseInt(paciente, 10))
  },

  HISTORIAL_pacientes ({ state, commit, dispatch }, data) {
    state.pacientes = [
      ...data,
      ...state.pacientes.filter(oldel => !data.find(newel => oldel._id === newel._id))
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
