<template>
  <cmpTable v-bind="tableProps"/>
</template>

<script>
import { mapGetters } from 'vuex'

const namespace = 'reportes'
const modulo = 'medicos'

export default {
  components: {
    cmpTable () { return import('@/components/Table.vue') }
  },

  data: () => ({
  }),

  computed: {
    tableProps () {
      return {
        namespace,
        modulo,
        headers: [
          // { value: 'cedula', text: 'Cédula', type: 'cedula', required: true, editable: false },
          { value: 'nombre', text: 'Nombre', type: 'nombre' },
          { value: 'estado', text: 'Estado', type: 'text' },
          // { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker', inTable: false },
          { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone' }
          // { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city', inTable: false },
          // { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant', inTable: false }
        ],
        externalItems: this.items,
        sortBy: 'nombre',
        onClickRow: (item) => {
          this.$router.push('ficha/' + item._id)
        }
      }
    },

    ...mapGetters({
      items: 'medicos'
    })
  }
}
</script>
