<template>
  <v-dialog v-model="dialog" max-width="700px">
    <v-card>
      <v-card-title class="blue darken-2 white--text">
        <span class="title">{{ title }}</span>
        <v-spacer/>
        <v-btn icon @click="close" class="white--text"><v-icon v-text="'mdi-close'"/></v-btn>
      </v-card-title>
      <v-card-text class="px-0">
        <v-row no-wrap class="px-3">
          <v-col cols="6" class="pr-0">
            <v-list class="blue lighten-5" elevation="2">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="resumen.paciente"/>
                  <v-list-item-subtitle v-text="'PACIENTE'"/>
                </v-list-item-content>
              </v-list-item>
          </v-list>
          </v-col>
          <v-col cols="6" class="pl-0">
            <v-list class="blue lighten-5" elevation="2">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title v-text="resumen.sala"/>
                  <v-list-item-subtitle v-text="'SALA'"/>
                </v-list-item-content>
              </v-list-item>
          </v-list>
          </v-col>
        </v-row>
        <v-form ref="form"
          :disabled="disabled"
        >
          <v-row class="px-6">
            <v-textarea
              v-model="fields.Evolución"
              label="Evolución"
              auto-grow
              rows="3"
              outlined
              @blur="save"
              @keyup.enter="save"
            />
            <v-progress-linear v-if="loading" indeterminate/>
          </v-row>
          <v-row class="px-4">
            <c-ficha-card v-for="grupo in Object.keys(fields)"
              :key="grupo"
              :titulo="grupo"
              sm="3"
              elevation="3"
            >
              <v-text-field v-for="field in Object.keys(fields[grupo])"
                :key="field"
                :label="field"
                class="px-2"
                v-model="fields[grupo][field]"
                dense
                @blur="save"
                @keyup.enter="save"
              />
              <c-otro
                :_id="_id"
                :grupo="grupo"
                :template="template"
                :send="send"
                :error="error"
              />
            </c-ficha-card>
            <v-progress-linear v-if="loading" indeterminate/>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="close">CERRAR</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import mixUtils from '@/mixins/utils'
import { } from 'vuex'

export default {
  components: {
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    'c-otro': () => import('./Otro.vue')
  },

  props: {
    value: Boolean,
    resumen: Object,
    registro: Object,
    _id: String,
    send: Function,
    date: Date,
    template: {
      type: Object,
      default: () => Object.assign({
        'Signos Vitales': {
          'F.C. (por mto)': null,
          'F.R. (por mto)': null,
          'P.A. mm.HG': null,
          'T°R°C': null,
          'T°Ax°C': null,
          'P.V.C.': null,
          SPO_2: null
        },
        Suministrados: {
          'Hidr. Parenteral': null,
          'Hidr. C/Mezcla': null,
          'Comp. Sanguíneo': null,
          Drogas: null,
          'Vía Oral': null,
          'Total Global': null
        },
        Eliminados: {
          'Líquido Gástrico': null,
          Diuresis: null,
          Heces: null,
          Vómitos: null,
          Drenajes: null,
          'P.I.': null,
          'Total Global': null
        },
        'Otros Aspéctos Importantes': {
          Densidad: null,
          'H.G.T.': null,
          'Color de Piel': null,
          'Oxígeno L.T.S.': null,
          'T. Respiratorio': null,
          Venfunción: null,
          Curaciones: null,
          'Dieta Indicada': null
        }
      })
    }
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    disabled: false,
    loading: false,
    edited: null
  }),

  computed: {
    title () {
      const pad = (val) => val.toString().padStart(2, '0')
      const hour = this.date.getHours()
      const nextHour = hour + 1
      return 'Editar Registro Actual (' + pad(hour) + ':00 - ' + pad(nextHour) + ':00)'
    },

    dialog: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },

    fields () {
      const fields = JSON.parse(JSON.stringify(this.registro || this.template))
      Object.entries(this.template).forEach(([grupo, val]) => {
        Object.entries(val).forEach(([field, val]) => {
          if (fields[grupo][field] === undefined) fields[grupo][field] = null
        })
      })
      return fields
      // return JSON.parse(JSON.stringify(Object.assign({}, this.template, this.registro)))
    }
  },

  methods: {
    save () {
      if (this.$refs.form.validate()) {
        this.disabled = true
        this.loading = true
        this.send({
          command: 'update',
          args: {
            _id: this._id,
            registro: this.fields
          }
        }).then((result) => {
          this.disabled = false
          this.loading = false
        }).catch(() => this.error())
      }
    },

    error () {
      this.close()
    },

    close () {
      this.dialog = false
    }
  }
}
</script>
