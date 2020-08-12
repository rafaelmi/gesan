<template>
  <c-ficha-card
    titulo="ACCIONES"
    sm="4"
  >
    <v-list shaped dense>
      <v-list-item
        @click="$router.push('/historial/ficha/' + sala.cedula)"
      >
        <v-list-item-icon>
          <v-icon v-text="'mdi-history'"/>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="'VER HISTORIAL'"/>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        :disabled="disable.cambiar"
        @click="onCambio"
      >
        <v-list-item-icon>
          <v-icon v-text="'mdi-swap-horizontal-bold'"/>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="'CAMBIAR SALA'"/>
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
          <v-list-item-title v-text="'DAR DE ALTA'"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </c-ficha-card>
</template>
<script>
import { mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones'

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
    disable () {
      return {
        editar: this.sala.estado === 'FINALIZADO',
        terminar: this.sala.estado === 'FINALIZADO',
        cambiar: this.sala.estado === 'FINALIZADO'
      }
    }
  },

  methods: {
    onTerminar () {
      return this.send({
        command: 'finish',
        args: {
          _id: this.sala._id
        }
      })
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
      'send'
    ])
  }
}
</script>
