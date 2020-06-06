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
        <v-form>
          <v-select
            :items="items"
            label="Categoría"
            required
            v-model="categoria"
          />
          <v-select v-if="swProducto"
            :items="subitems"
            label="Producto"
            required
            v-model="producto"
          />
          <v-text-field v-if="swMonto"
            label="Monto"
            required
            v-model="monto"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="dialog = false">CERRAR</v-btn>
        <v-btn color="blue darken-1" text @click="$emit('success', selected); dialog = false">OK</v-btn>
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
    ...mapActions(namespace, {
      send: 'send'
    })
  }

}
</script>
