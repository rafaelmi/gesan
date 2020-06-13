import Vue from 'vue'
// import VueCookies from 'vue-cookies'
import VueSocketIO from 'vue-socket.io'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

// Vue.use(VueCookies)
const nsps = [
  '',
  'consultas',
  'medisur'
]
nsps.forEach(nsp => {
  Vue.use(new VueSocketIO({
    debug: true,
    connection: window.location.host + '/' + nsp,
    vuex: {
      store,
      actionPrefix: (nsp.toUpperCase() || 'SOCKET') + '_',
      mutationPrefix: (nsp.toUpperCase() || 'SOCKET') + '_',
      options: {
        useConnectionNamespace: true
      }
    },
    options: {
      // autoConnect: false
    }
  }))
})
/*
Vue.use(new VueSocketIO({
  debug: true,
  connection: window.location.host, // *//* 'https://capensacursos.com', // *//* 'http://192.168.0.3:8080',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
    options: {
      useConnectionNamespace: true
    }
  },
  options: {
    useConnectionNamespace: true
    // autoConnect: false
    // path: '/api/socket.io'
  }
}))
*/

router.beforeEach((to, from, next) => {
  store.dispatch('start').then(() => {
    if (to.meta && to.meta.public) next()
    else {
      if (store.getters.logged) {
        if (to.name === 'Login') next({ name: 'Home' })
        else if (to.name === 'Logout') {
          store.dispatch('logout')
            .then(() => next({ name: 'Init' }))
        } else next()
      } else {
        if (to.name === 'Pantalla') {
          store.dispatch('login', { username: 'pantalla', password: 'd9150fa0' })
            .then(() => next())
        } else if (['Login', 'Init'].indexOf(to.name) >= 0) {
          store.commit('setNextRoute', '/home')
          next()
        } else {
          store.commit('setNextRoute', to.path)
          next({ name: 'Login' })
        }
      }
    }
  })
})

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
