<template>
  <c-ficha :titulo="titulo">
    <template v-if="internacion">
      <c-ficha-persona :persona="internacion"/>
      <c-detalles :sala="internacion"/>
      <c-historia/>
      <!--<c-acciones :sala="internacion"
        @finish="finish = true"
      />-->
      <c-historico :internacion="internacion"/>
    </template>
    <v-card v-else
      class="mx-auto text-center red--text"
      max-width="700"
    >
      NO HAY PACIENTE EN SALA
    </v-card>
  </c-ficha>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-persona': () => import('@/components/ficha/FichaPersona.vue'),
    'c-detalles': () => import('./Detalles.vue'),
    // 'c-acciones': () => import('./Acciones.vue'),
    'c-historia': () => import('./Historia.vue'),
    'c-historico': () => import('./Historico.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    finish: false
  }),

  computed: {
    titulo () {
      const internacion = this.sala || this.internacion || {}
      return internacion.nombre // 'SALA ' + this.$route.params.sala
    },

    sala () {
      return this.salas[this.$route.params.sala] || null
    },

    internacion () {
      return this.sala ||
        this.internaciones.find(el => el._id === this.$route.params.id) ||
        null
    },

    ...mapState(namespace, [
      'internaciones'
    ]),

    ...mapGetters(namespace, [
      'salas'
    ])
  },

  methods: {
  }
}
</script>
