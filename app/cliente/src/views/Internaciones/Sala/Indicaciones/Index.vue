<template>
  <c-ficha
   :titulo="titulo"
  >
    <v-row>
      <v-col cols="12">
        <c-resumen :paciente="sala.nombre"/>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels v-model="expand">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title v-text="'CREAR'"/>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <c-nuevo :internacion="internacion"/>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel
            v-for="(grupo, i) in indicaciones"
            :key="i"
          >
            <v-expansion-panel-header>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title v-text="toTimestampShort(grupo.fecha)"/>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="[
                  { text: '', value: 'id' },
                  { text: '', value: 'item' }
                ]"
                :items="grupo.items"
                disable-pagination
                hide-default-header
                hide-default-footer
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </c-ficha>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/indicaciones'

export default {
  components: {
    'c-resumen': () => import('../Resumen.vue'),
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-nuevo': () => import('./Nuevo.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'INDICACIONES DEL PACIENTE',
    accion: null,
    items: [],
    expand: 1
  }),

  computed: {
    internacion () {
      return this.sala
    },

    indicaciones () {
      let indicaciones = this.internacion.indicaciones || {}
      indicaciones = indicaciones.lista && indicaciones.lista.map(el => Object.assign(
        {},
        el,
        {
          items: el.items.map((item, i) => Object.assign({
            id: i + 1,
            item
          }))
        }
      ))
      return (indicaciones || []).reverse()
    },

    sala () {
      return this.salas[this.$route.params.sala] || null
    },

    disable () {
      return {
        create: this.internacion.estado === 'FINALIZADO'
      }
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
