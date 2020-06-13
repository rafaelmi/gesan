const API = '/consultas'

const state = () => ({
  consultas: []
})

const getters = {
}

const mutations = {
}

const actions = {
  setup ({ state, commit }, callback) {
    return callback(state)
  },

  update ({ state }, data) {
    state.consultas = [
      ...state.consultas.filter(oldel => !data.find(newel => oldel._id === newel._id)),
      ...data
    ]
  },

  send ({ dispatch, state }, props) {
    return dispatch('send', Object.assign(props, { url: API }), { root: true })
  },

  callPaciente ({ dispatch, state }, consulta) {
    dispatch('send', {
      command: 'update',
      args: {
        _id: consulta._id,
        estado: 'CONSULTANDO',
        llamar: true
      }
    })
      .then(() => {
        setTimeout(() => {
          dispatch('send', {
            command: 'update',
            args: {
              _id: consulta._id,
              llamar: false
            }
          })
        }, 10000)
      })
  },

  addService ({ dispatch }, { consulta, servicio }) {
    return dispatch('send', {
      command: 'addService',
      args: {
        _id: consulta._id,
        servicio: servicio
      }
    })
  },

  finishConsulta ({ dispatch, state }, consulta) {
    dispatch('send', {
      command: 'update',
      args: {
        _id: consulta._id,
        estado: 'FINALIZADO'
      }
    })
  },

  nextConsulta ({ state }, { consultorio, router }) {
    const consulta = state.consultas.find(item => {
      return ['EN ESPERA', 'CONSULTANDO'].find(el => item.estado === el) &&
      (item.consultorio === consultorio)
    }) || null
    router.push(
      '/citas/consultorio/' + consultorio + '/consulta/' +
      (consulta ? consulta._id : 'index')
    )
  },

  CONSULTAS_update ({ state, commit, dispatch }, data) {
    state.consultas = [
      ...data,
      ...state.consultas.filter(oldel => !data.find(newel => oldel._id === newel._id))
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
