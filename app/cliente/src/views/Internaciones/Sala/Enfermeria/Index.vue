<template>
  <div>
    <c-editar-registro v-if="swEditar"
      v-model="swEditar"
      :send="send"
      :_id="internacion._id"
      :registro="current"
      :date="currentDate"
      :template="template"
      :resumen="{
        paciente: sala.nombre,
        sala: sala.sala
      }"
    />
    <c-ficha
     :titulo="titulo"
    >
      <c-ficha-card titulo="PACIENTE">
        <c-resumen :paciente="sala.nombre"/>
      </c-ficha-card>
      <c-ficha-card titulo="ACCIONES">
        <v-list>
          <v-list-item
            :disabled="disable.save"
            @click="editar"
          >
            <v-list-item-icon>
              <v-icon v-text="'mdi-pencil'" color="green"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'EDITAR REGISTRO'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </c-ficha-card>
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
    </c-ficha>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/enfermeria'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    'c-editar-registro': () => import('./Editar/Index.vue'),
    'c-resumen': () => import('../Resumen.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'REGISTRO DE ENFERMERÍA EN ADULTOS',
    accion: null,
    items: [],
    expandDia: 0,
    expandGrupo: 0,
    swEditar: false,
    timeout: null,
    currentDate: null
  }),

  computed: {
    internacion () {
      return this.sala
    },

    enfermeria () {
      return this.internacion.enfermeria || {}
    },

    registros () {
      return this.enfermeria.registros || {}
    },

    template () {
      return this.enfermeria.template
    },

    diario () {
      const current = Date.now()
      const fin = this.internacion.fin || current
      const constHora = 1000 * 60 * 60
      const constDia = constHora * 24
      const diario = {}

      let inicio = this.internacion.inicio
      if ((new Date(inicio)).getHours() < 7) {
        inicio -= constDia
      }

      for (var dia = (new Date(inicio)).setHours(0, 0, 0, 0); dia < fin; dia += constDia) {
        const registros = this.registros
        const intervalo = {}
        for (var hora = 0; hora < 24; hora++) {
          intervalo[(hora + 7) % 24] = (
            registros &&
            registros[`${dia + ((hora + 7) * constHora)}`]
          ) || this.template
        }

        const transmuted = Object.entries(intervalo).reduce((acc, [hora, val]) => {
          val && Object.entries(val).forEach(([grupo, val]) => {
            if (acc[grupo] === undefined) acc[grupo] = []
            if (typeof val === 'object') {
              Object.entries(val).forEach(([param, value]) => {
                if (acc[grupo][param] === undefined) acc[grupo][param] = {}
                Object.assign(
                  acc[grupo][param],
                  Object.fromEntries([[hora, value]])
                )
              })
            } else {
              acc[grupo].push({ hora, value: val })
            }
          })
          return acc
        }, {})

        // console.log(transmuted)

        const cleaned = Object.entries(transmuted).reduce((acc, [grupo, params]) => {
          acc[grupo] = (grupo === 'Evolución')
            ? params
            : Object.entries(params).map(([key, val]) => {
              return Object.assign(val, { param: key })
            })
          return acc
        }, {})
        diario[this.toDate(dia)] = cleaned
      }
      return diario

      /*
      const current = Date.now()
      const fin = this.internacion.fin || current
      const inicio = this.internacion.inicio
      const divisor = 1000 * 60 * 60 * 24
      const rango = fin - inicio
      let dias = Math.floor(rango / divisor)
      // if ((new Date (inicio + (rango % divisor))).getDate() !== (new Date(inicio)).getDate()) {
      if (fin - rango > (new Date(fin)).setHours(7,0,0,0))
        dias += 1
      } */
      // return this.registros
    },

    headers () {
      const headers = []
      for (let i = 0; i < 24; i++) {
        const hora = `${(i + 7) % 24}`
        headers.push({
          text: hora.padStart(2, '0'),
          align: 'center',
          value: hora
        })
      }
      return headers
    },

    current () {
      const current = this.registros[(this.currentDate || new Date()).setMinutes(0, 0, 0).toString()] || null
      /*
      if (current) {
        Object.keys(current).forEach(key => {
          Object.freeze(current[key])
        })
      }
      */
      return current
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

  created () {
    const callback = () => {
      const current = Date.now()
      const interval = (new Date(current + 1000 * 60 * 60)).setMinutes(0, 0, 0) - current
      this.currentDate = new Date()
      this.timeout = setTimeout(callback, interval)
    }
    callback()

  /*  const current = Date.now()
    if (!this.enfermeria.find(el => {
      return el.fecha === current.toString()
    }) && !this.disable.create) {
      this.send({
        command: 'create',
        args: { _id: this.internacion._id }
      })
    } */
  },

  beforeDestroy () {
    clearTimeout(this.timeout)
  },

  methods: {
    editar () {
      this.swEditar = true
    },

    save () {
    },

    ...mapActions(namespace, [
      'send'
    ])
  }
}

</script>
