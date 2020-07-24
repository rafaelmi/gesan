<template>
  <c-turnos/>
</template>

<script>
export default {

  components: {
    'c-turnos': () => import('@/components/consultas/Turnos.vue')
  },

  data: () => ({
  }),

  computed: {
  },

  methods: {
  }
}
</script>
