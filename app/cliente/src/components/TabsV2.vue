<template>
  <div>
    <v-tabs
      v-model="tab"
      :background-color="barColor"
      class="elevation-0"
      dark
      grow=""
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab
        v-for="(item, i) in tabs"
        :key="i"
        :to="item.to"
      >
        {{ item.title }}
      </v-tab>
    </v-tabs>
    <v-card
      flat
      tile
    >
      <v-card-text>
        <router-view></router-view>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

export default {
  props: {
    tabs: Array,
    value: Number
  },

  data: () => ({
    barColor: 'blue darken-3'
    // tab: null
  }),

  computed: {
    tab: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
