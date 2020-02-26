<template>
  <cmpTable
    :headers="headers"
    :items="items"
    newTitle="Nuevo Contrato"
    sortBy="contrato"
  />
</template>

<script>
export default {
  components: {
    cmpTable () {
      return import('@/components/Table.vue')
    }
  },

  data: () => ({
    dialog: false,
    headers: [
      { value: 'contrato', text: 'Contrato', type: 'String', editable: false },
      { value: 'nombre', text: 'Nombre', type: 'String' },
      { value: 'cedula', text: 'Cédula', type: 'String' },
      { value: 'plan', text: 'Plan', type: 'String' },
      { value: 'direccion', text: 'Dirección', type: 'String' },
      { value: 'telefono', text: 'Teléfono', type: 'String' },
      { value: 'ciudad', text: 'Ciudad', type: 'String' },
      { value: 'departamento', text: 'Departamento', type: 'String' }
    ],
    items: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
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
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
