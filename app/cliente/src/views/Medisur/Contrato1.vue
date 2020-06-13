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
        <v-col cols="12" sm="3">
          <v-list dense>
            <v-subheader v-text="'DETALLES'"/>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="contrato.plan"/>
                  <v-list-item-subtitle v-text="'Plan'"/>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="toMoney(contrato.cuota)"/>
                  <v-list-item-subtitle v-text="'Cuota'"/>
                </v-list-item-content>
              </v-list-item>
              <!--<v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="toMoney(contrato.adicional)"/>
                  <v-list-item-subtitle v-text="'Adicional'"/>
                </v-list-item-content>
              </v-list-item>-->
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="toDate(contrato.fechaInicio)"/>
                  <v-list-item-subtitle v-text="'Inicio de Contrato'"/>
                </v-list-item-content>
              </v-list-item>
          </v-list>
            <!--<v-list-item two-line/>
            <v-list-item two-line/>-->
        </v-col>
        <v-spacer/>
        <v-divider vertical/>
        <v-col cols="12" sm="8">
          <div>
            <v-list dense>
              <v-subheader v-text="'TITULAR'"/>
              <v-list-group sub-group>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="contrato.nombre.toUpperCase()"/>
                    <v-list-item-subtitle v-text="'C.I. ' + toMilSeparator(contrato.cedula)"/>
                  </v-list-item-content>
                </template>
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
              </v-list-group>
            </v-list>
            <v-list dense>
              <v-list-group value=true>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      ADHERENTES
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <cmpForm v-model="swAdhForm" v-bind="adhFormProps">
                      <template #activator="{ on }">
                        <v-btn
                          icon
                          v-on="on"
                        >
                          <v-icon v-text="'mdi-plus-circle'" color="green"/>
                        </v-btn>
                      </template>
                    </cmpForm>
                  </v-list-item-action>
                </template>
                <v-list-group sub-group
                  v-for="(adh, i) in contrato.adherentes"
                  :key="i"
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title v-text="adh.nombre.toUpperCase()"/>
                      <v-list-item-subtitle v-text="'C.I. ' + toMilSeparator(adh.cedula)"/>
                    </v-list-item-content>
                  </template>
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
                </v-list-group>
              </v-list-group>
              <v-list-group>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      PAGOS
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <cmpForm v-model="swPagosForm" v-bind="pagosFormProps">
                      <template #activator="{ on }">
                        <v-btn
                          icon
                          v-on="on"
                        >
                          <v-icon v-text="'mdi-plus-circle'" color="green"/>
                        </v-btn>
                      </template>
                    </cmpForm>
                  </v-list-item-action>
                </template>
                <v-list-group sub-group
                  v-for="pago in contrato.pagos"
                  :key="pago._id"
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title v-text="toDate(pago.fecha)"/>
                    </v-list-item-content>
                  </template>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title v-text="toMoney(pago.monto)"/>
                      <v-list-item-subtitle v-text="'Monto'"/>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title v-text="toFacturaId(pago._id)"/>
                      <v-list-item-subtitle v-text="'Factura'"/>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-group>
              </v-list-group>
              <v-list-group>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      EVENTOS
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <formSelect
                      v-model="swEventosForm"
                      v-bind="eventosFormProps"
                      @success="createEvent"
                    >
                      <template #activator="{ on }">
                        <v-btn
                          icon
                          v-on="on"
                        >
                          <v-icon v-text="'mdi-plus-circle'" color="green"/>
                        </v-btn>
                      </template>
                    </formSelect>
                  </v-list-item-action>
                </template>
                <v-list-group sub-group
                  v-for="evento in contrato.eventos"
                  :key="evento.inicio"
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title v-text="toDate(evento.inicio)"/>
                    </v-list-item-content>
                  </template>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title v-text="getAdhDetails(evento.adherente).nombre"/>
                      <v-list-item-subtitle v-text="'C.I. ' + toMilSeparator(getAdhDetails(evento.adherente).cedula)"/>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-group>
              </v-list-group>
            </v-list>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>

import mixUtils from '@/mixins/utils'
import { mapGetters, mapActions } from 'vuex'

const namespace = 'medisur'
// const modulo = 'contratos'

export default {
  components: {
    cmpForm () { return import('@/components/forms/Form.vue') },
    formSelect () { return import('@/components/forms/Select.vue') }
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    swAdhForm: false,
    swPagosForm: false,
    swEventosForm: false,
    adhDefaultProps: {
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

    pagosDefaultProps: {
      title: 'Nuevo Pago',
      api: {
        url: '',
        command: 'create'
      },
      namespace,
      modulo: 'pagos',
      fields: [
        { value: 'contrato', text: 'Contrato', type: 'id', disabled: true },
        { value: '_id', text: 'Factura No.', type: 'factura', required: true },
        { value: 'fecha', text: 'Fecha', type: 'fecha', required: true },
        { value: 'monto', text: 'Monto', type: 'dinero', required: true }
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

    adhFormProps () {
      return Object.assign(
        {},
        this.adhDefaultProps,
        { itemValues: { contrato: this.contrato._id } }
      )
    },

    pagosFormProps () {
      return Object.assign(
        {},
        this.pagosDefaultProps,
        { itemValues: { contrato: this.contrato._id } }
      )
    },

    eventosFormProps () {
      return {
        title: 'Seleccionar Adherente',
        label: 'Nombre',
        items: this.contrato.adherentes.map(el => Object.assign({ value: el.nombre, msj: el.cedula })),
        icon: 'mdi-smart-card'
      }
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
    },

    createEvent (adh) {
      if (adh) {
        this.send({
          modulo: 'eventos',
          command: 'create',
          args: {
            contrato: this.contrato._id,
            adherente: this.contrato.adherentes.find(el => el.nombre === adh).cedula
          }
        }).then((result) => {
          this.$store.commit('success', result, { root: true })
        }).catch(() => {})
      }
    },

    getAdhDetails (cedula) {
      return this.contrato.adherentes.find(el => el.cedula === cedula)
    },

    ...mapActions(namespace, {
      send: 'send'
    })

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
