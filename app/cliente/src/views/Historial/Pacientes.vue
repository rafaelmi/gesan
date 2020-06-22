<template>
  <cmpTable v-bind="tableProps"/>
</template>

<script>
import { mapGetters } from 'vuex'

const namespace = 'historial'
// const modulo = 'asegurados'

export default {
  components: {
    cmpTable () { return import('@/components/Table.vue') }
  },

  data: () => ({
  }),

  computed: {
    tableProps () {
      return {
        headers: [
          { value: 'cedula', text: 'Cédula', type: 'cedula', required: true, editable: false },
          { value: 'nombre', text: 'Nombre', type: 'nombre', required: true, editable: false },
          { value: 'nacimiento', text: 'Fecha de Nacimiento', type: 'fecha', required: true, editable: false, inTable: false },
          { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker', inTable: false },
          { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone', inTable: false },
          { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city', inTable: false },
          { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant', inTable: false }
        ],
        items: this.externalItems,
        creable: true,
        sortBy: 'nombre'
        //onClickRow: (item) => this.$router.push('/medisur/contrato/' + item.contrato)
      }
    },

    ...mapGetters(namespace, {
      items: 'pacientes'
    })
  },

  methods: {
  }
}
</script>
