<template>
  <c-ficha-card
    titulo="ACCIONES"
    sm="4"
  >
    <v-list shaped dense>
      <v-list-item
        @click="$router.push('/historial/ficha/' + cama.cedula)"
      >
        <v-list-item-icon>
          <v-icon v-text="'mdi-history'"/>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="'VER HISTORIAL'"/>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        :disabled="disable.observacion"
        @click="onObservacion"
      >
        <v-list-item-icon>
          <v-icon v-text="'mdi-clipboard-pulse'"/>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="'A OBSERVACIÓN'"/>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        :disabled="disable.terminar"
        @click="onTerminar"
      >
        <v-list-item-icon>
          <v-icon v-text="'mdi-stop-circle-outline'" color="red"/>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="'TERMINAR'"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </c-ficha-card>
</template>
<script>
import { mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'urgencias'

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
    disable () {
      return {
        editar: this.cama.estado === 'FINALIZADO',
        observacion: this.cama.estado === 'FINALIZADO' || this.cama.cama === 'observacion',
        terminar: this.cama.estado === 'FINALIZADO'
      }
    },

    urgencia () {
      return this.cama
    }
  },

  methods: {
    onTerminar () {
      this.$emit('finish')
    },

    onObservacion () {
      this.toObservacion(this.cama)
    },

    save () {
      if (!this.disable.editar) {
        return this.send({
          command: 'update',
          args: this.editedItem
        })
      }
    },

    ...mapActions(namespace, [
      'send',
      'toObservacion'
    ])
  }
}
</script>
