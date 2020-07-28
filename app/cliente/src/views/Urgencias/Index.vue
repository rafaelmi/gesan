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
      const urgencias = this.views.urgencias
      if (urgencias) {
        urgencias.atencion && res.push({ title: 'ATENCIÓN MÉDICA', to: '/urgencias/atencion' })
        urgencias.turnos && res.push({ title: 'RECEPCIÓN', to: '/urgencias/turnos' })
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
