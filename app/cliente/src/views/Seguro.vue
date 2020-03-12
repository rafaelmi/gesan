<template>
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
      :href="`#tab-${i}`"
    >
      {{ item.title }}
    </v-tab>

    <v-tab-item
      v-for="(item, i) in tabs"
      :key="i"
      :value="'tab-' + i"
    >
      <v-card
        flat
        tile
      >
        <v-card-text>
          <component :is="item.component"/>
        </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  components: {
    cmpContratos () { return import('@/components/seguro/Contratos.vue') },
    cmpAsegurados () { return import('@/components/seguro/Asegurados.vue') },
    cmpPagos () { return import('@/components/seguro/Pagos.vue') },
    cmpVisaciones () { return import('@/components/seguro/Visaciones.vue') },
    cmpPlanes () { return import('@/components/seguro/Planes.vue') }
  },

  data: () => ({
    barColor: 'blue darken-3',
    tab: null,
    tabs: [
      { title: 'CONTRATOS', component: 'cmpContratos' },
      { title: 'ASEGURADOS', component: 'cmpAsegurados' },
      { title: 'PAGOS', component: 'cmpPagos' },
      { title: 'VISACIONES', component: 'cmpVisaciones' },
      { title: 'PLANES', component: 'cmpPlanes' }
    ]
  })
}
</script>
