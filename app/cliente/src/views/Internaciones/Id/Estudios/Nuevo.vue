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
          <v-row class="px-3" no-wrap>
            <v-col cols="6">
              <v-text-field
                v-model="estudio"
                label="Nombre del Estudio"
                :rules="[(val => !!val || 'Este campo es obligatorio')]"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field v-if="fileUploaded"
                :value="filename"
                label="Archivo"
                readonly
              />
              <file-upload v-else
                :url='url'
                btn-label="Seleccione un archivo"
                btn-uploading-label="Cargando archivo"
                @change="onFileChange"
                @success="onUploadSuccess"
                @error="onUploadError"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="observaciones"
                label="Observaciones"
                auto-grow
                rows="4"
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-progress-linear v-if="loading" indeterminate/>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="blue darken-1"
          text
          @click="save"
          :disabled="disable.save"
        >
          GUARDAR
        </v-btn>
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
    // 'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
  },

  props: {
    value: Boolean,
    resumen: Object,
    _id: String,
    send: Function
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    disabled: false,
    loading: false,
    file: null,
    edited: null,
    estudio: null,
    observaciones: null,
    url: 'api/internaciones/estudios/upload',
    fileUploaded: null
  }),

  computed: {
    title () {
      return 'Insertar Nuevo Estudio'
    },

    dialog: {
      get () {
        return this.value
      },
      set (val) {
        this.fileUploaded = null
        this.$refs.form.reset()
        this.$emit('input', val)
      }
    },

    filename () {
      return this.fileUploaded && this.fileUploaded.name
    },

    disable () {
      return {
        save: !this.fileUploaded
      }
    }

  },

  methods: {
    onFileChange (file) {
      if (file.result === 200) {
        this.fileUploaded = file.data
      } else {
        this.onUploadError()
      }
    },

    save () {
      if (this.$refs.form.validate()) {
        this.disabled = true
        this.loading = true
        this.send({
          command: 'create',
          args: {
            _id: this._id,
            estudio: {
              estudio: this.estudio,
              file: this.fileUploaded._id,
              observaciones: this.observaciones
            }
          }
        }).then(() => {
          this.disabled = false
          this.loading = false
          this.editedValue = ''
          this.$store.commit('success')
          this.close()
        }).catch(this.error)
      }
    },

    onUploadSuccess () {
    },

    onUploadError () {
    },

    error () {
      this.$store.commit('error', { title: 'Error al Guardar', details: 'Indefinido' })
      this.close()
    },

    close () {
      this.dialog = false
    }
  }
}
</script>
