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
      const perfiles = this.user.perfiles || []
      const res = []
      if (
        perfiles.filter(el => [
          'recepcion',
          'master',
          'admin',
          'supervisor'
        ].find(el2 => el2 === el)).length
      ) res.push({ title: 'PACIENTES', to: '/historial/pacientes' })
      if (
        perfiles.filter(el => [
          'recepcion',
          'medico',
          'master',
          'admin',
          'supervisor'
        ].find(el2 => el2 === el)).length
      ) res.push({ title: 'FICHA MÉDICA', to: '/historial/ficha' + (this.paciente ? '/' + this.paciente : '') })
      return res
    },
    /*
    tabs () {
      return [
        { title: 'PACIENTES', to: '/historial/pacientes' },
        { title: 'FICHA MÉDICA', to: '/historial/ficha' + (this.paciente ? '/' + this.paciente : '') }
      ]
    },
    */
    ...mapState(namespace, [
      'paciente'
    ]),

    ...mapState([
      'user'
    ])

  }
}
</script>
