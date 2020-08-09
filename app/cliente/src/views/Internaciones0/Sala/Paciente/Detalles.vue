<template>
  <c-ficha-card
    titulo="DETALLES"
    sm="12"
  >
    <v-row no-gutters>
      <v-col cols="6">
        <v-list dense>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="sala.estado"/>
              <v-list-item-subtitle v-text="'Estado'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="toTimestamp(sala.inicio)"/>
              <v-list-item-subtitle v-text="'Ingreso'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="duracion"/>
              <v-list-item-subtitle v-text="'Duración (días)'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="sala.origen"/>
              <v-list-item-subtitle v-text="'Origen'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="6">
        <v-list dense>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="sala.sala"/>
              <v-list-item-subtitle v-text="'Sala'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="toTimestamp(sala.fin)"/>
              <v-list-item-subtitle v-text="'Alta'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title v-text="sala.seguro"/>
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
    sala: Object
  },

  data: () => ({
  }),

  computed: {
    duracion () {
      return Math.round(((this.sala.fin || Date.now()) - this.sala.inicio) / 1000 / 60 / 60 / 24) || 1
    }
  }
}
</script>
