const API = '/medisur'

const state = () => ({
  contratos: [],
  visaciones: [],
  planes: [],
  socket: null,
  error: null,
  defaultState: {}
})

const getters = {
  contratos: (state, getters, rootState) => state.contratos.map(el => {
    const plan = state.planes.find(plan => plan._id === el.plan).nombre
    const titular = Object.assign({}, rootState.personas.find(per => per._id === el.titular))
    titular.cedula = titular._id
    delete titular._id
    delete titular.modificado
    const adherentes = (el.adherentes && el.adherentes.map(adh => {
      const per = Object.assign({}, rootState.personas.find(per => per._id === adh))
      per.cedula = per._id
      delete per._id
      return per
    })) || []
    const cuota = el.cuota + (el.adicional * (adherentes.length - 1))
    return Object.assign({}, el, titular, { plan, adherentes, cuota })
  }),

  asegurados: (state, getters, rootState) => getters.contratos.map(contrato => {
    return contrato.adherentes
      ? contrato.adherentes.map(el => {
        const asegurado = Object.assign({}, rootState.personas.find(per => per._id === el.cedula))
        asegurado.cedula = asegurado._id
        delete asegurado._id
        delete asegurado.modificado
        return Object.assign({}, asegurado, { contrato: contrato._id, plan: contrato.plan })
      })
      : []
  }).reduce((acc, el) => {
    el.forEach(el => acc.push(el))
    return acc
  }, []),

  pagos: (state, getters, rootState) => getters.contratos.map(contrato => {
    return contrato.pagos || []
  }).reduce((acc, el) => {
    el.forEach(el => acc.push(el))
    return acc
  }, []),

  eventos: (state, getters, rootState) => getters.contratos.map(contrato => {
    return contrato.eventos
      ? contrato.eventos.map(el => {
        const adherente = Object.assign({}, rootState.personas.find(per => per._id === el.cedula))
        adherente.cedula = adherente._id
        delete adherente._id
        delete adherente.modificado
        return Object.assign({}, el, adherente)
      })
      : []
  }).reduce((acc, el) => {
    el.forEach(el => acc.push(el))
    return acc
  }, []),

  permisos: (state, getters, rootState, rootGetters) => {
    return rootGetters.permisos.medisur || null
  }
}

const mutations = {
  error (state, err) {
    state.error = err
  }
}

const actions = {
  setup ({ state, getters, commit, dispatch }, callback) {
    return getters.permisos && new Promise((resolve, reject) => {
      Promise.all([
        dispatch('send',
          {
            modulo: 'planes',
            command: 'get'
          }
        ).then(res => {
          state.planes = res.data
        }).catch(err => {
          commit('error', err)
          throw err
        }),
        dispatch('send',
          {
            modulo: 'contratos',
            command: 'get'
          }
        )
      ]).then(resolve).catch(reject)
    })
  },

  send ({ dispatch, state }, props) {
    return dispatch('send', Object.assign(props, { url: API }), { root: true })
  },

  MEDISUR_contratos ({ state, commit, dispatch }, data) {
    state.contratos = [
      ...data,
      ...state.contratos.filter(oldel => !data.find(newel => oldel._id === newel._id))
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
