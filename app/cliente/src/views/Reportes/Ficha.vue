<template>
  <c-ficha v-if="medico._id"
    :titulo="medico.nombre"
  >
    <c-ficha-persona :persona="medico"/>
    <c-ficha-card
      titulo="DETALLES"
    >
      <v-list dense>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="medico.estado"/>
            <v-list-item-subtitle v-text="'Estado'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="last"/>
            <v-list-item-subtitle v-text="'Última actividad'"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </c-ficha-card>
    <c-ficha-card
      titulo="RESUMEN DIARIO"
      sm="12"
    >
      <v-data-table
        :headers="headers.diario"
        :items="diario"
        sort-by="fecha"
        sort-desc
        class="elevation-1"
      ></v-data-table>
    </c-ficha-card>
    <c-ficha-card
      titulo="DETALLE CONSULTAS"
      sm="12"
    >
      <v-data-table
        :headers="headers.consultas"
        :items="consultas"
        sort-by="fechaInicio"
        sort-desc
        class="elevation-1"
      ></v-data-table>
    </c-ficha-card>
  </c-ficha>
  <c-ficha v-else
    titulo="No ha seleccionado ningún médico"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'reportes'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    'c-ficha-persona': () => import('@/components/ficha/FichaPersona.vue')
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    swFormConsultasNew: false
  }),

  computed: {
    medico () {
      return this.medicos.find(el => el._id === this.$route.params.userid) || {}
    },

    headers () {
      return {
        consultas: [
          { text: 'Paciente', value: 'nombre' },
          { text: 'Inicio', value: 'fechaInicio' },
          { text: 'Fin', value: 'fechaFin' },
          { text: 'Duración (minutos)', value: 'duracion', align: 'right' }
        ],
        diario: [
          { text: 'Fecha', value: 'fecha' },
          { text: 'Consultas', value: 'cantidad', align: 'right' }
        ]
      }
    },

    consultas () {
      return this.consultasRaw.filter(el => el.medico === this.medico._id)
    },

    last () {
      return this.consultas.reduce((acc, cur) => acc > cur.fechaFin ? acc : cur.fechaFin, null)
    },

    diario () {
      return Object.entries(this.consultas.reduce((acc, cur) => {
        const fecha = this.toDate(cur.fechaFin)
        acc[fecha] = acc[fecha] + 1 || 1
        return acc
      }, {})).map(([fecha, cantidad]) => Object.assign({ fecha, cantidad }))
    },

    ...mapGetters([
      'medicos'
    ]),

    ...mapGetters(namespace, {
      consultasRaw: 'consultas'
    })
  },

  methods: {
  }
}
</script>
