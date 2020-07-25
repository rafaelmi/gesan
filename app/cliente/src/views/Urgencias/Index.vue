<template>
  <c-tabs :tabs="tabs"/>
</template>

<script>
import { mapState } from 'vuex'

// const namespace = 'reportes'

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
          'urgencias',
          'master',
          'admin',
          'supervisor'
        ].find(el2 => el2 === el)).length
      ) {
        res.push({ title: 'ATENCIÓN MÉDICA', to: '/urgencias/atencion' })
        res.push({ title: 'RECEPCIÓN', to: '/urgencias/turnos' })
      }
      return res
    },

    ...mapState([
      'user'
    ])

  }
}
</script>
