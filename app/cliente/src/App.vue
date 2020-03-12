<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item-group v-model="drawerItem">
          <template v-for="(item, i) in menuItems">
            <v-list-item :disabled="!item.to" link :key="i" :to="item.to">
              <v-list-item-action>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      :color="barColor"
      dark
      class="elevation-0"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ menuItems[drawerItem].title }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer
      :color="barColor"
      app
    >
      <!--<img src="@/assets/logo-sanatorio-del-sur.jpg"
        width="22px"
        height="auto"
      />-->
      <span class="white--text">Sanatorio del Sur | Sistema de Gestión Sanatorial</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    drawer: null,
    drawerItem: 0,
    barColor: 'blue darken-3',
    menuItems: [
      { title: 'Inicio', icon: 'mdi-home', to: '/' },
      { title: 'Seguro Médico', icon: 'mdi-shield-half-full', to: '/seguro' },
      { title: 'Farmacia', icon: 'mdi-pill', to: false },
      { title: 'Facturación', icon: 'mdi-receipt', to: false },
      { title: 'Tesorería', icon: 'mdi-cash-usd', to: false },
      { title: 'Historial Médico', icon: 'mdi-account-details', to: false },
      { title: 'Control de Citas', icon: 'mdi-calendar', to: false }
    ]
  })
}
</script>
