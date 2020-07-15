<template>
  <c-tabs :tabs="tabs"/>
</template>

<script>
import { mapState } from 'vuex'

const namespace = 'facturacion'

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
      ) res.push({ title: 'PRESUPUESTOS', to: '/facturacion/presupuestos' })
      return res
    },

    ...mapState([
      'user'
    ])

  }
}
</script>
