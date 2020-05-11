<template>
  <cmpTable v-bind="tableProps">
    <template v-slot:top>
      <v-btn
        color="primary"
        dark class="mb-2 mx-2"
        @click="startPantalla"
      >
        PANTALLA
      </v-btn>
    </template>
  </cmpTable>
</template>

<script>
import { mapState } from 'vuex'

const namespace = 'consultas'

export default {

  components: {
    cmpTable () { return import('@/components/Table.vue') }
  },

  data: () => ({
    defaultProps: {
      // apiUrl: '/consultas',
      namespace: namespace,
      headers: [
        // { value: 'turno', text: 'Turno', type: 'id', icon: 'mdi-counter', creable: false, editable: false },
        { value: 'nombre', text: 'Paciente', type: 'nombre', required: true, editable: false },
        { value: 'cedula', text: 'Cédula', type: 'cedula', required: true, editable: false },
        {
          value: 'consultorio',
          text: 'Consultorio',
          type: 'select',
          icon: 'mdi-door-closed',
          options: [...Array(5).keys()].map(x => x + 1),
          required: true,
          editable: false
        },
        /* {
          value: 'letra',
          text: 'Letra',
          type: 'select',
          icon: 'mdi-counter',
          options: [...Array(26).keys()].map(i => String.fromCharCode(i + 65)),
          default: 'A',
          required: true,
          editable: false,
          inTable: false
        }, */
        { value: 'estado', text: 'Estado', type: 'text', creable: false, editable: false },
        { value: 'fecha', text: 'Fecha/hora', type: 'fecha', creable: false, required: false, editable: false }
        // { value: 'valor', text: 'Valor de Consulta', type: 'dinero', creable: true, editable: true, required: false }
      ],
      newTitle: 'Nuevo Turno',
      editTitle: 'Detalles Turno',
      sortBy: 'fecha',
      editable: false,
      borrable: false
    }
  }),

  computed: {
    tableProps () {
      return Object.assign(
        {},
        this.defaultProps,
        {
          externalItems: this.externalItems,
          onClickRow: (item) => this.$router.push('/citas/consulta/' + item._id)
        }
      )
    },

    ...mapState(namespace, {
      externalItems: 'consultas'
    })

  },

  methods: {
    startPantalla () {
      // window.open(window.location.replace('/#/', '/#/citas/pantalla'))
      window.open(
        window.location.href.replace(this.$route.path, '/citas/pantalla'),
        '',
        'menubar=no,scrollbars=no,location=no,toolbar=no,status=no'
      )
    }
  }
}
</script>
