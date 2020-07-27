<template>
  <cTabs :tabs="tabs"/>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    cTabs () { return import('@/components/Tabs.vue') }
  },

  data: () => ({
  }),

  computed: {
    tabs () {
      const res = []
      const medisur = this.views.medisur
      if (medisur) {
        medisur.contratos && res.push({ title: 'CONTRATOS', to: '/medisur/contratos' })
        medisur.asegurados && res.push({ title: 'ASEGURADOS', to: '/medisur/asegurados' })
        medisur.pagos && res.push({ title: 'PAGOS', to: '/medisur/pagos' })
        medisur.planes && res.push({ title: 'PLANES', to: '/medisur/planes' })
      }
      return res
    },

    ...mapGetters([
      'views'
    ])
  }
}
</script>
