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
      { title: 'PACIENTES', to: '/historial/pacientes' },
      { title: 'FICHA MÉDICA', to: '/historial/ficha' },
      { title: 'EVOLUCIÓN', to: '/historial/evolucion' },
      { title: 'INDICACIONES', to: '/historial/indicaciones' },
      { title: 'REGISTRO ENFERMERÍA', to: '/historial/enfermeria' }
    ]
  })
}
</script>
