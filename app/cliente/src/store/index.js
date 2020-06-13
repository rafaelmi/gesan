import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/include/api'
import consultas from './modules/consultas'
import medisur from './modules/medisur'

Vue.use(Vuex)

const modules = {
  consultas,
  medisur
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
    alert: {
      sw: false,
      title: '',
      details: '',
      color: '',
      icon: ''
    }
    // defaultState: null
  },

  getters: {
    started: state => state.state !== 'INIT',
    logged: state => state.state !== 'INIT' && state.state !== 'STARTED'
  },

  mutations: {
    start (state) {
      // state.defaultState = Object.assign({}, state)
      const socket = this._vm.$socket
      state.socket = socket.io.nsps['/']
      nsps.forEach(nsp => {
        state[nsp].socket = socket.io.nsps['/' + nsp]
        /*
        state[nsp] = Object.assign(
          {},
          state[nsp],
          { socket: socket.io.nsps['/' + nsp] }
        )
        */
      })
      state.state = 'STARTED'
      // state.defaultState = Object.assign({}, state)
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
          api.command({
            url: API.USER,
            command: 'info',
            args: {}
          })
            .then((result) => {
              /*
              const socket = this._vm.$socket
              const callback = (state, nsp) => {
                state.defaultState = Object.assign({}, state)
                state.socket = nsp
                  ? socket.io.nsps[nsp]
                  : socket
                state.state = 'STARTED'
              } */
              commit('start')
              // commit('consultas/start', callback)
              // commit('seguro/start', callback)
              resolve()
              if (result.result === 200) {
                dispatch('setup', result.data)
              }
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
            .then((result) => {
              if (result.result === 200) {
                dispatch('setup', result.data)
                  .then(() => resolve())
              } else {
                reject(new Error(result.details))
              }
            })
        } catch (error) {
          reject(new Error('Error Interno'))
        }
      })
    },

    setup ({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        commit('login', data)
        const sid = state.user.sid
        const callback = (state, commit) => {
          return new Promise((resolve, reject) => {
            // state.socket.open().on('connect', () => {
            //  commit && commit('reload')
            state.socket.emit('subscribe', { sid: sid })
            resolve()
            // })
          })
        }
        Promise.all([
          callback(state),
          dispatch('consultas/setup', callback),
          dispatch('medisur/setup', callback)
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
    }
  },

  modules: modules /* {
    consultas,
    seguro
  } */
})
