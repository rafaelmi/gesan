import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Medisur from '../views/Medisur'
const Citas = {
  Index: () => import('../views/Citas/Index.vue'),
  Consulta: () => import('../views/Citas/Consulta.vue'),
  Turnos: () => import('../views/Citas/Turnos.vue'),
  Consultorio: () => import('../views/Citas/Consultorio.vue'),
  Pantalla: () => import('../views/Citas/Pantalla.vue')
}

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
    path: '/citas/pantalla',
    name: 'Pantalla',
    component: Citas.Pantalla
  },
  {
    path: '/citas',
    name: 'Citas',
    component: Citas.Index,
    children: [
      {
        path: 'turnos',
        name: 'Turnos',
        component: Citas.Turnos
      },
      {
        path: 'consulta/:consulta',
        name: 'Consulta',
        component: Citas.Consulta
      },
      {
        path: 'consultorio/:consultorio',
        name: 'Consultorio',
        component: Citas.Consultorio,
        children: [
          {
            path: 'consulta/:consulta',
            name: 'innerConsulta',
            component: Citas.Consulta
          }
        ]
      }
    ]
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
  }
]

const router = new VueRouter({
  routes
})

export default router
