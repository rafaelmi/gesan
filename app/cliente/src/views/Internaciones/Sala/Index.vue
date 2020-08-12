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
      // const path = this.$route.path
      if (internaciones) {
        if (internaciones.salas) {
          res.push({ title: 'HISTORIA CLÍNICA', to: 'paciente' })
          res.push({ title: 'SERVICIOS', to: 'servicios' })
          // res.push({ title: 'HISTORIA CLÍNICA', to: 'historia' })
          res.push({ title: 'ENFERMERÍA', to: 'enfermeria' })
          res.push({ title: 'EVOLUCIÓN', to: 'evolucion' })
          res.push({ title: 'ESTUDIOS', to: 'estudios' })
          res.push({ title: 'INDICACIONES', to: 'indicaciones' })
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
