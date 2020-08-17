<template>
  <c-ficha-card
    titulo="ACCIONES"
  >
    <v-list shaped dense>
      <v-list-item
        @click="$router.push('/internaciones/id/' + id)"
      >
        <v-list-item-icon>
          <v-icon v-text="'mdi-history'"/>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="'VER DETALLES'"/>
        </v-list-item-content>
      </v-list-item>
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
    id: String
  },

  data: () => ({
  }),

  computed: {
  }
}
</script>
