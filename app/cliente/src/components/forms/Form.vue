<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn color="primary" dark class="mb-2" v-on="on">{{ buttonTitle }}</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-col cols="12" v-for="(field, i) in fields" :key="i">
            <v-text-field v-if="field.editable"
              v-model="editedItem[field.value]"
              :label="field.text"
            />
          </v-col>
        </v-container>
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
export default {
  props: {
    value: Object,
    buttonTitle: {
      type: String,
      default: 'NUEVO'
    },
    title: String,
    fields: Array
  },

  data: () => ({
    dialog: false,
    editedItem: {}
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
      this.$emit('input', this.editedItem)
      this.close()
    }
  }
}
</script>
