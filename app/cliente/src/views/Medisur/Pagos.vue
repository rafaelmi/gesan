<template>
  <cmpTable v-bind="tableProps"/>
</template>

<script>
import { mapGetters } from 'vuex'

const namespace = 'medisur'

export default {
  components: {
    cmpTable () { return import('@/components/Table.vue') }
  },

  data: () => ({
    defaultProps: {
      apiUrl: '/seguro/pagos',
      headers: [
        { value: '_id', text: 'Factura No.', type: 'factura', required: true },
        { value: 'contrato', text: 'Contrato', type: 'id', required: true },
        { value: 'fecha', text: 'Fecha', type: 'onlyFecha', required: true },
        { value: 'monto', text: 'Monto', type: 'dinero', required: true }
      ],
      items: [],
      sortBy: '_id',
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
          onClickRow: (item) => this.$router.push('/medisur/contrato/' + item.contrato)
        }
      )
    },

    ...mapGetters(namespace, {
      externalItems: 'pagos'
    })
  },

  methods: {
  }
}
</script>
