<template>
  <c-tabs :tabs="tabs"/>
</template>

<script>
import { mapState } from 'vuex'

const namespace = 'historial'

export default {
  components: {
    'c-tabs' () { return import('@/components/TabsV2.vue') }
  },

  data: () => ({
  }),

  computed: {
    tabs () {
      return [
        { title: 'PACIENTES', to: '/historial/pacientes' },
        { title: 'FICHA MÉDICA', to: '/historial/ficha' + (this.paciente ? '/' + this.paciente : '') }
        /* { title: 'EVOLUCIÓN', to: '/historial/evolucion' },
        { title: 'INDICACIONES', to: '/historial/indicaciones' },
        { title: 'REGISTRO ENFERMERÍA', to: '/historial/enfermeria' } */
      ]
      /*
      ].map(el => {
        if (this.paciente) el.to += '/' + this.paciente
        return el
      })
      */
    },

    ...mapState(namespace, [
      'paciente'
    ])

  }
}
</script>
