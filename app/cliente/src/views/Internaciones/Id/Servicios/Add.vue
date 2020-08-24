<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-snackbar v-model="alert.sw" :color="alert.color" top>
      <v-icon dark>mdi-check-circle</v-icon>
      <span class="title pl-1" :top="true" v-text="alert.msg"/>
      <v-spacer/>
    </v-snackbar>
    <v-card>
      <v-card-title class="blue darken-2 white--text">
        <span class="title">{{ title }}</span>
        <v-spacer/>
        <v-btn icon @click="close" class="white--text"><v-icon v-text="'mdi-close'"/></v-btn>
      </v-card-title>
      <v-card-text class="px-0">
        <v-form ref="form"
          :disabled="disabled"
        >
          <v-row dense class="pa-4">
            <v-col cols="12">
              <v-combobox
                v-model="Producto"
                :rules="[(val => !!val || 'Este campo es obligatorio')]"
                :items="items"
                label="Producto"
              />
            </v-col>
            <v-col cols="8">
              <v-combobox
                class="pr-4"
                v-model="Presentación"
                :items="subitems"
                label="Presentación"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                :rules="[
                  (val => !!val || 'Este campo es obligatorio'),
                  (val => val > 0 || 'El valor debe ser positivo')
                ]"
                v-model="Cantidad"
                label="Cantidad"
              />
            </v-col>
          </v-row>
          <v-progress-linear v-if="loading" indeterminate/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="save" :disabled="disabled">GUARDAR</v-btn>
        <v-btn color="blue darken-1" text @click="close" :disabled="disabled">CERRAR</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

export default {
  components: {
    // 'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
    value: Boolean,
    resumen: Object,
    _id: String,
    send: Function
  },

  data: () => ({
    title: 'Agregar Servicio/Medicamento',
    Producto: null,
    Presentación: null,
    Cantidad: null,
    disabled: false,
    loading: false,
    state: null
  }),

  computed: {
    dialog: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },

    items () {
      return this.productos.map(el => el.Producto).sort()
    },

    subitems () {
      return this.productos.filter(el => {
        return el.Presentación && (el.Producto === this.Producto)
      }).map(el => el.Presentación)
    },

    alert () {
      const alert = {
        sw: false
      }
      if (this.state) {
        Object.assign(alert, {
          sw: true,
          color: this.state,
          msg: this.state === 'success' ? 'Operación exitosa.' : 'Operación rechazada.'
        })
      }
      return alert
    },

    ...mapState('productos', [
      'productos'
    ])
  },

  watch: {
    Producto (val) {
      this.Presentación = null
    }
  },

  methods: {
    save () {
      if (this.$refs.form.validate()) {
        this.disabled = true
        this.loading = true

        const producto = Object.assign(
          {
            _id: null,
            Producto: this.Producto,
            Presentación: this.Presentación,
            Cantidad: this.Cantidad
          },
          this.productos.find(el => {
            return (
              el.Producto === this.Producto &&
              this.Presentación === (el.Presentación || null)
            )
          })
        )

        const send = () => this.send({
          command: 'create',
          args: {
            _id: this._id,
            producto
          }
        }).then(() => {
          this.state = 'success'
          this.$refs.form.reset()
          this.disabled = false
          this.loading = false
        }).catch(() => {
          this.state = 'error'
        })

        if (producto._id) {
          send()
        } else {
          this.sendProducto({
            command: 'create',
            args: producto
          }).then((res) => {
            Object.assign(producto, res.data)
            send()
          }).catch(() => {
            this.state = 'error'
          })
        }
      }
    },

    close () {
      this.$refs.form.reset()
      this.dialog = false
    },

    ...mapActions('productos', {
      sendProducto: 'send'
    })
  }
}

</script>
