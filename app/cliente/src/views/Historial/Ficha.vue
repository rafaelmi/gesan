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
                  <v-list-item-subtitle v-text="'CONSULTA'"/>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-expansion-panel-header>
          <v-expansion-panel-content v-if="historial.estado === 'FINALIZADO'">
            <v-list dense>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="historial.medico"/>
                  <v-list-item-subtitle v-text="'MÉDICO'"/>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <c-historia :consulta="historial"/>
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
    'c-historia': () => import('@/components/Historia.vue')
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    swFormConsultasNew: false
  }),

  computed: {
    acciones () {
      const disabled = true
      return [
        {
          titulo: 'NUEVA CONSULTA',
          icon: 'mdi-stethoscope',
          click: this.nuevoTurno
          // disabled: this.paciente.historial[0] && this.paciente.historial[0].estado !== 'FINALIZADO'
        },
        { titulo: 'NUEVO ESTUDIO', icon: 'mdi-microscope', disabled },
        { titulo: 'NUEVO INGRESO', icon: 'mdi-bed', disabled },
        { titulo: 'NUEVO PROCEDIMIENTO', icon: 'mdi-box-cutter', disabled }
      ]
    },

    ...mapGetters(namespace, [
      'pacientes',
      'paciente'
    ])
  },

  created () {
    const paciente = this.$route.params.paciente
    paciente && this.selectPaciente(paciente)
    /*
    if (this.$route.path === '/historial/ficha') {
      this.$router.replace(this.paciente._id)
    }
    */
  },

  methods: {
    nuevoTurno () {
      this.swFormConsultasNew = true
    },

    ...mapActions(namespace, [
      'selectPaciente'
    ])
  }
}
</script>
