<template>
  <c-ficha titulo="Consulta Médica">
    <c-ficha-paciente :paciente="consulta"/>
    <c-ficha-card
      titulo="DETALLES"
    >
      <v-row no-gutters>
        <v-col cols="6">
          <v-list dense>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="consulta.estado"/>
                <v-list-item-subtitle v-text="'Estado'"/>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="toTimestamp(consulta.fecha)"/>
                <v-list-item-subtitle v-text="'Fecha'"/>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="6">
          <v-list dense>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="consulta.consultorio"/>
                <v-list-item-subtitle v-text="'Consultorio'"/>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-list dense>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="consulta.medico"/>
            <v-list-item-subtitle v-text="'Médico'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="consulta.seguro"/>
            <v-list-item-subtitle v-text="'Seguro Médico'"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </c-ficha-card>
    <v-divider/>
    <c-ficha-card
      titulo="SERVICIOS Y MEDICAMENTOS"
      sm="12"
    >
      <v-list shaped>
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
      </v-list>
    </c-ficha-card>
    <v-divider/>
    <c-ficha-card
      titulo="ACCIONES"
      sm="12"
    >
      <v-list shaped>
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
      </v-list>
    </c-ficha-card>
  </c-ficha>
</template>
<script>
import mixUtils from '@/mixins/utils'
import { mapState, mapActions } from 'vuex'

const namespace = 'consultas'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    'c-ficha-paciente': () => import('@/components/ficha/FichaPaciente.vue')
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
