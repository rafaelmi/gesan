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
      :to="'/citas/' + item.to"
    >
    <!--:to="'/citas/' + item.to"-->
      {{ item.title }}
    </v-tab>
    <v-tab-item
      v-for="(item, i) in tabs"
      :key="i"
      :value="'/citas/' + item.to"
    >
    <!--:value="'/citas/' + item.to" -->
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
  <!--<v-slide-x-transition>
    <router-view></router-view>
  </v-slide-x-transition>-->
</div>
</template>

<script>

export default {
  components: {
  },

  data: () => ({
    barColor: 'blue darken-3',
    tab: null,
    tabs: [
      { title: 'CONSULTORIO', to: 'consultorio/index' },
      { title: 'TURNOS', to: 'turnos' }
      // { title: 'PANTALLA', to: 'pantalla' } // , color: 'primary' }
    ]
  }),

  computed: {
    showTabs () {
      return this.$route.name !== 'Pantalla'
    }
  },

  created () {
    if (this.$route.name === 'Citas') {
      // this.tab = '/citas/' + this.tabs[0].to
      this.$router.replace('/citas/' + this.tabs[0].to)
      // this.$router.replace(this.tabs[0].to)
    }
  }

}
</script>
