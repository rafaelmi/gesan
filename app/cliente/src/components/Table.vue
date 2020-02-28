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
        <cmpForm v-bind="newFormProps" @success="update"/>
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
import mixApi from '@/mixins/api'

export default {
  components: {
    cmpForm () {
      return import('@/components/forms/Form.vue')
    }
  },

  mixins: [
    mixApi
  ],

  props: {
    headers: Array,
    apiUrl: String,
    items: Array,
    newTitle: String,
    sortBy: String
  },

  data: () => ({
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    items: []
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
    },
    newFormProps () {
      return {
        title: this.newTitle,
        fields: this.fields,
        api: {
          url: this.apiUrl,
          command: 'create'
        }
      }
    }
  },

  created () {
    this.update()
  },

  methods: {
    update () {
      this.apiCommand({
        url: this.apiUrl,
        command: 'getAll',
        args: {}
      })
        .then((result) => {
          console.log(result)
          if (result.result === 200) {
            this.items = result.data
          } else {
          }
        })
    },

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
