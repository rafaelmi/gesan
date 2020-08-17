<template>
  <c-ficha-card :titulo="titulo" sm="8">
  </c-ficha-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/historia'

export default {
  components: {
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
    /*
    // 'c-resumen': () => import('../Resumen.vue'),
    // 'c-add-nota': () => import('@/components/forms/inner/AddNota.vue'),
    'c-nuevo': () => import('./Nuevo.vue')
    */
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'HISTORIA CLÍNICA',
    fields: {
      motivo: { titulo: 'MOTIVO DE CONSULTA', rows: 3 },
      aea: { titulo: 'A.E.A.' },
      efisico: { titulo: 'EXAMEN FÍSICO', type: 'textarea' },
      dxpresuntivo: { titulo: 'Dx. PRESUNTIVO', type: 'textarea', rows: 3 },
      tratamiento: { titulo: 'TRATAMIENTO', type: 'textarea', rows: 3 },
      observaciones: { titulo: 'OBSERVACIONES', type: 'textarea' }
    }
  }),

  computed: {
    internacion () {
      return this.sala
    },

    historia () {
      return this.internacion.historia || {}
    },

    last () {
      return this.historia.last || {}
    },

    sala () {
      return this.salas[this.$route.params.sala] || null
    },

    disable () {
      return {
        create: this.internacion.estado === 'FINALIZADO',
        save: this.internacion.estado === 'FINALIZADO'
      }
    },

    ...mapGetters(namespace, [
      'salas'
    ])
  },

  methods: {
    save () {

    },

    ...mapActions(namespace, [
      'send'
    ])
  }
}

</script>
