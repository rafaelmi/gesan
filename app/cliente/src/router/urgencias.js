import Index from '../views/Urgencias/Index.vue'
import Cama from '../views/Urgencias/Atencion/Cama/Index.vue'
import Turnos from '../views/Urgencias/Turnos.vue'
import Atencion from '../views/Urgencias/Atencion/Index.vue'

export default [
  {
    path: '/urgencias',
    redirect: '/urgencias/atencion'
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
        path: 'turnos/:id',
        component: () => import('../views/Urgencias/Evento.vue')
      },
      {
        path: 'atencion',
        component: Atencion
      },
      {
        path: 'atencion/:cama',
        component: Cama
      }
    ]
  }
]
