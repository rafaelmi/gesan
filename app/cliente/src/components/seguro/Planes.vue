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
      apiUrl: '/seguro/planes',
      headers: [
        { value: 'nombre', text: 'Plan', type: 'text', icon: 'mdi-format-list-checks', required: true, editable: false },
        { value: 'cuota', text: 'Cuota', type: 'dinero', required: true },
        { value: 'adicional', text: 'Adicional', type: 'dinero', required: true },
        { value: 'cobertura', text: 'Cobertura', type: 'dinero', required: true }
      ],
      items: [],
      newTitle: '',
      editTitle: 'Detalles Planes',
      sortBy: 'factura',
      creable: false,
      editable: false,
      borrable: false
    }
  }),

  methods: {
  }
}
</script>
