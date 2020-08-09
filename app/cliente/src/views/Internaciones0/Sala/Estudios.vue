<template>
  <c-ficha
   :titulo="titulo"
  >
  </c-ficha>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/historia'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue')
    // 'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'ESTUDIOS REALIZADOS',
    accion: null,
    items: []
  }),

  computed: {
    internacion () {
      return this.sala
    },

    sala () {
      return this.salas[this.$route.params.sala] || null
    },

    disable () {
      return {
        create: this.internacion.estado === 'FINALIZADO'
      }
    },

    ...mapGetters(namespace, [
      'salas'
    ])
  },

  methods: {
    ...mapActions(namespace, [
      'send'
    ])
  }
}

</script>
