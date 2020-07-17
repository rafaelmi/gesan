import utils from '@/mixins/utils'

const API = '/reportes'

const state = () => ({
})

const getters = {
  consultas: (state, getters, rootState, rootGetters) => {
    return rootState.consultas.consultas.map(el => {
      return {
        _id: el._id,
        tipo: el.tipo,
        medico: el.medico,
        nombre: el.nombre,
        fechaInicio: utils.methods.toTimestamp(el.fechaInicio),
        fechaFin: utils.methods.toTimestamp(el.fechaFin),
        duracion: Math.round((el.fechaFin - el.fechaInicio) / 1000 / 60)
      }
    })
  },

  permisos: (state, getters, rootState, rootGetters) => {
    return rootGetters.permisos.reportes || null
  }
}

const mutations = {
}

const actions = {
  setup ({ state, getters, commit, dispatch }, callback) {
  },

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
