import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/include/api'
import urgencias from './modules/urgencias'
import consultas from './modules/consultas'
import medisur from './modules/medisur'
import historial from './modules/historial'
import reportes from './modules/reportes'

Vue.use(Vuex)

const modules = {
  urgencias,
  consultas,
  medisur,
  historial,
  reportes
}
const nsps = Object.keys(modules)

const API = {
  USER: '/user'
}

export default new Vuex.Store({
  state: {
    state: 'INIT',
    user: null,
    socket: null,
    nextRoute: '/home',
    personas: [],
    medicos: [],
    alert: {
      sw: false,
      title: '',
      details: '',
      color: '',
      icon: ''
    }
  },

  getters: {
    started: state => state.state !== 'INIT',
    logged: state => state.state !== 'INIT' && state.state !== 'STARTED',
    permisos: state => (state.user && state.user.permisos) || {},
    medicos: (state, getters, rootState) => state.medicos
  },

  mutations: {
    start (state) {
      const socket = this._vm.$socket
      state.socket = socket.io.nsps['/']
      nsps.forEach(nsp => { // ### LIMPIEZA ###
        state[nsp].socket = socket.io.nsps['/' + nsp]
      })
      state.state = 'STARTED'
    },

    login (state, user) {
      state.user = Object.assign({}, user)
      state.state = 'LOGGED'
    },

    establish (state) {
      state.state = 'ESTABLISHED'
    },

    exit (state) {
      location.reload()
      /* const defaultState = Object.assign({}, state.defaultState)
      Object.assign(
        state,
        defaultState,
        { defaultState }
      ) */
    },

    setNextRoute (state, route) {
      state.nextRoute = route
    },

    message (state, messages) {
      messages.forEach((data) => {
        // state.chats[data.curso].push(data.message)
      })
    },

    success (state, result) {
      Object.assign(
        state.alert,
        {
          sw: true,
          title: 'Operación exitosa',
          details: '',
          color: 'success',
          icon: 'mdi-check-circle'
        }
      )
    },

    error (state, result) {
      Object.assign(
        state.alert,
        {
          sw: true,
          title: result.title + ':',
          details: result.details,
          color: 'error',
          icon: 'mdi-alert'
        }
      )
    }
  },

  actions: {
    start ({ dispatch, commit, state, getters }) {
      return new Promise((resolve, reject) => {
        if (getters.started) resolve()
        else {
          const nsps = this._vm.$socket.io.nsps
          Object.values(nsps).forEach(socket => {
            if (socket.nsp === '/') {
              socket.on('connect', () => { // info()) // Revisar performance del API y db
                api.command({
                  url: API.USER,
                  command: 'info',
                  args: { sid: socket.id }
                }).then((res) => {
                  if (!getters.started) {
                    setTimeout(function () {
                      commit('start')
                      resolve()
                      if (res.result === 200) {
                        dispatch('setup', res.data)
                      }
                    }, 500) // Timer para estabilizar sockets (revisar conexión de sockets)
                  }
                }).catch(reject)
              })
            }
            socket.open()
          })
        }
      })
    },

    login ({ dispatch, commit, state }, credentials) {
      return new Promise((resolve, reject) => {
        try {
          api.command({
            url: API.USER,
            command: 'login',
            args: Object.assign(
              {},
              credentials,
              { username: credentials.username.toLowerCase() }
            )
          })
            .then((res) => {
              if (res.result === 200) {
                dispatch('setup', res.data)
                  .then(() => resolve())
              } else {
                reject(new Error(res.details))
              }
            })
        } catch (error) {
          reject(new Error('Error Interno'))
        }
      })
    },

    setup ({ commit, state, getters, dispatch }, data) {
      return new Promise((resolve, reject) => {
        commit('login', data)
        setInterval(() => {
          const timeout = setTimeout(function () {
            location.reload()
          }, 10000)
          dispatch('send', {
            url: '/config',
            command: 'keepAlive'
          }).then(() => {
            clearTimeout(timeout)
          })
        }, 1000 * 60 * 5)
        Promise.all([
          dispatch('send', {
            url: '/personas',
            command: 'get'
          }),
          getters.permisos.medicos && dispatch('send', {
            url: '/medicos',
            command: 'get'
          }),
          dispatch('urgencias/setup'),
          dispatch('consultas/setup'),
          dispatch('medisur/setup'),
          dispatch('historial/setup'),
          dispatch('reportes/setup')
        ]).then(() => {
          commit('establish', data)
          resolve()
        })
      })
    },

    logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        try {
          api.command({
            url: API.USER,
            command: 'logout',
            args: {}
          })
            .then((result) => {
              if (result.result === 200) {
                commit('exit')
                // resolve()
              } else {
                reject(new Error(result.details))
              }
            })
        } catch (error) {
          reject(new Error('Error Interno'))
        }
      })
    },

    send ({ state, commit }, props) {
      return new Promise((resolve, reject) => {
        api.command(props)
          .then((result) => {
            if (result.result < 400) {
              resolve(result)
            } else {
              commit('error', result)
              // reject(result)
              reject(new Error(result.title + ': ' + result.details))
            }
          })
          .catch(() => {
            reject(new Error('Error Interno'))
          })
      })
    },

    SOCKET_personas ({ state }, data) {
      state.personas = [
        ...data,
        ...state.personas.filter(oldel => !data.find(newel => oldel._id === newel._id))
      ]
    },

    SOCKET_medicos ({ state }, data) {
      state.medicos = [
        ...data,
        ...state.medicos.filter(oldel => !data.find(newel => oldel._id === newel._id))
      ]
    }
  },

  modules: modules /* {
    consultas,
    seguro
  } */
})
