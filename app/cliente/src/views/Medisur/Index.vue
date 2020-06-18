<template>
  <cTabs :tabs="tabs"/>
</template>

<script>

export default {
  components: {
    cTabs () { return import('@/components/Tabs.vue') }
  },

  data: () => ({
    tabs: [
      { title: 'CONTRATOS', to: '/medisur/contratos' },
      { title: 'ASEGURADOS', to: '/medisur/asegurados' },
      // { title: 'EVENTOS', to: '/medisur/eventos' },
      { title: 'PAGOS', to: '/medisur/pagos' },
      { title: 'PLANES', to: '/medisur/planes' }
    ]
  })
}
</script>
