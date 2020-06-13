<template>
  <cmpTable v-bind="tableProps"/>
</template>

<script>
import { mapGetters } from 'vuex'

const namespace = 'medisur'
// const modulo = 'asegurados'

export default {
  components: {
    cmpTable () { return import('@/components/Table.vue') }
  },

  data: () => ({
    defaultProps: {
      // apiUrl: '/seguro/asegurados',
      headers: [
        { value: 'contrato', text: 'Contrato', type: 'id', required: true, editable: false },
        { value: 'nombre', text: 'Nombre', type: 'nombre', required: true, editable: false },
        { value: 'cedula', text: 'Cédula', type: 'cedula', required: true, editable: false },
        { value: 'plan', text: 'Plan', type: 'text', icon: 'mdi-format-list-checks', creable: false, editable: false },
        { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker', inTable: false },
        { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone', inTable: false },
        { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city', inTable: false },
        { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant', inTable: false }
      ],
      items: [],
      creable: false,
      // editTitle: 'Detalles Asegurado',
      sortBy: 'contrato'
    }
  }),

  computed: {
    tableProps () {
      return Object.assign(
        {},
        this.defaultProps,
        {
          externalItems: this.externalItems,
          onClickRow: (item) => this.$router.push('/medisur/contrato/' + item.contrato)
        }
      )
    },

    ...mapGetters(namespace, {
      externalItems: 'asegurados'
    })
  },

  methods: {
  }
}
</script>
