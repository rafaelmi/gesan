<template>
  <cmpForm v-if="value"
    v-bind="formProps"
    @success="success"
  >
  </cmpForm>
</template>

<script>
export default {
  components: {
    cmpForm () { return import('@/components/forms/Form.vue') }
  },

  mixins: [
  ],

  props: {
    value: Boolean,
    title: String,
    fields: Array,
    api: Object
  },

  data: () => ({
  }),

  computed: {
    cFields () {
      return this.fields.map(item => {
        return item
      })
    },
    formProps () {
      return {
        title: this.title,
        fields: this.cFields,
        api: Object.assign({ command: 'update' }, this.api)
      }
    }
  },

  methods: {
    success () {
      this.$emit('input', false)
      this.$emit('success')
    }
  }
}
</script>
