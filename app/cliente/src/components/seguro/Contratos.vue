<template>
  <cmpTable v-bind="tableProps"/>
</template>

<script>
export default {
  components: {
    cmpTable () {
      return import('@/components/Table.vue')
    }
  },

  data: () => ({
    tableProps: {
      apiUrl: '/seguro/contratos',
      headers: [
        { value: '_id', text: 'Contrato', type: 'String', editable: false },
        { value: 'nombre', text: 'Nombre', type: 'String', icon: 'mdi-account' },
        { value: 'cedula', text: 'Cédula', type: 'String', icon: 'mdi-smart-card' },
        { value: 'plan', text: 'Plan', type: 'String', icon: 'mdi-format-list-checks' },
        { value: 'direccion', text: 'Dirección', type: 'String', icon: 'mdi-map-marker' },
        { value: 'telefono', text: 'Teléfono', type: 'String', icon: 'mdi-phone' },
        { value: 'ciudad', text: 'Ciudad', type: 'String', icon: 'mdi-home-city' },
        { value: 'departamento', text: 'Departamento', type: 'String', icon: 'mdi-city-variant' }
      ],
      items: [],
      newTitle: 'Nuevo Contrato',
      sortBy: '_id'
    },
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    }
  }
}
</script>
