<template>
  <c-table v-bind="tableProps"/>
</template>

<script>
import { mapGetters } from 'vuex'

const namespace = 'consultas'

export default {

  components: {
    'c-table': () => import('@/components/Table.vue')
  },

  props: {
    type: {
      type: String,
      default: 'consultas'
    }
  },

  data: () => ({
    defaultProps: {
      // apiUrl: '/consultas',
      namespace: namespace,
      headers: [
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
        { value: 'estado', text: 'Estado', type: 'text', creable: false, editable: false },
        { value: 'fecha', text: 'Fecha/hora', type: 'fecha', creable: false, required: false, editable: false }
        // { value: 'valor', text: 'Valor de Consulta', type: 'dinero', creable: true, editable: true, required: false }
      ],
      newTitle: 'Nuevo Turno',
      editTitle: 'Detalles Turno',
      sortBy: 'fecha',
      sortDesc: true,
      creable: false,
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
          onClickRow: (item) => {
            const modulo = (this.type === 'urgencias') ? 'urgencias' : 'citas'
            this.$router.push('/' + modulo + '/consulta/' + item._id)
          }
        }
      )
    },

    externalItems () {
      return this[this.type]
    },

    ...mapGetters(namespace, [
      'consultas',
      'urgencias'
    ])

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
