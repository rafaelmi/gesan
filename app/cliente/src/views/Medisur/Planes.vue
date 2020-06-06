<template>
  <cmpTable v-bind="tableProps"/>
</template>

<script>
import { mapState } from 'vuex'

const namespace = 'medisur'

export default {
  components: {
    cmpTable () { return import('@/components/Table.vue') }
  },

  data: () => ({
    defaultProps: {
      namespace: namespace,
      headers: [
        { value: 'nombre', text: 'Plan', type: 'text', icon: 'mdi-format-list-checks' },
        { value: 'cuota', text: 'Cuota', type: 'dinero' },
        { value: 'adicional', text: 'Adicional', type: 'dinero' },
        { value: 'link', text: 'Cobertura', type: 'link' }
      ],
      items: [],
      newTitle: '',
      editTitle: 'Detalles Planes',
      sortBy: 'factura',
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
          onClickRow: (item) => window.location.assign(item.link)
          // onClickRow: (item) => this.$router.push('route/' + item.link)
        }
      )
    },

    ...mapState(namespace, {
      externalItems: 'planes'
    })

  },

  methods: {
  }
}
</script>
