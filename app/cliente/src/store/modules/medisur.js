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
  }, [])
}

const mutations = {
  error (state, err) {
    state.error = err
  }
}

const actions = {
  setup ({ state, commit, dispatch }, callback) {
    dispatch('send', Object.assign(
      {
        modulo: 'planes',
        command: 'getAll',
        url: API
      }), { root: true }
    ).then(res => {
      state.planes = res.data
    }).catch(err => {
      commit('error', err)
    })
    return callback(state)
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
