<template>
  <c-ficha>
    <template v-for="(cama, i) in headers">
      <v-col :key="'col' + i" cols="12" sm="4" class="my-2 mx-0 px-2">
        <v-card
          width="100%"
          :key="i"
          :color="cama.color"
          class="elevation-4"
          @click="selectCama(cama)"
        >
          <v-card-title v-text="cama.titulo"/>
          <v-spacer/>
          <v-img
            :src="require('@/assets/' + cama.img)"
          />
          <v-spacer/>
        </v-card>
      </v-col>
    </template>
  </c-ficha>
</template>
<script>
import { mapGetters } from 'vuex'

const namespace = 'urgencias'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue')
  },

  data: () => ({
  }),

  computed: {
    headers () {
      return [
        { titulo: 'CAMA A', img: 'camilla.jpg', color: this.camas.cama_a ? 'red lighten-3' : 'green lighten-3', to: 'cama_a' },
        { titulo: 'CAMA B', img: 'camilla.jpg', color: this.camas.cama_b ? 'red lighten-3' : 'green lighten-3', to: 'cama_b' },
        { titulo: 'OBSERVACIÓN', img: 'monitor.jpg', color: this.camas.observacion ? 'red lighten-3' : 'green lighten-3', to: 'observacion' }
      ]
    },

    ...mapGetters(namespace, [
      'camas'
    ])
  },

  methods: {
    selectCama (cama) {
      this.$router.push(this.$route.path + '/' + cama.to)
    }
  }
}
</script>
