<template>
  <v-data-table
    :headers="headers"
    :items="cItems"
    :sort-by="sortBy"
    class="elevation-1"
    :footer-props="{
      'disable-items-per-page': true,
      'items-per-page-all-text': 'Todos',
      'items-per-page-text': 'Registros por página'
    }"
    :search="search"
    @click:row="editItem"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <cmpForm v-model="swForm" v-bind="formProps" @success="update"/>
        <v-spacer/>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      <span class="error--text">NO HAY REGISTROS</span>
    </template>
  </v-data-table>
</template>

<script>
import mixApi from '@/mixins/api'
import mixUtils from '@/mixins/utils'

export default {
  components: {
    cmpForm () { return import('@/components/forms/Form.vue') }
  },

  mixins: [
    mixApi,
    mixUtils
  ],

  props: {
    headers: Array,
    apiUrl: String,
    newTitle: String,
    editTitle: String,
    sortBy: String,
    editable: {
      type: Boolean,
      default: true
    },
    borrable: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    items: [],
    search: null,
    swForm: false,
    formType: 'nuevo',
    formatFunctions: {
      cedula: (val) => this.toMilSeparator(val),
      factura: (val) => this.toFacturaId(val),
      dinero: (val) => this.toMoney(val)
    }
  }),

  computed: {
    cItems () {
      const items = []
      this.items.forEach((item, i) => {
        items.push(Object.assign(this.format(item), { __index: i }))
      })
      return items
    },
    fields () {
      return this.headers.map(item => {
        item.disabled = false
        item.hidden = false
        if (this.formType === 'nuevo') {
          if (item.creable !== undefined && !item.creable) {
            item.hidden = true
          }
        } else {
          if (item.editable !== undefined && !item.editable) {
            item.disabled = true
          }
        }
        return item
      })
    },
    formProps () {
      const props = this.formType === 'editar'
        ? {
          swEditButton: this.editable,
          editable: this.editable,
          swRemoveButton: this.borrable,
          title: this.editTitle,
          fields: this.fields,
          editedItem: this.editedItem,
          api: {
            url: this.apiUrl,
            command: 'update'
          }
        } : {
          title: this.newTitle,
          fields: this.fields,
          api: {
            url: this.apiUrl,
            command: 'create'
          }
        }
      return props
    }
  },

  watch: {
    swForm (val) {
      if (!val) { this.formType = 'nuevo' }
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
          if (result.result === 200) {
            this.items = result.data
            this.items.map(item => {
              return item
            })
          } else {
          }
        })
    },

    editItem (item) {
      this.editedItem = Object.assign({}, this.items[item.__index])
      this.formType = 'editar'
      this.swForm = true
    },

    format (item) {
      const res = Object.assign({}, item)
      this.fields.forEach(field => {
        const key = field.value
        switch (field.type) {
          case 'cedula':
            res[key] = this.toMilSeparator(item[key])
            break
          case 'factura':
            res[key] = this.toFacturaId(item[key])
            break
          case 'dinero':
            res[key] = this.toMoney(item[key])
            break
          default:
        }
      })
      return res
    }
  }
}
</script>
