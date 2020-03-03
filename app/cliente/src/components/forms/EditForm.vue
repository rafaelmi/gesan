<template>
  <cmpForm v-bind="formProps" :success="$emit('success')">
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
    buttonTitle: {
      type: String,
      default: 'NUEVO'
    },
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
  }
}
</script>
