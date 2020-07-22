<template>
  <c-ficha-card
    titulo="DETALLES"
  >
    <v-row no-gutters>
      <v-col cols="6">
        <v-list dense>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="cama.estado"/>
              <v-list-item-subtitle v-text="'Estado'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="toTimestamp(cama.inicio)"/>
              <v-list-item-subtitle v-text="'Inicio'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="duracion"/>
              <v-list-item-subtitle v-text="'Duración (minutos)'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="6">
        <v-list dense>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="cama.cama"/>
              <v-list-item-subtitle v-text="'Cama'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="toTimestamp(cama.fin)"/>
              <v-list-item-subtitle v-text="'Fin'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="cama.seguro"/>
              <v-list-item-subtitle v-text="'Seguro Médico'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-list dense>
    </v-list>
  </c-ficha-card>
</template>
<script>
import mixUtils from '@/mixins/utils'

export default {
  components: {
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
    cama: Object
  },

  data: () => ({
  }),

  computed: {
    duracion () {
      return Math.round(((this.cama.fin || Date.now()) - this.cama.inicio) / 1000 / 60)
    }
  }
}
</script>
