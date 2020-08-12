<template>
  <v-text-field
    class="mx-auto px-4"
    v-model="editedValue"
    :disabled="sending"
    :loading="sending"
    :error-messages="error"
    label="AGREGAR"
    prepend-icon="mdi-plus"
    :append-outer-icon="editedValue.length && 'mdi-send'"
    clearable
    @click:append-outer="create"
    @keyup.enter="create"
  />
</template>
<script>
export default {
  props: {
    send: Function,
    _id: String,
    field: String
  },
  data: () => ({
    editedValue: '',
    sending: false,
    error: null
  }),

  computed: {
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
          this.editedValue = ''
          // this.$store.commit('success')
        }).catch(() => {
          this.sending = false
        })
      }
    }
  }
}
</script>
