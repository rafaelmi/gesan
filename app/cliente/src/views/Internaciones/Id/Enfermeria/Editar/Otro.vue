<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>OTRO</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-text-field
          label="Parámetro"
          v-model="value"
          @keyup.enter="save"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  components: {
  },

  props: {
    _id: String,
    grupo: String,
    template: Object,
    send: Function,
    error: Function
  },

  data: () => ({
    value: null
  }),

  methods: {
    save () {
      const template = JSON.parse(JSON.stringify(this.template))
      template[this.grupo][this.value] = null
      this.send({
        command: 'update',
        args: {
          _id: this._id,
          template
        }
      }).then(() => {
        this.value = null
      }).catch(() => this.error())
    }
  }
}
</script>
