<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="700"
      color="green lighten-5"
    >
      <v-row class="text-center title blue--text text--darken-4">
        <v-col cols="12" class="my-auto">
          Consultorio {{consultorio}}
        </v-col>
        <!--<v-col cols="6" class="text-right my-auto">
          Consultorio {{consultorio}}
        </v-col>
        <v-col cols="3" sm="2" class="text-left">
          <v-select v-if="type === 'consultas'"
            :items="items"
            :value="consultorio"
            @input="setConsultorio"
          />
          <template v-else-if="type === 'urgencias'">
            Urgencias
          </template>
        </v-col>-->
      </v-row>
    </v-card>
    <v-card v-if="!consultas.length"
      class="mx-auto text-center red--text"
      max-width="700"
    >
      NO HAY PACIENTES EN ESPERA
    </v-card>
    <c-consulta v-else
      :id="current._id"
      :first="index === 0"
      :last="index === consultas.length - 1"
      @next="onNext"
      @previous="onPrevious"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

const namespace = 'consultas'

export default {
  components: {
    'c-consulta': () => import('./Consulta.vue')
  },

  props: {
    type: {
      type: String,
      default: 'consultas'
    }
  },

  data: () => ({
    // consultorio: null,
    items: [...Array(3).keys()].map(x => x + 1),
    servicios: []
  }),

  computed: {
    consultorio () {
      // const consultorio = this.$route.params.consultorio || null
      // return consultorio === 'index' ? null : parseInt(consultorio, 10)
      return this.user.consultorio
    },

    consultas () {
      const consultas = this.consultasRaw.filter(el => {
        return (el.consultorio === this.consultorio) && (el.estado !== 'FINALIZADO')
      })
      return consultas.sort((a, b) => {
        return a.fecha - b.fecha
      })
    },

    index () {
      return parseInt(this.$route.params.index, 10)
    },

    current () {
      return this.consultas[this.index]
    },

    first () {
      return this.consultas[0]
    },

    last () {
      return this.consultas[this.consultas.length - 1]
    },

    ...mapState([
      'user'
    ]),

    ...mapState(namespace, {
      consultasRaw: 'consultas'
    })
  },

  watch: {
    consultas (val) {
      if (this.index > val.length - 1) {
        this.$router.push('/citas/consultorio')
      }
    }
  },

  created () {
    if (this.type === 'urgencias') this.setConsultorio('URGENCIAS')
  },

  methods: {
    onNext () {
      // const index = this.consultas.indexOf(el => this.current && el._id === this.current._id)
      // this.current = this.consultas[index + 1 || 1]
      this.$router.push('/citas/consultorio/' + (this.index + 1))
    },

    onPrevious () {
      this.$router.push('/citas/consultorio/' + (this.index - 1))
    },
    setConsultorio (val) {
      // const consulta = this.consultasFiltradas[0]
      // this.siguiente(val)
      this.nextConsulta({ consultorio: val, router: this.$router })

      /* this.$router.push(
        '/citas/consultorio/' + val + '/consulta/' +
        (this.siguiente._id || 'index')
      ) */
    },

    ...mapActions(namespace, {
      nextConsulta: 'nextConsulta'
    })

    /*
    siguiente (consultorio) {
      const consulta = this.consultas.find(item => {
        return ['EN ESPERA', 'CONSULTANDO'].find(el => item.estado === el) &&
        (item.consultorio === consultorio)
      }) || null
      this.$router.push(
        '/citas/consultorio/' + consultorio + '/consulta/' +
        (consulta ? consulta._id : 'index')
      )
    }
    */
  }
}
</script>
