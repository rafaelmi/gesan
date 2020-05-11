<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="900"
      color="green lighten-5"
    >
      <!--<v-card-text class="text-center display-1 font-weight-light blue--text text--darken-4">-->
      <v-row class="text-center headline blue--text text--darken-4">
        <v-col cols="7" class="text-right my-auto">
          Seleccione consultorio:
        </v-col>
        <v-col cols="1" class="text-left">
          <v-select
            :items="items"
            value="consultorio"
            @input="setConsultorio"
          />
        </v-col>
      </v-row>
    </v-card>
    <v-card
      class="mx-auto"
      max-width="900"
      color="green lighten-5"
    >
      <v-list shaped>
        <v-subheader>PACIENTE</v-subheader>
        <v-list-item two-line>
          <v-list-item-icon>
            <v-icon v-text="'mdi-account'"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="paciente.nombre"/>
            <v-list-item-subtitle v-text="'C.I. ' + paciente.cedula"/>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
        <v-subheader>SERVICIOS Y MEDICAMENTOS</v-subheader>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item
            v-for="(item, i) in servicios"
            :key="i"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="green">mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>NUEVO</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider/>
        <v-subheader>ACCIONES</v-subheader>
        <v-list-item-group v-model="accion" color="primary">
          <v-list-item>
            <v-list-item-icon>
              <v-icon v-text="'mdi-bell-ring'" color="red"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'LLAMAR PACIENTE'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <!--<v-icon v-text="'mdi-check-bold'" color="green"/>-->
              <!--<v-icon v-text="'mdi-exit-run'"/>-->
              <v-icon v-text="'mdi-stop-circle-outline'" color="red"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'TERMINAR CONSULTA'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon v-text="'mdi-account-arrow-right'"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'SIGUIENTE PACIENTE'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>
<script>
export default {
  components: {
  },

  data: () => ({
    // consultorio: null,
    items: [...Array(5).keys()].map(x => x + 1),
    paciente: {
      nombre: 'Rafael Molina',
      cedula: '8.444.395'
    },
    servicios: []
  }),

  computed: {
    consultorio () {
      return this.$route.params.consultorio || null
    }
  },

  methods: {
    setConsultorio (val) {
      this.$router.push('/citas/consultorio/' + val)
    }
  }
}
</script>
