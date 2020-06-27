import Index from '../views/Historial/Index.vue'
import Pacientes from '../views/Historial/Pacientes.vue'
import Ficha from '../views/Historial/Ficha.vue'

export default [
  {
    path: '/historial',
    beforeEnter: (to, from, next) => {
      next('/historial/pacientes')
    }
  },
  {
    path: '/historial',
    component: Index,
    children: [
      {
        path: 'pacientes',
        component: Pacientes
      },
      {
        path: 'ficha',
        component: Ficha
      },
      {
        path: 'ficha/:paciente',
        component: Ficha
      }
    ]
  }
]
