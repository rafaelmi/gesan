<template>
  <c-ficha
   :titulo="titulo"
  >
    <c-ficha-persona :persona="sala"/>
    <c-ficha-card titulo=" ">
      <v-textarea
        class="mx-auto px-4"
        v-model="motivo"
        :disabled="disable.motivo"
        :loading="sending"
        label="MOTIVO DE INTERNACIÓN"
        auto-grow
        rows="2"
        outlined
      />
      <v-textarea
        class="mx-auto px-4"
        v-model="aea"
        :disabled="disable.aea"
        :loading="sending"
        label="A.E.A."
        auto-grow
        rows="4"
        outlined
      />
        <v-btn
          small
          color="green"
          :disabled="disable.save"
          @click="save"
          class="mx-4 mb-4"
          dark
        >
          <v-icon class="mr-2">mdi-content-save</v-icon>
          GUARDAR
        </v-btn>
    </c-ficha-card>
    <!--
    <c-ficha-card sm="12">
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
      </c-ficha-card>
    -->
  </c-ficha>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/historia'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-persona': () => import('@/components/ficha/FichaPersona.vue'),
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
    /*
    // 'c-resumen': () => import('../Resumen.vue'),
    // 'c-add-nota': () => import('@/components/forms/inner/AddNota.vue'),
    'c-nuevo': () => import('./Nuevo.vue')
    */
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'HISTORIA CLÍNICA',
    items: [],
    expand: 1,
    motivo: null,
    aea: null
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
        create: this.internacion.estado === 'FINALIZADO',
        save: this.internacion.estado === 'FINALIZADO'
      }
    },

    ...mapGetters(namespace, [
      'salas'
    ])
  },

  methods: {
    save () {

    },

    ...mapActions(namespace, [
      'send'
    ])
  }
}

</script>
