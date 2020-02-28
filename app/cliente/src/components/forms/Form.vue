<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn color="primary" dark class="mb-2" v-on="on">{{ buttonTitle }}</v-btn>
    </template>
    <v-snackbar v-model="alert.sw" color="success">
      <!--<v-alert
        type="success"
        transition="scale-transition"
      >-->
      <v-icon dark>mdi-check-circle</v-icon>
      <span class="title pl-1" :top="true" v-text="alert.msg"/>
      <v-spacer/>
      <!--</v-alert>-->
    </v-snackbar>
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <!--<v-container>
          <v-col cols="12" v-for="(field, i) in fields" :key="i">
        -->
        <v-list>
          <v-list-item cols="12" v-for="(field, i) in fields" :key="i">
            <v-list-item-icon>
              <v-icon>{{ field.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <v-text-field v-if="field.editable"
                v-model="editedItem[field.value]"
                :label="field.text"
              />
            </v-list-item-title>
          </v-list-item>
        </v-list>
          <!--</v-col>
        </v-container>-->
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

export default {
  mixins: [
    mixApi
  ],

  props: {
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
    editedItem: {},
    alert: {
      sw: false,
      msg: ''
    }
  }),
  /*
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  */
  methods: {
    close () {
      this.dialog = false
    },

    save () {
      this.apiCommand(Object.assign(
        {},
        this.api,
        { args: this.editedItem }
      ))
        .then((result) => {
          if (result.result === 200) {
            this.editedItem = {}
            this.alert.msg = 'Operación exitosa.'
            this.alert.sw = true
            this.$emit('success')
          } else {
            this.error = result
          }
        })
      // this.close()
    }
  }
}
</script>
