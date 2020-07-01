<template>
  <v-col cols="12" :sm="sm" class="mb-1 mx-0">
    <v-card elevation="1" height="100%">
      <v-subheader v-text="titulo"/>
      <slot/>
    </v-card>
  </v-col>
</template>
<script>

export default {
  components: {
  },

  mixins: [
  ],

  props: {
    titulo: String,
    sm: {
      type: String,
      default: '6'
    }
  },

  data: () => ({
  }),

  computed: {

  },

  methods: {
  }
}
</script>
