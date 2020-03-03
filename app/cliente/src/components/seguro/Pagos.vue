<template>
  <cmpTable v-bind="tableProps"/>
</template>

<script>
export default {
  components: {
    cmpTable () { return import('@/components/Table.vue') }
  },

  data: () => ({
    tableProps: {
      apiUrl: '/seguro/pagos',
      headers: [
        { value: '_id', text: 'Factura No.', type: 'factura', required: true },
        { value: 'contrato', text: 'Contrato', type: 'id', required: true },
        { value: 'fecha', text: 'Fecha', type: 'fecha', required: true },
        { value: 'monto', text: 'Monto', type: 'dinero', required: true }
      ],
      items: [],
      newTitle: 'Nueva Factura',
      sortBy: 'factura'
    }
  }),

  methods: {
  }
}
</script>
