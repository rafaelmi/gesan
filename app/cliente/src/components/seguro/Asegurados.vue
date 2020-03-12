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
      apiUrl: '/seguro/asegurados',
      headers: [
        { value: 'contrato', text: 'Contrato', type: 'id', required: true, editable: false },
        { value: 'nombre', text: 'Nombre', type: 'nombre', required: true, editable: false },
        { value: 'cedula', text: 'Cédula', type: 'cedula', required: true, editable: false },
        { value: 'plan', text: 'Plan', type: 'text', icon: 'mdi-format-list-checks', creable: false, editable: false },
        { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker' },
        { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone' },
        { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city' },
        { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant' }
      ],
      items: [],
      newTitle: 'Nuevo Asegurado',
      editTitle: 'Detalles Asegurado',
      sortBy: 'contrato'
    }
  }),

  methods: {
  }
}
</script>
