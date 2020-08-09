<template>
  <v-data-table
    :headers="cheaders.diario"
    :items="diario"
    item-key="fecha"
    sort-by="fecha"
    sort-desc
    class="elevation-1"
    show-expand
    single-expand
  >
  <template v-slot:expanded-item="{ headers, item }">
    <td :colspan="headers.length">
      <v-data-table
        :headers="cheaders.consultas"
        :items="item.consultas"
        @click:row="onClickRow"
        sort-by="fechaInicio"
        sort-desc
        class="elevation-1"
        disable-pagination
        hide-default-footer
        dense
      ></v-data-table>
    </td>
  </template>
</v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'reportes'

export default {
  components: {
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

    cheaders () {
      return {
        consultas: [
          { text: 'Paciente', value: 'nombre' },
          { text: 'Tipo', value: 'tipo' },
          { text: 'Inicio', value: 'inicio' },
          { text: 'Fin', value: 'fin' },
          { text: 'Duración (minutos)', value: 'duracion', align: 'right' }
        ],
        diario: [
          { text: 'Fecha', value: 'fecha' },
          { text: 'Programadas', value: 'programadas', align: 'center' },
          { text: 'Espontáneas', value: 'espontaneas', align: 'center' }
          // { text: 'Detalles', value: 'data-table-expand' }
        ]
      }
    },

    diario () {
      return Object.entries(this.consultas.reduce((acc, cur) => {
        const fecha = this.toDate(cur.fin || cur.fecha)
        // acc[fecha] = acc[fecha] + 1 || 1
        if (!acc[fecha]) acc[fecha] = []
        acc[fecha].push(cur)
        return acc
      }, {})).map(([fecha, consultas]) => Object.assign({
        fecha,
        consultas,
        programadas: consultas.filter(el => el.tipo !== 'ESPONTÁNEA').length,
        espontaneas: consultas.filter(el => el.tipo === 'ESPONTÁNEA').length
      }))
    },

    ...mapGetters(namespace, [
      'consultas'
    ])
  },

  methods: {
    onClickRow (item) {
      this.$router.push('/citas/consulta/' + item._id)
    }
  }
}
</script>
