<template>
  <c-ficha :titulo="titulo">
    <template v-if="sala">
      <c-ficha-persona :persona="sala"/>
      <c-detalles :sala="sala"/>
      <c-historia/>
      <c-acciones :sala="sala"
        @finish="finish = true"
      />
      <c-historico/>
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
    'c-acciones': () => import('./Acciones.vue'),
    'c-historia': () => import('./Historia.vue'),
    'c-historico': () => import('./Historico.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
    id: String
  },

  data: () => ({
    finish: false
  }),

  computed: {
    titulo () {
      return this.sala && this.sala.nombre // 'SALA ' + this.$route.params.sala
    },

    sala () {
      return this.salas[this.$route.params.sala] || null
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
