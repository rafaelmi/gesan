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
    <v-tab-item
      v-for="(item, i) in tabs"
      :key="i"
      :value="item.to"
    >
      <v-card
        flat
        tile
        :color="item.color"
      >
        <v-card-text>
          <router-view></router-view>
        </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</div>
</template>

<script>

export default {
  props: {
    tabs: Array
  },

  data: () => ({
    barColor: 'blue darken-3',
    tab: null
  })
}
</script>
