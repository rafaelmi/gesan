import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Medisur from '../views/Medisur'
import historial from './historial'
import urgencias from './urgencias'
import citas from './citas'
import reportes from './reportes'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/init',
    name: 'Init',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout'
  },
  {
    path: '/medisur',
    name: 'Medisur',
    component: Medisur.Index,
    children: [
      {
        path: 'contratos',
        name: 'Contratos',
        component: Medisur.Contratos
      },
      {
        path: 'contrato/:contrato',
        name: 'Contrato',
        component: Medisur.Contrato
      },
      {
        path: 'asegurados',
        name: 'Asegurados',
        component: Medisur.Asegurados
      },
      {
        path: 'pagos',
        name: 'Pagos',
        component: Medisur.Pagos
      },
      {
        path: 'eventos',
        name: 'Eventos',
        component: Medisur.Eventos
      },
      {
        path: 'planes',
        name: 'Planes',
        component: Medisur.Planes
      }
    ]
  },

  ...urgencias,
  ...citas,
  ...historial,
  ...reportes
]

const router = new VueRouter({
  routes
})

export default router
