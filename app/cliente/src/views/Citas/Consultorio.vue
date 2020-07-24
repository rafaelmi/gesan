<template>
  <c-consultorio/>
</template>
<script>
export default {
  components: {
    'c-consultorio': () => import('@/components/consultas/Consultorio.vue')
  },

  data: () => ({
  }),

  computed: {
  },

  methods: {
  }
}
</script>
