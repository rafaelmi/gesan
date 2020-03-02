<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn color="primary" dark class="mb-2" v-on="on">{{ buttonTitle }}</v-btn>
    </template>
    <v-snackbar v-model="alert.sw" color="success" top>
      <v-icon dark>mdi-check-circle</v-icon>
      <span class="title pl-1" :top="true" v-text="alert.msg"/>
      <v-spacer/>
    </v-snackbar>
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-list>
            <template v-for="(field, i) in cFields">
              <v-list-item v-if="field.editable"
                cols="12"
                :key="i"
              >
                <v-list-item-title>
                  <v-select v-if="field.type === 'select'"
                    :items="field.options"
                    :label="field.text"
                    :prepend-icon="field.icon"
                    :rules="field.rules"
                    v-model="editedItem[field.value]"
                  />
                  <v-text-field v-else
                    :label="field.text"
                    :type="field.type"
                    :prepend-icon="field.icon"
                    :rules="field.rules"
                    :hint="field.hint"
                    v-model="editedItem[field.value]"
                  />
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import mixApi from '@/mixins/api'
import mixUtils from '@/mixins/utils'

export default {
  mixins: [
    mixApi,
    mixUtils
  ],

  props: {
    // sw: Boolean,
    value: Object,
    buttonTitle: {
      type: String,
      default: 'NUEVO'
    },
    title: String,
    fields: Array,
    api: Object
  },

  data: () => ({
    dialog: false,
    valid: false,
    editedItem: {},
    alert: {
      sw: false,
      msg: ''
    }
  }),

  computed: {
    cFields () {
      const extras = {
        id: { icon: '', type: 'text' },
        nombre: { icon: 'mdi-account', type: 'text' },
        cedula: { icon: 'mdi-smart-card', type: 'number' },
        direccion: { icon: 'mdi-map-marker', type: 'text' },
        telefono: { icon: 'mdi-phone', type: 'text' },
        ciudad: { icon: 'mdi-home-city', type: 'text' },
        departamento: { icon: 'mdi-city-variant', type: 'text' },
        select: { icon: 'mdi-format-list-checks', type: 'text' }
      }
      return this.fields.map(item => {
        const extra = extras[item.type]
        item.icon = item.icon || extra.icon
        item.rules = []
        if (item.required) {
          item.rules.push(val => !!val || 'Este campo es obligatorio')
        }
        switch (extra.type) {
          case 'number':
            item.rules.push(val => !/\D/.test(val) || 'Ingrese sólo números')
            item.hint = this.toMilSeparator(this.editedItem[item.value])
            break
          default:
        }
        // v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        return item
      })
    }
  },
  /*
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  */
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
      }
    },

    close () {
      this.dialog = false
    },

    save () {
      if (this.$refs.form.validate()) {
        this.apiCommand(Object.assign(
          {},
          this.api,
          { args: this.editedItem }
        ))
          .then((result) => {
            if (result.result === 200) {
              this.$refs.form.reset()
              this.editedItem = {}
              this.alert.msg = 'Operación exitosa.'
              this.alert.sw = true
              this.$emit('success')
            } else {
              this.error = result
            }
          })
      }
    }
  }
}
</script>
