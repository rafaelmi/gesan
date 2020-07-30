<template>
  <c-ficha>
    <template v-for="(sala, i) in headers">
      <v-col :key="'col' + i" cols="12" sm="4" class="my-2 mx-0 px-2">
        <v-card
          width="100%"
          :key="i"
          class="elevation-4"
          @click="selectSala(sala)"
        >
          <v-card-title
            :class="sala.color"
            v-text="'SALA ' + sala.id"
          />
          <v-spacer/>
          <v-img
            :src="require('@/assets/sala.png')"
          />
          <v-spacer/>
        </v-card>
      </v-col>
    </template>
  </c-ficha>
</template>

<script>
import { mapGetters } from 'vuex'

const namespace = 'internaciones'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue')
  },

  data: () => ({
  }),

  computed: {
    headers () {
      const headers = []
      for (let i = 1; i < 5; i++) {
        headers.push({
          id: i,
          color: this.salas[i] ? 'red lighten-3' : 'green lighten-3',
          to: 'sala/' + i
        })
      }
      return headers
    },

    ...mapGetters(namespace, [
      'salas'
    ])
  },

  methods: {
    selectSala (sala) {
      this.$router.push(this.$route.path + '/' + sala.to)
    }
  }

}
</script>
