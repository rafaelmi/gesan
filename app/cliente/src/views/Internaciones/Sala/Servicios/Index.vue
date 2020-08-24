<template>
  <div>
    <c-add
      v-model="swAgregar"
      :send="send"
      :_id="internacion._id"
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
            :disabled="disable.create"
            @click="agregar"
          >
            <v-list-item-icon>
              <v-icon v-text="'mdi-pencil'" color="green"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'AGREGAR'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </c-ficha-card>
      <v-expansion-panels v-model="expand">
        <v-expansion-panel
          v-for="(dia, i) in diario"
          :key="i"
        >
          <v-expansion-panel-header>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="dia.fecha"/>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :headers="[
                { text: 'Fecha', value: 'fecha' },
                { text: 'Producto', value: 'Producto' },
                { text: 'Presentación', value: 'Presentación' },
                { text: 'Cant.', value: 'Cantidad', align: 'right' },
              ]"
              :items="dia.productos"
              :key="dia.fecha"
              disable-pagination
              hide-default-footer
            >

          </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </c-ficha>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/servicios'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    // 'c-forms-add': () => import('@/components/forms/inner/Add.vue'),
    'c-add': () => import('./Add.vue'),
    'c-resumen': () => import('../Resumen.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
  },

  data: () => ({
    titulo: 'SERVICIOS Y MEDICAMENTOS',
    accion: null,
    items: [],
    expand: 0,
    swAgregar: false
  }),

  computed: {
    internacion () {
      return this.sala
    },

    productos () {
      const productos = this.internacion.productos || []
      return productos.map(el => Object.assign(
        {},
        el,
        { fecha: this.toTimestampShort(el.fecha) }
      ))
    },

    diario () {
      return Object.entries(this.productos.reduce((acc, cur) => {
        const fecha = this.toDate(cur.fin || cur.fecha)
        if (!acc[fecha]) acc[fecha] = []
        acc[fecha].push(cur)
        return acc
      }, {})).map(([fecha, productos]) => Object.assign({
        fecha,
        productos
      })).reverse()
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

  methods: {
    agregar () {
      this.swAgregar = true
    },

    ...mapActions(namespace, [
      'send'
    ])
  }
}

</script>
