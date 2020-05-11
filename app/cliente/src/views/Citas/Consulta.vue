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
          Consulta Médica
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
            <v-list-item-title v-text="consulta.nombre.toUpperCase()"/>
            <v-list-item-subtitle v-text="'C.I. ' + toMilSeparator(consulta.cedula)"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-icon>
            <v-icon v-text="'mdi-door-closed'"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Consultorio ' + consulta.consultorio"/>
            <v-list-item-subtitle v-text="consulta.estado"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-icon>
            <v-icon v-text="'mdi-calendar'"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="toTimestamp(consulta.fecha)"/>
            <v-list-item-subtitle v-text="'FECHA'"/>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
        <v-subheader>SERVICIOS Y MEDICAMENTOS</v-subheader>
          <div
            v-for="(servicio, i) in servicios"
            :key="i"
          >
            <v-list-item>
              <v-list-item-icon>
                {{i + 1 + '.'}}
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="servicio"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset/>
          </div>
          <v-list-item
            :disabled="disable.add"
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field
                  v-model="newService"
                  :disabled="sending"
                  :loading="sending"
                  :error-messages="newServiceError"
                  label="AGREGAR"
                  prepend-icon="mdi-plus"
                  :append-outer-icon="newService.length && 'mdi-send'"
                  clearable
                  @click:append-outer="onAdd"
                  @keyup.enter="onAdd"
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        <v-divider/>
        <v-subheader>ACCIONES</v-subheader>
        <!--<v-list-item-group color="primary">-->
          <v-list-item
            :disabled="disable.llamar"
            @click="onCall"
          >
            <v-list-item-icon>
              <v-icon v-text="'mdi-bell-ring'" color="red"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'LLAMAR PACIENTE'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :disabled="disable.terminar"
            @click="onTerminar"
          >
            <v-list-item-icon>
              <!--<v-icon v-text="'mdi-check-bold'" color="green"/>-->
              <!--<v-icon v-text="'mdi-exit-run'"/>-->
              <v-icon v-text="'mdi-stop-circle-outline'" color="red"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'TERMINAR CONSULTA'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :disabled="disable.siguiente"
            @click="onSiguiente"
          >
            <v-list-item-icon>
              <v-icon v-text="'mdi-account-arrow-right'"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'SIGUIENTE PACIENTE'"/>
            </v-list-item-content>
          </v-list-item>
        <!--</v-list-item-group>-->
      </v-list>
    </v-card>
  </div>
</template>
<script>
import mixUtils from '@/mixins/utils'
import { mapState, mapActions } from 'vuex'

const namespace = 'consultas'

export default {
  components: {
    // cmpForm () { return import('@/components/forms/Form.vue') }
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    // consultorio: null,
    accion: null,
    items: [],
    editedItem: null,
    sending: false,
    newService: '',
    newServiceError: null
  }),

  computed: {
    consulta () {
      return this.consultas.find(el => el._id === this.$route.params.consulta)
    },

    servicios () {
      return this.consulta.servicios || []
    },

    disable () {
      return {
        terminar: this.consulta.estado !== 'CONSULTANDO',
        add: this.consulta.estado !== 'CONSULTANDO', // || this.sending,
        llamar: this.consulta.estado === 'FINALIZADO',
        siguiente: this.consulta.estado !== 'FINALIZADO' || this.$route.name === 'Consulta'
      }
    },

    ...mapState(namespace, {
      consultas: 'consultas'
    })
  },

  methods: {
    setConsultorio (val) {
      this.$router.replace({ name: 'setConsultorio', params: { consultorio: val } })
    },

    onAdd () {
      if (this.newService.length) {
        this.sending = true
        this.addService({
          consulta: this.consulta,
          servicio: this.newService
        })
          .then(() => {
            this.sending = false
            this.newService = ''
          })
      }
    },

    onCall () {
      this.callPaciente(this.consulta)
    },

    onTerminar () {
      this.finishConsulta(this.consulta)
    },

    onSiguiente () {
      this.nextConsulta({ consultorio: this.consulta.consultorio, router: this.$router })
    },

    ...mapActions(namespace, {
      addService: 'addService',
      callPaciente: 'callPaciente',
      finishConsulta: 'finishConsulta',
      nextConsulta: 'nextConsulta'
    })
  }
}
</script>
