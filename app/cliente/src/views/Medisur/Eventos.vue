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
      // apiUrl: '/seguro/visaciones',
      headers: [
        { value: '_id', text: 'Ingreso No.', type: 'id', creable: false },
        { value: 'contrato', text: 'Contrato', type: 'id', required: true },
        { value: 'cedula', text: 'Cédula del Paciente', type: 'cedula', required: true },
        { value: 'fecha', text: 'Fecha', type: 'fecha', creable: false },
        { value: 'servicio', text: 'Servicio', type: 'text', required: true },
        { value: 'cobertura', text: 'Cobertura', type: 'dinero', required: true }
      ],
      items: [],
      newTitle: 'Nueva Visación',
      editTitle: 'Detalles Visación',
      sortBy: 'contrato',
      creable: false,
      editable: false,
      borrable: false
    }
  }),

  methods: {
  }
}
</script>
