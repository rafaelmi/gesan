import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/include/api'
import urgencias from './modules/urgencias'
import consultas from './modules/consultas'
import internaciones from './modules/internaciones'
import medisur from './modules/medisur'
import historial from './modules/historial'
import reportes from './modules/reportes'
import productos from './modules/productos'

Vue.use(Vuex)

const modules = {
  urgencias,
  consultas,
  internaciones,
  medisur,
  historial,
  reportes,
  productos
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
    },
    title: 'INICIO'
  },

  getters: {
    started: state => state.state !== 'INIT',

    logged: state => state.state !== 'INIT' && state.state !== 'STARTED',

    permisos: state => (state.user && state.user.permisos) || {},

    medicos: (state, getters, rootState) => state.medicos,

    home: (state) => {
      let home
      if (state.user.perfiles.find(el => el === 'consultorio')) {
        home = '/citas/consultorio'
      } else if (state.user.perfiles.find(el => el === 'urgencias')) {
        home = '/urgencias/atencion'
      } else {
        home = '/'
      }
      return home
    },

    views: (state) => {
      const views = {
        urgencias: {},
        citas: {},
        internaciones: {},
        historial: {},
        medisur: {},
        reportes: {}
      }
      state.user && state.user.perfiles.forEach(perfil => {
        switch (perfil) {
          case 'master':
          case 'admin':
          case 'supervisor':
            views.urgencias.atencion = true
            views.urgencias.turnos = true
            views.citas.consultorio = true
            views.citas.turnos = true
            views.internaciones.salas = {
              historia: true,
              servicios: true,
              enfermeria: true,
              evolucion: true,
              estudios: true,
              indicaciones: true
            }
            views.historial.pacientes = true
            views.historial.ficha = true
            views.medisur.contratos = true
            views.medisur.asegurados = true
            views.medisur.pagos = true
            views.medisur.planes = true
            views.reportes.consultas = true
            views.reportes.urgencias = true
            break

          case 'medisur':
            views.medisur.contratos = true
            views.medisur.asegurados = true
            views.medisur.pagos = true
            views.medisur.planes = true
            break

          case 'recepcion':
            views.urgencias.turnos = true
            views.citas.turnos = true
            views.historial.pacientes = true
            views.historial.ficha = true
            views.internaciones.salas = {
              historia: true,
              servicios: true
            }
            break

          case 'ugencias':
            views.urgencias.atencion = true
            views.historial.ficha = true
            break

          case 'consultorio':
            views.citas.consultorio = true
            views.historial.ficha = true
            break

          default:
        }
      })
      Object.entries(views).forEach(([key, val]) => {
        if (!Object.keys(val).length) delete views[key]
      })
      return views
    },

    flags: (state, getters) => {
      const flags = { app: { } }
      state.user && state.user.perfiles.forEach(perfil => {
        switch (perfil) {
          case 'master':
          case 'admin':
          case 'supervisor':
          case 'medisur':
          case 'recepcion':
            flags.app.drawer = true
            break
          default:
        }
        if (
          getters.permisos.user &&
          getters.permisos.user.password &&
          getters.permisos.user.password.update
        ) {
          flags.app.passwordUpdate = true
        }
      })
      return flags
    }
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
          // getters.permisos.medicos && dispatch('send', {
          //  url: '/medicos',
          //  command: 'get'
          // }),
          dispatch('urgencias/setup'),
          dispatch('consultas/setup'),
          dispatch('internaciones/setup'),
          dispatch('medisur/setup'),
          dispatch('historial/setup'),
          dispatch('reportes/setup'),
          dispatch('productos/setup')
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

    sendFile ({ state, commit }, props) {
      return new Promise((resolve, reject) => {
        api.sendFile(props)
          .then((result) => {
            if (result.result < 400) {
              resolve(result)
            } else {
              commit('error', result)
              reject(new Error(result.title + ': ' + result.details))
            }
          })
          .catch(() => {
            reject(new Error('Error Interno'))
          })
      })
    },

    setTitle ({ state }, url) {
      let title
      const path = url.split('/')
      switch (path[1]) {
        case 'urgencias':
        case 'historial':
        case 'medisur':
        case 'reportes':
          title = path[1]
          break

        case 'citas':
          title = 'CONSULTA EXTERNA'
          break

        case 'internaciones':
          title = 'INTERNACIONES'
          if (path[2] === 'sala') title += ' / SALA ' + path[3]
          break

        default:
          title = 'INICIO'
      }
      state.title = title.toUpperCase()
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
