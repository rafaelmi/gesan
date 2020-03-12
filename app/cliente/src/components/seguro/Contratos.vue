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
        { value: '_id', text: 'Contrato', type: 'id', creable: false, editable: false },
        { value: 'nombre', text: 'Titular', type: 'nombre', required: true, editable: false },
        { value: 'cedula', text: 'Cédula', type: 'cedula', required: true, editable: false },
        {
          value: 'plan',
          text: 'Plan',
          type: 'select',
          options: ['FAMILIAR', 'GOLD', 'PLATINUM', 'TERCERA EDAD'],
          required: true,
          editable: false
        },
        { value: 'fechaInicio', text: 'Fecha de Inicio', type: 'fecha', required: true, editable: false, inTable: false },
        { value: 'cuota', text: 'Cuota Mensual', type: 'dinero', creable: false, editable: false },
        { value: 'disponible', text: 'Disponible', type: 'dinero', creable: false, editable: false },
        { value: 'mora', text: 'Meses de Mora', type: 'number', creable: false, editable: false },
        { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker', inTable: false },
        { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone', inTable: false },
        { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city', inTable: false },
        { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant', inTable: false }
      ],
      items: [],
      newTitle: 'Nuevo Contrato',
      editTitle: 'Detalles Contrato',
      sortBy: '_id'
    }
  }),

  computed: {
  },

  methods: {
  }
}
</script>
