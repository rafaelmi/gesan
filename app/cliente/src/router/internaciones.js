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
      }
    ]
  }
]
