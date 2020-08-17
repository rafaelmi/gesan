<template>
  <c-ficha
   :titulo="titulo"
  >
    <v-row dense>
      <v-col cols="12">
        <c-resumen :paciente="internacion.nombre"/>
      </v-col>
      <!--
      <v-col cols="12">
        <c-forms-add
          :send="send"
          :_id="internacion._id"
          field="servicio"
        />
      </v-col>
    -->
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
              { text: 'Producto', value: 'servicio' }
            ]"
            :items="dia.servicios"
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
import { mapState, mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/servicios'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    // 'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    // 'c-forms-add': () => import('@/components/forms/inner/Add.vue'),
    'c-resumen': () => import('./Resumen.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'SERVICIOS Y MEDICAMENTOS',
    accion: null,
    items: [],
    expand: 0
  }),

  computed: {
    servicios () {
      const servicios = this.internacion.servicios || []
      return servicios.map(el => Object.assign(
        {},
        el,
        { fecha: this.toTimestamp(el.fecha) }
      ))
    },

    diario () {
      return Object.entries(this.servicios.reduce((acc, cur) => {
        const fecha = this.toDate(cur.fin || cur.fecha)
        if (!acc[fecha]) acc[fecha] = []
        acc[fecha].push(cur)
        return acc
      }, {})).map(([fecha, servicios]) => Object.assign({
        fecha,
        servicios
      })).reverse()
    },

    sala () {
      return this.salas[this.$route.params.sala] || null
    },

    internacion () {
      return this.sala ||
        this.internaciones.find(el => el._id === this.$route.params.id) ||
        null
    },

    disable () {
      return {
        create: this.internacion.estado === 'FINALIZADO'
      }
    },

    ...mapState('internaciones', [
      'internaciones'
    ]),

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
