<template>
  <c-tabs :tabs="tabs"/>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// const namespace = 'reportes'

export default {
  components: {
    'c-tabs' () { return import('@/components/TabsV2.vue') }
  },

  data: () => ({
  }),

  computed: {
    tabs () {
      const res = []
      const reportes = this.views.reportes
      if (reportes) {
        // reportes.medicos && res.push({ title: 'MÉDICOS', to: '/reportes/medicos' })
        // reportes.ficha && res.push({ title: 'FICHA', to: '/reportes/ficha' })
        reportes.consultas && res.push({ title: 'CONSULTAS', to: '/reportes/consultas' })
        reportes.urgencias && res.push({ title: 'URGENCIAS', to: '/reportes/urgencias' })
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
