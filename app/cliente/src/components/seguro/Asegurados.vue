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
        { value: 'contrato', text: 'Contrato', type: 'id' },
        { value: 'nombre', text: 'Nombre', type: 'nombre', required: true },
        { value: 'cedula', text: 'Cédula', type: 'cedula', required: true },
        { value: 'plan', text: 'Plan', type: 'text', required: false, editable: false },
        { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker' },
        { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone' },
        { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city' },
        { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant' }
      ],
      items: [],
      newTitle: 'Nuevo Asegurado',
      sortBy: 'nombre'
    }
  }),

  methods: {
  }
}
</script>
