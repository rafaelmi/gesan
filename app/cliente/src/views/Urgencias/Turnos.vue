<template>
  <c-table v-bind="tableProps"/>
</template>

<script>
import { mapState } from 'vuex'

const namespace = 'urgencias'

export default {

  components: {
    'c-table': () => import('@/components/Table.vue')
  },

  props: {
  },

  data: () => ({
  }),

  computed: {
    tableProps () {
      return Object.assign(
        {
          headers: [
            { value: 'nombre', text: 'Paciente', type: 'nombre' },
            { value: 'cedula', text: 'Cédula', type: 'cedula' },
            { value: 'cama', text: 'Cama' },
            { value: 'estado', text: 'Estado' },
            { value: 'fecha', text: 'Fecha/hora', type: 'fecha' }
          ],
          sortBy: 'fecha',
          sortDesc: true,
          creable: false,
          editable: false,
          borrable: false,
          externalItems: this.externalItems,
          onClickRow: (item) => {
            this.$router.push('/urgencias/turnos/' + item._id)
          }
        }
      )
    },

    externalItems () {
      return this.urgencias
    },

    ...mapState(namespace, [
      'urgencias'
    ])

  },

  methods: {
  }
}
</script>
