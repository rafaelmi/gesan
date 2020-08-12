<template>
  <c-ficha
   :titulo="titulo"
  >
    <v-row>
      <v-col cols="12">
        <c-resumen :paciente="sala.nombre"/>
      </v-col>
      <v-col cols="12">
        <c-add-nota
          :send="send"
          :_id="internacion._id"
          field="evolucion"
        />
      </v-col>
    </v-row>

    <v-expansion-panels v-model="expand">
      <v-expansion-panel
        v-for="(dia, i) in diario"
        :key="i"
      >
        <v-expansion-panel-header>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-text="dia.fecha"/>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="[
              { text: 'Fecha', value: 'fecha' },
              { text: 'Evolución', value: 'value' }
            ]"
            :items="dia.evolucion"
            :key="dia.fecha"
            disable-pagination
            hide-default-footer
          >
        </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </c-ficha>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/evolucion'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-resumen': () => import('./Resumen.vue'),
    'c-add-nota': () => import('@/components/forms/inner/AddNota.vue')
    // 'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'EVOLUCIÓN DEL PACIENTE',
    accion: null,
    items: [],
    expand: 0
  }),

  computed: {
    internacion () {
      return this.sala
    },

    sala () {
      return this.salas[this.$route.params.sala] || null
    },

    disable () {
      return {
        create: this.internacion.estado === 'FINALIZADO'
      }
    },

    evolucion () {
      const lista = this.internacion.evolucion || []
      return lista.map(el => Object.assign(
        {},
        el,
        { fecha: this.toTimestampShort(el.fecha) }
      ))
    },

    diario () {
      return Object.entries(this.evolucion.reduce((acc, cur) => {
        const fecha = this.toDate(cur.fin || cur.fecha)
        if (!acc[fecha]) acc[fecha] = []
        acc[fecha].push(cur)
        return acc
      }, {})).map(([fecha, evolucion]) => Object.assign({
        fecha,
        evolucion
      })).reverse()
    },

    ...mapGetters(namespace, [
      'salas'
    ])
  },

  methods: {
    ...mapActions(namespace, [
      'send'
    ])
  }
}

</script>
