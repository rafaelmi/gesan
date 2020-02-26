<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="sortBy"
    class="elevation-1"
    :footer-props="{
      'disable-items-per-page': true,
      'items-per-page-all-text': 'Todos',
      'items-per-page-text': 'Registros por página'
    }"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <cmpForm
          v-model="editedItem"
          :title="newTitle"
          :fields="fields"
        />
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <span class="error--text">NO HAY REGISTROS</span>
    </template>
  </v-data-table>
</template>

<script>
export default {
  components: {
    cmpForm () {
      return import('@/components/forms/Form.vue')
    }
  },

  props: {
    headers: Array,
    items: Array,
    newTitle: String,
    sortBy: String
  },

  data: () => ({
    dialog: false,
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
    },
    fields () {
      return this.headers.map(item => {
        if (item.editable === undefined) {
          item.editable = true
        }
        return item
      })
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
