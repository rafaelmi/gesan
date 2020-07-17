<template>
  <c-turnos type="urgencias"/>
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
