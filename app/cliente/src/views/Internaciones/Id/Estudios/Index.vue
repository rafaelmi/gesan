<template>
  <div>
    <!--
    <c-nuevo-estudio
      v-model="swNuevo"
      :send="send"
      :_id="internacion._id"
      :resumen="{
        paciente: internacion.nombre,
        sala: internacion.sala
      }"
    />
  -->
    <c-ficha
     :titulo="titulo"
    >
      <c-ficha-card titulo="PACIENTE" sm="12">
        <c-resumen :paciente="internacion.nombre"/>
      </c-ficha-card>
      <!--
      <c-ficha-card titulo="ACCIONES">
        <v-list>
          <v-list-item
            :disabled="disable.save"
            @click="nuevo"
          >
            <v-list-item-icon>
              <v-icon v-text="'mdi-pencil'" color="green"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'AGREGAR ESTUDIO'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </c-ficha-card>
    -->
      <c-ficha-card sm="12">
        <v-expansion-panels v-model="expandDia">
          <v-expansion-panel
            v-for="(dia, key) in diario"
            :key="key"
          >
            <v-expansion-panel-header>
              <span dense v-text="key"/>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-expansion-panels v-model="expandGrupo">
                <v-expansion-panel v-for="(grupo, key) in dia"
                  :key="key"
                >
                  <v-expansion-panel-header>
                    <span v-text="key"/>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <template v-if="key === 'Evolución'">
                      <v-data-table
                        :headers="[
                          { text: 'Hora', align: 'start', value: 'hora' },
                          { text: 'Anotación', align: 'start', value: 'value' }
                        ]"
                        :items="grupo"
                        disable-pagination
                        hide-default-footer
                      />
                    </template>
                    <template v-else>
                      <v-row dense no-wrap>
                        <v-col cols="3">
                          <v-data-table
                            :headers="[{ text: 'Parámetro', align: 'start', value: 'param' }]"
                            :items="grupo"
                            disable-pagination
                            hide-default-footer
                          />
                        </v-col>
                        <v-col cols="9">
                          <v-data-table
                            :headers="headers"
                            :items="grupo"
                            disable-pagination
                            hide-default-footer
                          />
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </c-ficha-card>
      <c-ficha-card sm="12">
        <v-data-table
          :headers="[
            { text: 'Fecha', value: 'fecha', align: 'start'},
            { text: 'Estudio', value: 'estudio', align: 'start'},
            { text: 'Observaciones', value: 'observaciones', align: 'start'},
            { text: 'Descargar', value: 'actions', align: 'end'},
          ]"
          :items="estudios"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              :href="'/api/internaciones/estudios/download/' + item.file"
              @click.stop
            >
              <!--:download="item.title + '.' + item.ext"-->
              <v-icon color="green">mdi-download</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </c-ficha-card>
    </c-ficha>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/estudios'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    'c-resumen': () => import('../Resumen.vue')
    // 'c-nuevo-estudio': () => import('./Nuevo.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'ESTUDIOS REALIZADOS',
    swNuevo: false
  }),

  computed: {
    internacion () {
      return this.sala ||
        this.internaciones.find(el => el._id === this.$route.params.id) ||
        null
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

    estudios () {
      const lista = this.internacion.estudios || []
      return lista.map(el => Object.assign(
        {},
        el,
        { fecha: this.toTimestampShort(el.fecha) }
      ))
    },

    ...mapState('internaciones', [
      'internaciones'
    ]),

    ...mapGetters(namespace, [
      'salas'
    ])
  },

  methods: {
    nuevo () {
      this.swNuevo = true
    },

    ...mapActions(namespace, [
      'send'
    ])
  }
}

</script>
