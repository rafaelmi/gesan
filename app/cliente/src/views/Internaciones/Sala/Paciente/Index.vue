<template>
  <c-ficha :titulo="titulo">
    <template v-if="sala">
      <c-ficha-persona :persona="sala"/>
      <c-detalles :cama="sala"/>
      <c-servicios :cama="sala"/>
      <c-acciones :cama="sala"
        @finish="finish = true"
      />
      <c-historia :consulta="sala"
        :swFinish="finish"
      />
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
    'c-servicios': () => import('./Servicios.vue'),
    'c-acciones': () => import('./Acciones.vue'),
    'c-historia': () => import('./Historia.vue')
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
      return 'SALA ' + this.$route.params.sala
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
