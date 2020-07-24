<template>
  <c-cama :id="id"/>
</template>
<script>

export default {
  components: {
    'c-cama': () => import('./Atencion/Cama/Index.vue')
  },

  data: () => ({
  }),

  computed: {
    id () {
      return this.$route.params.id
    }
  },

  methods: {
  }
}
</script>
