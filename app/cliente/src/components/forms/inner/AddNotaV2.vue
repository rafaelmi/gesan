<template>
  <v-textarea
    class="px-4"
    v-model="editedValue"
    :disabled="sending"
    :loading="sending"
    :error-messages="error"
    :label="label"
    :append-outer-icon="editedValue.length && 'mdi-send'"
    :rows="rows"
    clearable
    auto-grow
    outlined
    @click:append-outer="create"
  />
</template>
<script>
export default {
  props: {
    send: Function,
    _id: String,
    field: String,
    label: {
      type: String,
      default: 'AGREGAR'
    },
    rows: {
      type: String,
      default: '4'
    },
    value: String
  },
  data: () => ({
    editedValue: '',
    sending: false,
    error: null
  }),

  computed: {
  },

  watch: {
    value (val) {
      this.editedValue = val
    }
  },

  methods: {
    create () {
      const args = {
        _id: this._id
      }
      args[this.field] = this.editedValue
      if (this.editedValue.length) {
        this.sending = true
        this.send({
          command: 'create',
          args
        }).then(() => {
          this.sending = false
          // this.editedValue = ''
          this.$store.commit('success')
        }).catch(() => {
          this.sending = false
        })
      }
    }
  }
}
</script>
