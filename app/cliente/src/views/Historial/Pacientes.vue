<template>
  <cmpTable v-bind="tableProps"/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

const namespace = 'historial'
const modulo = 'pacientes'

export default {
  components: {
    cmpTable () { return import('@/components/Table.vue') }
  },

  data: () => ({
  }),

  computed: {
    tableProps () {
      return {
        namespace,
        modulo,
        headers: [
          { value: 'cedula', text: 'Cédula', type: 'cedula', required: true, editable: false },
          { value: 'nombre', text: 'Nombre', type: 'nombre', required: true, editable: false },
          { value: 'nacimiento', text: 'Fecha de Nacimiento', type: 'fecha', required: true, editable: false, inTable: false },
          {
            value: 'sexo',
            text: 'Sexo',
            type: 'select',
            icon: 'mdi-gender-male-female',
            options: ['M', 'F'],
            required: true,
            editable: false
          },
          { value: 'direccion', text: 'Dirección', type: 'direccion', icon: 'mdi-map-marker', inTable: false },
          { value: 'telefono', text: 'Teléfono', type: 'telefono', icon: 'mdi-phone' },
          { value: 'ciudad', text: 'Ciudad', type: 'ciudad', icon: 'mdi-home-city', inTable: false },
          { value: 'departamento', text: 'Departamento', type: 'departamento', icon: 'mdi-city-variant', inTable: false }
        ],
        newTitle: 'Nuevo Paciente',
        externalItems: this.items,
        creable: true,
        sortBy: 'nombre',
        onClickRow: (item) => {
          this.selectPaciente(item._id)
          this.$router.push('ficha/' + item._id)
        }
      }
    },

    ...mapGetters(namespace, {
      items: 'pacientes'
    })
  },

  methods: {
    ...mapActions(namespace, [
      'selectPaciente'
    ])
  }
}
</script>
