export default [
  {
    path: '/internaciones',
    component: () => import('../views/Internaciones/Index.vue'),
    children: [
    ]
  },
  {
    path: '/internaciones/sala/:sala',
    redirect: '/internaciones/sala/:sala/paciente',
    component: () => import('../views/Internaciones/Sala/Index.vue'),
    children: [
      {
        path: 'paciente',
        component: () => import('../views/Internaciones/Sala/Paciente/Index.vue')
      },
      {
        path: 'servicios',
        component: () => import('../views/Internaciones/Sala/Servicios.vue')
      },
      {
        path: 'historia',
        component: () => import('../views/Internaciones/Sala/Historia/Index.vue')
      },
      {
        path: 'enfermeria',
        component: () => import('../views/Internaciones/Sala/Enfermeria/Index.vue')
      },
      {
        path: 'evolucion',
        component: () => import('../views/Internaciones/Sala/Evolucion.vue')
      },
      {
        path: 'estudios',
        component: () => import('../views/Internaciones/Sala/Estudios/Index.vue')
      },
      {
        path: 'indicaciones',
        component: () => import('../views/Internaciones/Sala/Indicaciones/Index.vue')
      }
    ]
  }
]
