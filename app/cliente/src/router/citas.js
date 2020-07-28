import Index from '../views/Citas/Index.vue'
import Consulta from '../views/Citas/Consulta.vue'
import Turnos from '../views/Citas/Turnos.vue'
import Consultorio from '../views/Citas/Consultorio.vue'
import Pantalla from '../views/Citas/Pantalla.vue'

export default [
  {
    path: '/citas/pantalla',
    name: 'Pantalla',
    component: Pantalla
  },
  {
    path: '/citas',
    name: 'Citas',
    component: Index,
    children: [
      {
        path: 'turnos',
        name: 'Turnos',
        component: Turnos
      },
      {
        path: 'turnos/:accion/:arg',
        component: Turnos
      },
      {
        path: 'consulta/:consulta',
        name: 'Consulta',
        component: Consulta
      },
      /*
      {
        path: 'consultorio/:consultorio',
        name: 'Consultorio',
        component: Consultorio,
        children: [
          {
            path: 'consulta/:consulta',
            // name: 'innerConsulta',
            component: Consulta
          }
        ]
      },
      */
      {
        path: 'consultorio/:index',
        component: Consultorio
      },
      {
        path: 'consultorio',
        redirect: 'consultorio/0'
      }
    ]
  }
]
