<template>
  <router-view v-if="disableApp"/>
  <v-app v-else>
    <v-navigation-drawer v-if="allowDrawer"
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
      <v-app-bar-nav-icon v-if="allowDrawer"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="$store.state.logged">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              v-on="on"
            >
              <v-icon>mdi-account</v-icon>
              <span class="text-lowercase px-0">
                {{$store.state.user.username}}
              </span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              @click="$router.push('/logout')"
            >
              <v-list-item-title>Salir</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn
          text
          @click="$router.push('/login')"
        >
          <v-icon>mdi-login</v-icon>
          Ingresar
        </v-btn>
      </template>
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
      { title: 'Consulta Externa', icon: 'mdi-calendar', to: '/citas' },
      { title: 'Seguro Médico', icon: 'mdi-shield-half-full', to: false }, // to: '/seguro' },
      { title: 'Farmacia', icon: 'mdi-pill', to: false },
      { title: 'Facturación', icon: 'mdi-receipt', to: false },
      { title: 'Tesorería', icon: 'mdi-cash-usd', to: false },
      { title: 'Historial Médico', icon: 'mdi-account-details', to: false }
    ],
    time: null,
    timerItervalId: null
  }),

  computed: {
    disableApp () {
      return this.$route.name === 'Pantalla'
    },
    allowDrawer () {
      return true // this.$route.name !== 'Pantalla'
    },
    title () {
      return this.menuItems[this.drawerItem].title
    }
    /* time () {
       const date = new Date()
      return date.getHours() + ':' + date.getMinutes()
      return this.toTimestamp(new Date())
    } */
  }
}
</script>
