<template>
  <c-ficha-card
    :titulo="titulo"
    :sm="sm"
  >
    <v-list dense>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title v-text="paciente.nombre && paciente.nombre.toUpperCase()"/>
          <v-list-item-subtitle v-text="'Nombre'"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-row no-gutters>
      <v-col cols="6">
          <v-list dense>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="toMilSeparator(paciente.cedula)"/>
                <v-list-item-subtitle v-text="'C.I.'"/>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="toDate(paciente.nacimiento)"/>
                <v-list-item-subtitle v-text="'Fecha de Nacimiento'"/>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-col>
      <v-col cols="6">
          <v-list dense>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="paciente.sexo"/>
                <v-list-item-subtitle v-text="'Sexo'"/>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="toEdad(paciente.nacimiento)"/>
                <v-list-item-subtitle v-text="'Edad'"/>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-col>
    </v-row>
    <v-list dense>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <!--- <v-subheader v-text="'UBICACIÓN'"/>-->
            <v-list-item-title v-text="'UBICACIÓN'"/>
          </v-list-item-content>
        </template>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="paciente.telefono"/>
            <v-list-item-subtitle v-text="'Teléfono'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="paciente.direccion && paciente.direccion.toUpperCase()"/>
            <v-list-item-subtitle v-text="'Dirección'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="paciente.ciudad && paciente.ciudad.toUpperCase()"/>
            <v-list-item-subtitle v-text="'Ciudad'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="paciente.departamento && paciente.departamento.toUpperCase()"/>
            <v-list-item-subtitle v-text="'Departamento'"/>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </c-ficha-card>
</template>
<script>
import mixUtils from '@/mixins/utils'

export default {
  components: {
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
    sm: {
      type: String,
      default: '6'
    },
    paciente: Object
  },

  data: () => ({
    titulo: 'DATOS PERSONALES'
  }),

  computed: {

  },

  methods: {
  }
}
</script>
