import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/include/api'
import consultas from './modules/consultas'

Vue.use(Vuex)

const API = {
  USER: '/user'
}

export default new Vuex.Store({
  state: {
    started: false,
    logged: false,
    established: false,
    user: null,
    socket: null,
    nextRoute: '/home',
    defaultState: {}
  },

  getters: {
  },

  mutations: {
    start (state) {
      state.defaultState = Object.assign({}, state)
      state.socket = this._vm.$socket
      state.started = true
    },
    login (state, user) {
      state.user = Object.assign({}, user)
      state.logged = true
    },
    establish (state) {
      state.established = true
    },
    exit (state) {
      Object.assign(state, state.defaultState, { defaultState: state.defaultState })
    },
    setNextRoute (state, route) {
      state.nextRoute = route
    },
    message (state, messages) {
      messages.forEach((data) => {
        // state.chats[data.curso].push(data.message)
      })
    }
  },

  actions: {
    start ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.started) resolve()
        else {
          /*
          const socket = this._vm.$socket
          socket.open()
            .on('connect', () => {
              commit('setSocket', socket)
              api.command({
                url: API.USER,
                command: 'setSocket',
                args: { socketId: socket.id }
              })
                .then((result) => {
                  if (result.result === 200) {
                  }
                })
            })
          */
          api.command({
            url: API.USER,
            command: 'info',
            args: {}
          })
            .then((result) => {
              commit('start')
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
        dispatch('consultas/setup', { socket: state.socket, sid: state.user.sid })
          .then(() => {
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
                resolve()
              } else {
                reject(new Error(result.details))
              }
            })
        } catch (error) {
          reject(new Error('Error Interno'))
        }
      })
    },

    send ({ state }, props) {
      return new Promise((resolve, reject) => {
        api.command(props)
          .then((result) => {
            if (result.result < 400) {
              resolve(result)
            } else {
              reject(new Error(result.title + ': ' + result.details))
            }
          })
          .catch(() => {
            reject(new Error('Error Interno'))
          })
      })
    },

    SOCKET_consultas ({ commit, dispatch }, data) {
      dispatch('consultas/update', data)
    }
  },

  modules: {
    consultas
  }
})
