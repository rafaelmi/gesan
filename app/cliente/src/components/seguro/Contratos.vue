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
      apiUrl: '/seguro/contratos',
      headers: [
        { value: '_id', text: 'Contrato', type: 'id', editable: false },
        { value: 'nombre', text: 'Titular', type: 'nombre', required: true },
        { value: 'cedula', text: 'Cédula', type: 'cedula', required: true },
        {
          value: 'plan',
          text: 'Plan',
          type: 'select',
          options: ['FAMILIAR', 'GOLD', 'PLATINUM', 'TERCERA EDAD'],
          required: true
        },
        { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker' },
        { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone' },
        { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city' },
        { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant' }
      ],
      items: [],
      newTitle: 'Nuevo Contrato',
      sortBy: '_id'
    }
  }),

  computed: {
  },

  methods: {
  }
}
</script>
