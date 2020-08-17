<template>
  <v-textarea
    class="mx-auto px-4"
    v-model="editedValue"
    :disabled="sending"
    :loading="sending"
    :error-messages="error"
    :label="label"
    :append-outer-icon="!blurred && editedValue.length && 'mdi-send'"
    :rows="rows"
    clearable
    auto-grow
    outlined
    @click:append-outer="create"
    @blur="blur"
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
    value: {
      type: String,
      default: ''
    },
    blurred: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    internalValue: null,
    sending: false,
    error: null
  }),

  computed: {
    editedValue: {
      get () {
        return this.internalValue || this.value || ''
      },
      set (val) {
        this.internalValue = val
      }
    }
  },

  methods: {
    blur () {
      if (this.blurred && this.value !== this.editedValue) this.create()
    },

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
          this.internalValue = null
          this.$store.commit('success')
        }).catch(() => {
          this.sending = false
        })
      }
    }
  }
}
</script>
