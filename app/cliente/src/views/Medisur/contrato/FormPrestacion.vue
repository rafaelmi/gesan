<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template #activator="{ on }">
      <slot name="activator" :on="on"/>
    </template>
    <v-card>
      <v-card-title>
        <span class="title">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select
            :items="items"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            label="Categoría"
            required
            v-model="categoria"
          />
          <v-select v-if="swProducto"
            :items="subitems"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            label="Producto"
            required
            v-model="producto"
          />
          <v-text-field v-if="swMonto"
            label="Monto"
            :rules="[(val => !/\D/.test(val) || 'Ingrese sólo números'),
              (val => !!val || 'Este campo es obligatorio')]"
            required
            v-model="monto"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="close">CERRAR</v-btn>
        <v-btn color="blue darken-1" text @click="save">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState, mapActions } from 'vuex'

const namespace = 'medisur'

export default {
  props: {
    contrato: Object,
    value: Boolean
  },
  data: () => ({
    categoria: null,
    producto: null,
    monto: null,
    title: 'Agregar Prestación'
    // icon: 'mdi-smart-card'
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

    plan () {
      return this.planes.find(el => el.nombre === this.contrato.plan)
    },

    items () {
      return this.plan.prestaciones.filter(
        el => el.producto.parent.nombre === 'root'
      ).map(el => el.producto.nombre)
    },

    subitems () {
      return this.plan.prestaciones.filter(
        el => el.producto.parent.nombre === this.categoria
      ).map(el => el.producto.nombre)
    },

    swProducto () {
      return this.categoria && this.subitems.length
    },

    swMonto () {
      const prestacion = this.plan.prestaciones.find(
        el => el.producto.nombre === (this.swProducto ? this.producto : this.categoria)
      )
      const cobertura = prestacion && prestacion.cobertura
      const res = cobertura && (cobertura.find(el => el.monto !== '100%'))
      return res
    },

    ...mapState(namespace, {
      planes: 'planes'
    })

  },

  methods: {
    save () {
      if (this.$refs.form.validate()) {
        const producto = (this.swProducto ? this.producto : this.categoria)
        const monto = this.swMonto && this.monto
        this.send({
          modulo: 'prestaciones',
          command: 'create',
          args: {
            contrato: this.contrato._id,
            producto,
            monto
          }
        }).then((result) => {
          this.$store.commit('success', result, { root: true })
        }).catch(() => {})
        this.close()
      }
    },

    close () {
      this.$refs.form.resetValidation()
      this.dialog = false
    },

    ...mapActions(namespace, {
      send: 'send'
    })
  }

}
</script>
