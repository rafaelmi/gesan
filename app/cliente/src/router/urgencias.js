import Index from '../views/Urgencias/Index.vue'
import Consulta from '../views/Urgencias/Consulta.vue'
import Turnos from '../views/Urgencias/Turnos.vue'
import Consultorio from '../views/Urgencias/Consultorio.vue'

export default [
  {
    path: '/urgencias',
    redirect: '/urgencias/consultorio'
  },
  {
    path: '/urgencias',
    name: 'Urgencias',
    component: Index,
    children: [
      {
        path: 'turnos',
        component: Turnos
      },
      {
        path: 'turnos/:accion/:arg',
        component: Turnos
      },
      {
        path: 'consulta/:consulta',
        component: Consulta
      },
      {
        path: 'consultorio',
        redirect: '/urgencias/consultorio/index'
      },
      {
        path: 'consultorio/:consultorio',
        component: Consultorio,
        children: [
          {
            path: 'consulta/:consulta',
            component: Consulta
          }
        ]
      }
    ]
  }
]
