<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="700"
      color="green lighten-5"
    >
      <v-row class="text-center headline blue--text text--darken-4">
        <v-col cols="7" class="text-right my-auto">
          Contrato No. {{$route.params.contrato}}
        </v-col>
      </v-row>
    </v-card>
    <v-card
      class="mx-auto"
      max-width="700"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="4">
          <v-card class="ma-1">
            <v-list shaped>
              <v-card-title>DETALLES</v-card-title>
              <v-list-item two-line>
                <!--<v-list-item-icon>
                  <v-icon v-text="'mdi-account'"/>
                </v-list-item-icon>-->
                <v-list-item-content>
                  <v-list-item-title v-text="contrato.plan"/>
                  <v-list-item-subtitle v-text="'Plan'"/>

                  <!--<v-list-item-title v-text="consulta.nombre.toUpperCase()"/>
                  <v-list-item-subtitle v-text="'C.I. ' + toMilSeparator(consulta.cedula)"/>
                -->
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="toMoney(contrato.cuota)"/>
                  <v-list-item-subtitle v-text="'Cuota'"/>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="toMoney(contrato.adicional)"/>
                  <v-list-item-subtitle v-text="'Adicional'"/>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="toDate(contrato.fechaInicio)"/>
                  <v-list-item-subtitle v-text="'Inicio de Contrato'"/>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <!--<v-list-item two-line/>
            <v-list-item two-line/>-->
          </v-card>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card class="ma-1">
            <v-card-title>TITULAR</v-card-title>
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title v-text="contrato.nombre.toUpperCase()"/>
                      <v-list-item-subtitle v-text="'C.I. ' + toMilSeparator(contrato.cedula)"/>
                    </v-list-item-content>
                  </v-list-item>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list shaped>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title v-text="contrato.telefono"/>
                        <v-list-item-subtitle v-text="'Teléfono'"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title v-text="contrato.direccion && contrato.direccion.toUpperCase()"/>
                        <v-list-item-subtitle v-text="'Dirección'"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title v-text="contrato.ciudad && contrato.ciudad.toUpperCase()"/>
                        <v-list-item-subtitle v-text="'Ciudad'"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title v-text="contrato.departamento && contrato.departamento.toUpperCase()"/>
                        <v-list-item-subtitle v-text="'Departamento'"/>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
          <v-card class="ma-1">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-card-title>
                  PAGOS
                  <v-spacer/>
                  <cmpForm v-model="swForm" v-bind="formProps">
                    <template #activator="{ on }">
                      <v-btn
                        icon
                        v-on="on"
                      >
                        <v-icon v-text="'mdi-plus'"/>
                      </v-btn>
                    </template>
                  </cmpForm>
                </v-card-title>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
          <v-card class="ma-1">
            <v-card-title>
              ADHERENTES
              <v-spacer/>
              <cmpForm v-model="swForm" v-bind="formProps">
                <template #activator="{ on }">
                  <v-btn
                    icon
                    v-on="on"
                  >
                    <v-icon v-text="'mdi-plus'"/>
                  </v-btn>
                </template>
              </cmpForm>
            </v-card-title>
            <v-expansion-panels accordion>
              <v-expansion-panel
                v-for="(adh, i) in contrato.adherentes"
                :key="i"
              >
                <v-expansion-panel-header>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title v-text="adh.nombre.toUpperCase()"/>
                      <v-list-item-subtitle v-text="'C.I. ' + toMilSeparator(adh.cedula)"/>
                    </v-list-item-content>
                  </v-list-item>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list shaped>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title v-text="adh.telefono"/>
                        <v-list-item-subtitle v-text="'Teléfono'"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title v-text="adh.direccion && adh.direccion.toUpperCase()"/>
                        <v-list-item-subtitle v-text="'Dirección'"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title v-text="adh.ciudad && adh.ciudad.toUpperCase()"/>
                        <v-list-item-subtitle v-text="'Ciudad'"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title v-text="adh.departamento && adh.departamento.toUpperCase()"/>
                        <v-list-item-subtitle v-text="'Departamento'"/>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
      </v-row>
      <!--
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
    -->
    </v-card>
  </div>
</template>
<script>

import mixUtils from '@/mixins/utils'
import { mapGetters } from 'vuex'

const namespace = 'medisur'
// const modulo = 'contratos'

export default {
  components: {
    cmpForm () { return import('@/components/forms/Form.vue') }
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    swForm: false,
    defaultProps: {
      title: 'Nuevo Adherente',
      api: {
        url: '',
        command: 'create'
      },
      namespace,
      modulo: 'asegurados',
      fields: [
        { value: 'contrato', text: 'Contrato', type: 'id', disabled: true },
        { value: 'cedula', text: 'Cédula', type: 'cedula', required: true, editable: false },
        { value: 'nombre', text: 'Nombre', type: 'nombre', required: true, editable: false },
        { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker', inTable: false },
        { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone', inTable: false },
        { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city', inTable: false },
        { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant', inTable: false }
      ]
    },

    // consultorio: null,
    accion: null,
    items: [],
    editedItem: null,
    sending: false,
    newService: '',
    newServiceError: null
  }),

  computed: {

    contrato () {
      return this.contratos.find(el => el._id === this.$route.params.contrato)
    },

    formProps () {
      return Object.assign(
        {},
        this.defaultProps,
        { itemValues: { contrato: this.contrato._id } }
      )
    },
    /*
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
    */

    ...mapGetters(namespace, {
      contratos: 'contratos'
    })
  },

  methods: {
    onAdd () {
      this.swForm = true
      /*
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
      */
    }

    /*
    setConsultorio (val) {
      this.$router.replace({ name: 'setConsultorio', params: { consultorio: val } })
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
    */
  }
}
</script>
