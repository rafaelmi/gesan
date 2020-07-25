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
          'master',
          'admin',
          'supervisor'
        ].find(el2 => el2 === el)).length
      ) {
        // res.push({ title: 'MÉDICOS', to: '/reportes/medicos' })
        // res.push({ title: 'FICHA', to: '/reportes/ficha' })
        res.push({ title: 'CONSULTAS', to: '/reportes/consultas' })
        res.push({ title: 'URGENCIAS', to: '/reportes/urgencias' })
      }
      return res
    },

    ...mapState([
      'user'
    ])

  }
}
</script>
