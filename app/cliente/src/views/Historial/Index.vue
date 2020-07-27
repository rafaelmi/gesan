<template>
  <c-tabs :tabs="tabs"/>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

const namespace = 'historial'

export default {
  components: {
    'c-tabs' () { return import('@/components/TabsV2.vue') }
  },

  data: () => ({
  }),

  computed: {
    tabs () {
      const res = []
      const historial = this.views.historial
      if (historial) {
        historial.pacientes && res.push({ title: 'PACIENTES', to: '/historial/pacientes' })
        historial.ficha && res.push({ title: 'FICHA MÉDICA', to: '/historial/ficha' + (this.paciente ? '/' + this.paciente : '') })
      }
      return res
    },

    ...mapState(namespace, [
      'paciente'
    ]),

    ...mapState([
      'user'
    ]),

    ...mapGetters([
      'views'
    ])
  }
}
</script>
