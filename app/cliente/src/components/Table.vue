<template>
  <v-data-table
    :headers="cHeaders"
    :items="cItems"
    :sort-by="sortBy"
    :sort-desc="sortDesc"
    class="elevation-1"
    items-per-page=8
    :footer-props="{
      'items-per-page-options': [8, 8],
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
        <slot name="top"/>
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
    <template v-slot:item.link="{ item }">
      <v-btn text :href="item.link" color="primary">VER</v-btn>
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
    namespace: String,
    modulo: String,
    headers: Array,
    externalItems: Array,
    apiUrl: String,
    newTitle: String,
    editTitle: String,
    sortBy: String,
    sortDesc: {
      type: Boolean,
      default: false
    },
    creable: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    borrable: {
      type: Boolean,
      default: true
    },
    onClickRow: Function
  },

  data: () => ({
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    internalItems: [],
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
    cHeaders () {
      return this.headers.filter(header => header.inTable !== false)
    },

    items: {
      get () {
        return this.externalItems || this.internalItems
      },
      set (val) {
        this.internalItems = val
      }
    },

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
          itemValues: this.editedItem,
          namespace: this.namespace,
          modulo: this.modulo,
          api: {
            url: this.apiUrl,
            command: 'update'
          }
        } : {
          swCreateButton: this.creable,
          title: this.newTitle,
          fields: this.fields,
          /* itemValues: Object.assign({},
            Object.fromEntries(this.fields.reduce(
              (acc, cur) => [...acc, ...cur.default ? [[cur.value, cur.default]] : []], []
            ))), */
          namespace: this.namespace,
          modulo: this.modulo,
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
      if (this.apiUrl) {
        this.apiCommand({
          url: this.apiUrl,
          command: 'getAll',
          args: {}
        })
          .then((result) => {
            if (result.result === 200) {
              this.items = result.data
              this.items.map(item => { // NO LE VEO SENTIDO, A BORRAR?
                return item
              })
            } else {
            }
          })
      }
    },

    editItem (item) {
      if (this.onClickRow) {
        this.onClickRow(item)
      } else {
        this.editedItem = Object.assign({}, this.items[item.__index])
        this.formType = 'editar'
        this.swForm = true
      }
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
          case 'fecha':
            res[key] = this.toTimestamp(item[key])
            break
          case 'onlyFecha':
            res[key] = this.toDate(item[key])
            break
          case 'nombre':
          case 'direccion':
          case 'ciudad':
          case 'departamento':
          case 'text':
            if (item[key] !== undefined) {
              res[key] = item[key].toUpperCase()
            }
            break
          default:
        }
      })
      return res
    }
  }
}
</script>
