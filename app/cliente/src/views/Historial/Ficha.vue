<template>
  <c-ficha v-if="paciente._id"
    :titulo="paciente.nombre"
  >
    <c-ficha-persona :persona="paciente"/>
    <c-ficha-card
      titulo="ACCIONES"
    >
      <v-list shaped>
        <v-list-item-group color="primary">
          <v-list-item v-for="(accion, i) in acciones"
            :key="i"
            :disabled="accion.disabled"
            @click="accion.click"
          >
            <v-list-item-avatar>
              <v-icon v-text="accion.icon"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="accion.titulo"/>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <c-form-consultas-nuevo
        v-model="swFormConsultasNew"
        :paciente="paciente"
        :type="formConsultasNewType"
      />
      <c-form-urgencias-nuevo
        v-model="swFormUrgenciasNew"
        :paciente="paciente"
      />
    </c-ficha-card>
    <c-ficha-card
      titulo="HISTORIAL"
      sm="12"
    >
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(historial, i) in paciente.historial"
          :key="i"
        >
          <v-expansion-panel-header>
            <v-list dense>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="toTimestamp(historial.fecha)"/>
                  <v-list-item-subtitle v-text="historial.tipo"/>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list dense>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="historial.medico"/>
                  <v-list-item-subtitle v-text="'MÉDICO'"/>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <c-consulta-historia v-if="historial.tipo === 'CONSULTA'" :consulta="historial"/>
            <c-urgencia-historia v-else-if="historial.tipo === 'URGENCIA'" :consulta="historial"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </c-ficha-card>
  </c-ficha>
  <c-ficha v-else
    titulo="No ha seleccionado ningún paciente"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'historial'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    'c-ficha-persona': () => import('@/components/ficha/FichaPersona.vue'),
    'c-form-consultas-nuevo': () => import('@/components/forms/citas/NuevoTurno.vue'),
    'c-form-urgencias-nuevo': () => import('@/components/forms/urgencias/NuevoTurno.vue'),
    'c-consulta-historia': () => import('@/components/Historia.vue'),
    'c-urgencia-historia': () => import('@/views/Urgencias/Atencion/Cama/Historia.vue')
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    swFormConsultasNew: false,
    swFormUrgenciasNew: false,
    formConsultasNewType: null
  }),

  computed: {
    acciones () {
      const disabled = true
      return [
        {
          titulo: 'NUEVA CONSULTA',
          icon: 'mdi-stethoscope',
          click: this.nuevoTurno,
          disabled: !(this.permisos.consultas && this.permisos.consultas.create)
        },
        {
          titulo: 'NUEVA URGENCIA',
          icon: 'mdi-bandage',
          click: this.nuevaUrgencia,
          disabled: !(this.permisos.urgencias && this.permisos.urgencias.create)
        },
        { titulo: 'NUEVO ESTUDIO', icon: 'mdi-microscope', disabled },
        { titulo: 'NUEVO INGRESO', icon: 'mdi-bed', disabled },
        { titulo: 'NUEVO PROCEDIMIENTO', icon: 'mdi-box-cutter', disabled }
      ]
    },

    ...mapGetters(namespace, [
      'pacientes',
      'paciente'
    ]),

    ...mapGetters([
      'permisos'
    ])
  },

  created () {
    const paciente = this.$route.params.paciente
    this.send({
      command: 'get',
      args: {
        _id: paciente
      }
    })

    paciente && this.selectPaciente(paciente)
    /*
    if (this.$route.path === '/historial/ficha') {
      this.$router.replace(this.paciente._id)
    }
    */
  },

  methods: {
    nuevoTurno () {
      this.formConsultasNewType = 'consulta'
      this.swFormConsultasNew = true
    },

    nuevaUrgencia () {
      this.swFormUrgenciasNew = true
    },

    ...mapActions(namespace, [
      'selectPaciente',
      'send'
    ])
  }
}
</script>
