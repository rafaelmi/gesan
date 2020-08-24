<template>
  <c-tabs :tabs="tabs"/>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// const namespace = 'internaciones'

export default {
  components: {
    'c-tabs' () { return import('@/components/TabsV2.vue') }
  },

  data: () => ({
  }),

  computed: {
    tabs () {
      const res = []
      const internaciones = this.views.internaciones
      if (internaciones) {
        if (internaciones.salas) {
          internaciones.salas.historia && res.push({ title: 'HISTORIA CLÍNICA', to: 'paciente' })
          internaciones.salas.servicios && res.push({ title: 'SERVICIOS', to: 'servicios' })
          internaciones.salas.enfermeria && res.push({ title: 'ENFERMERÍA', to: 'enfermeria' })
          internaciones.salas.evolucion && res.push({ title: 'EVOLUCIÓN', to: 'evolucion' })
          internaciones.salas.estudios && res.push({ title: 'ESTUDIOS', to: 'estudios' })
          internaciones.salas.indicaciones && res.push({ title: 'INDICACIONES', to: 'indicaciones' })
        }
      }
      return res
    },

    ...mapState([
      'user'
    ]),

    ...mapGetters([
      'views'
    ])
  }
}
</script>
