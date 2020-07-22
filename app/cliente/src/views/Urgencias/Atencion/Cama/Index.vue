<template>
  <c-ficha :titulo="titulo">
    <template v-if="cama">
      <c-ficha-persona :persona="cama"/>
      <c-detalles :cama="cama"/>
      <c-servicios :cama="cama"/>
      <c-acciones :cama="cama"
        @finish="finish = true"
      />
      <c-historia :consulta="cama"
        :swFinish="finish"
      />
    </template>
    <v-card v-else
      class="mx-auto text-center red--text"
      max-width="700"
    >
      NO HAY PACIENTE EN CAMA
    </v-card>
  </c-ficha>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'urgencias'

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
      return this.id ? 'URGENCIA' : {
        cama_a: 'CAMA A',
        cama_b: 'CAMA B',
        observacion: 'OBSERVACIÓN'
      }[this.$route.params.cama]
    },

    cama () {
      return this.id ? this.urgencias.find(el => el._id === this.id) : this.camas[this.$route.params.cama] || null
    },

    ...mapState(namespace, [
      'urgencias'
    ]),

    ...mapGetters(namespace, [
      'camas'
    ])
  },

  methods: {
  }
}
</script>
