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
            <v-list-item :disabled="!item.to" link :key="i" :to="item.to || ''">
              <v-list-item-avatar>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-avatar>
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

      <v-snackbar v-model="alert.sw" :color="alert.color" top vertical>
        <v-container>
          <v-row>
            <v-icon dark>{{alert.icon}}</v-icon>
            <span class="title pl-1 font-weight-bold" :top="true" v-text="alert.title"/>
          </v-row>
          <v-row>
            <span class="title" :top="true" v-text="alert.details"/>
          </v-row>
        </v-container>
      </v-snackbar>

      <v-spacer></v-spacer>
      <template v-if="$store.getters.logged">
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
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    drawer: null,
    drawerItem: 0,
    barColor: 'blue darken-3',
    time: null,
    timerItervalId: null
  }),

  computed: {

    menuItems () {
      const permisos = this.permisos
      return [
        { title: 'Inicio', icon: 'mdi-home', to: '/home' },
        { title: 'Consulta Externa', icon: 'mdi-stethoscope', to: permisos && permisos.consultas && '/citas' },
        {
          title: 'Historial Médico',
          icon: 'mdi-account-details',
          to: this.user &&
            !this.user.perfiles.find(el => el === 'medico') &&
            permisos &&
            permisos.historial &&
            '/historial'
        },
        { title: 'Medisur', icon: 'mdi-shield-half-full', to: permisos && permisos.medisur && '/medisur/contratos' },
        { title: 'Farmacia', icon: 'mdi-pill', to: false },
        { title: 'Facturación', icon: 'mdi-receipt', to: false },
        { title: 'Tesorería', icon: 'mdi-cash-usd', to: false },
        { title: 'Reportes', icon: 'mdi-file-chart', to: permisos && permisos.reportes && '/reportes' }
      ]
    },

    disableApp () {
      return this.$route.name === 'Pantalla'
    },

    allowDrawer () {
      return true // this.$route.name !== 'Pantalla'
    },

    title () {
      return this.menuItems[this.drawerItem || 0].title
    },

    ...mapState([
      // alert: state => state.alert
      'alert',
      'user'
    ]),

    ...mapGetters([
      'permisos',
      'perfiles'
    ])

    /* time () {
       const date = new Date()
      return date.getHours() + ':' + date.getMinutes()
      return this.toTimestamp(new Date())
    } */
  }
}
</script>
