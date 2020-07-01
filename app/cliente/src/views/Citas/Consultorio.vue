<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="700"
      color="green lighten-5"
    >
      <v-row class="text-center title blue--text text--darken-4">
        <v-col cols="6" class="text-right my-auto">
          Consultorio:
        </v-col>
        <v-col cols="3" sm="2" class="text-left">
          <v-select
            :items="items"
            :value="consultorio"
            @input="setConsultorio"
          />
        </v-col>
      </v-row>
    </v-card>
    <v-card
      v-if="$route.params.consultorio !== 'index' && $route.params.consulta === 'index'"
      class="mx-auto text-center red--text"
      max-width="700"
    >
      NO HAY PACIENTES EN ESPERA
    </v-card>
    <router-view v-else/>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

const namespace = 'consultas'

export default {
  components: {
  },

  data: () => ({
    // consultorio: null,
    items: [...Array(3).keys()].map(x => x + 1),
    servicios: []
  }),

  computed: {
    consultorio () {
      const consultorio = this.$route.params.consultorio || null
      return consultorio === 'index' ? null : parseInt(consultorio, 10)
    },

    ...mapState(namespace, {
      consultas: 'consultas'
    })
  },

  created () {
    /*
    if (this.$route.name === 'innerConsulta') {
      this.$router.replace({ name: 'Consultorio', params: { consultorio: 'index' } })
    }
    */
  },

  methods: {
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
