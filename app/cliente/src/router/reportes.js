export default [
  {
    path: '/reportes',
    beforeEnter: (to, from, next) => {
      next('/reportes/consultas')
    }
  },
  {
    path: '/reportes',
    component: () => import('../views/Reportes/Index.vue'),
    children: [
      {
        path: 'medicos',
        component: () => import('../views/Reportes/Medicos.vue')
      },
      {
        path: 'ficha',
        beforeEnter: (to, from, next) => {
          next('ficha/null')
        }
      },
      {
        path: 'ficha/:userid',
        component: () => import('../views/Reportes/Ficha.vue')
      },
      {
        path: 'consultas',
        component: () => import('../views/Reportes/Consultas.vue')
      },
      {
        path: 'urgencias',
        component: () => import('../views/Reportes/Urgencias.vue')
      }
    ]
  }
]
