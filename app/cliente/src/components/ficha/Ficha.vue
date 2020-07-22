<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="700"
    >
      <v-card
        color="green lighten-5"
        class="mb-1"
        elevation="1"
      >
        <v-card-title v-if="titulo"
          class="text-center blue--text text--darken-4"
        >
          <v-spacer/>{{ titulo }}<v-spacer/>
        </v-card-title>
      </v-card>
      <v-row no-gutters>
        <slot/>
      </v-row>
    </v-card>
  </div>
</template>
<script>

export default {
  components: {
  },

  mixins: [
  ],

  props: {
    titulo: String
  },

  data: () => ({
  }),

  computed: {

  },

  methods: {
  }
}
</script>
