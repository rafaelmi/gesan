<template>
  <c-ficha-card
    :titulo="titulo"
    :sm="sm"
  >
    <v-list dense>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title v-text="persona.nombre && persona.nombre.toUpperCase()"/>
          <v-list-item-subtitle v-text="'Nombre'"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-row no-gutters>
      <v-col cols="6">
          <v-list dense>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="toMilSeparator(persona.cedula)"/>
                <v-list-item-subtitle v-text="'C.I.'"/>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="toDate(persona.nacimiento)"/>
                <v-list-item-subtitle v-text="'Fecha de Nacimiento'"/>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-col>
      <v-col cols="6">
          <v-list dense>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="persona.sexo"/>
                <v-list-item-subtitle v-text="'Sexo'"/>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title v-text="toEdad(persona.nacimiento)"/>
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
            <v-list-item-title v-text="persona.telefono"/>
            <v-list-item-subtitle v-text="'Teléfono'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="persona.direccion && persona.direccion.toUpperCase()"/>
            <v-list-item-subtitle v-text="'Dirección'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="persona.ciudad && persona.ciudad.toUpperCase()"/>
            <v-list-item-subtitle v-text="'Ciudad'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title v-text="persona.departamento && persona.departamento.toUpperCase()"/>
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
    persona: Object
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
