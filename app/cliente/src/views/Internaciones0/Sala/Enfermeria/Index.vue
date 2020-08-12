<template>
  <div>
    <c-editar-registro v-if="swEditar"
      v-model="swEditar"
      :send="send"
      :_id="internacion._id"
      :registro="current"
      :date="currentDate"
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
        <v-expansion-panels v-model="expand">
          <v-expansion-panel
            v-for="(dia, key) in diario"
            :key="key"
          >
            <v-expansion-panel-header>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title v-text="key"/>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{dia}}
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
    expand: 0,
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

      for (var dia = (new Date(inicio)).setHours(0, 0, 0); dia < fin; dia += constDia) {
        const registros = this.registros
        const intervalo = {}
        for (var hora = 0; hora < 24; hora++) {
          intervalo[(hora + 7) % 24] = (
            registros &&
            registros[`${dia + (7 * constHora)}`]
          ) || this.template
        }
        diario[this.toDate(dia)] = intervalo
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

    current () {
      // const current = this.registros[(this.currentDate || new Date()).setMinutes(0, 0, 0).toString()] || null
      const currentHour = (this.currentDate || new Date()).setMinutes(0, 0, 0)
      const current = this.clone(this.enfermeria)
      cback = (obj, padre) => Object.entries(obj).reduce((acc, [key, val]) => {
        if (typeof val === 'object') {
          if (padre) acc[padre] = cback(val, key)
          else acc = cback(val, key)
        }
        else if (parseInt(key, 10) >= currentHour) {
            acc[padre] = val
        }
        else acc[padre] = null
        return acc
      }, {})


          acc[key] = val
        }


      const merge = (a, b) => Object.entries(b).reduce((acc, [key, val]) => {
        if (typeof val === 'object') {

        }

        if (typeof acc[key] !== 'object') {
          acc[key] = (typeof val === 'object') ? {} : val
        }
        else if (typeof val === 'object') acc[key] = cback(val, key)

        if (!val) acc[key] = cback(val, key)
        if (typeof val === 'object') acc[key] = cback(val, key)
        else if (parseInt(key, 10) >= currentHour) {
          acc[padre] = val
        }
        return acc
      }, {})
      return cback(this.clone(this.template), this.template)
      // return current
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
