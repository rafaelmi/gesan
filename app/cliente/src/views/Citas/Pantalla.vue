<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      class="elevation-0 display-1 font-weight-bold"
      prominent
    >
      <v-app-bar-title>Atención Médica</v-app-bar-title>
      <v-spacer></v-spacer>
      <div>
        {{time}}
      </div>
    </v-app-bar>

    <v-content>
      <v-card class="mx-0 elevation-0">
        <v-row>
          <v-col cols="6">
            <v-card
              class="mx-2 elevation-10"
              color="green lighten-5"
            >
              <!--<v-card-text class="text-center display-1 font-weight-light blue--text text--darken-4">-->
              <v-card-title class="text-center white">
                <v-img :src="require('@/assets/logo-sanatorio-del-sur.jpg')"/>
                <v-list>
                  <v-list-item>
                    <v-list>
                      <v-list-item>
                        <v-col cols="12" class="display-1 font-weight-bold">
                          Sanatorio del Sur
                        </v-col>
                      </v-list-item>
                      <v-list-item>
                        <v-col cols="12" class="headline font-italic">
                          "Un excelente servicio para tu salud"
                        </v-col>
                      </v-list-item>
                    </v-list>
                  </v-list-item>
                </v-list>
              </v-card-title>

                <v-row class="text-center blue--text text--darken-4">
                  <v-col cols="8" class="my-auto text-left">
                      <v-list
                        dense
                        color="transparent"
                      >
                        <v-list-item two-line>
                          <v-list-item-avatar>
                            <v-icon v-text="'mdi-phone'" color="indigo"/>
                          </v-list-item-avatar>
                          <v-list-item-content>
                              <v-list-item-title class="title blue--text text--darken-4" v-text="'(021) 574 418'"/>
                              <v-list-item-subtitle v-text="'Teléfono'"/>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon v-text="'mdi-whatsapp'" color="green darken-2"/>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title class="title blue--text text--darken-4" v-text="'(0985) 186 192'"/>
                            <v-list-item-subtitle v-text="'Whatsapp'"/>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon v-text="'mdi-email'" color="indigo"/>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title class="title blue--text text--darken-4" v-text="'sanatoriodelsur10@Gmail.com'"/>
                            <v-list-item-subtitle v-text="'e-mail'"/>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon v-text="'mdi-map-marker'" color="red"/>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title class="title blue--text text--darken-4" v-text="'RUTA 1 - KM 14,5 - SAN LORENZO'"/>
                            <v-list-item-subtitle v-text="'Dirección'"/>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                  </v-col>
                  <v-col cols="4" class="text-center my-auto">
                    <v-row class="mx-4 my-0">
                      <v-img :src="require('@/assets/Sanasur_Business_Card.png')"/>
                    </v-row>
                  </v-col>
                </v-row>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-data-table
              :headers="headers"
              :items="items"
              :sort-by="sortBy"
              class="elevation-1 title font-weight-bold mx-2"
              dark=false
              hide-default-footer
              items-per-page="100"
            >
            </v-data-table>
            <v-dialog :value="dialog" max-width="800">
              <v-toolbar
                class="mb-2"
                color="primary"
                dark
                flat
              >
                <v-toolbar-title class="text-left display-1 font-weight-bold">Presentarse a Consulta</v-toolbar-title>
              </v-toolbar>
              <v-list shaped>
                <v-list-item
                  v-for="call in llamados"
                  :key="call._id"
                >
                  <v-card
                   class="mx-auto my-2"
                   raised
                   width="100%"
                  >
                    <v-row class="mx-auto">
                      <v-col class="text-left display-1 font-weight-bold">
                        {{call.nombre}}
                      </v-col>
                      <v-spacer/>
                      <v-col class="">
                        <v-card>
                          <v-row>
                            <v-col class="text-center display-4 font-weight-bold">
                              {{call.consultorio}}
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="text-center headline">
                              CONSULTORIO
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                    </v-row>
                    <audio autoplay>
                      <source :src="require('@/assets/call.mp3')" type="audio/mp3"/>
                    </audio>
                  </v-card>
              </v-list-item>
            </v-list>
              <!-- <v-card>
                <v-card-title>
                  FAVOR DIRIGIRSE AL CONSULTORIO
                </v-card-title>
                <v-list>

                </v-list>
              </v-card> -->
            </v-dialog>
          </v-col>
        </v-row>
      </v-card>
    </v-content>
    <v-footer
      color="primary"
      app
    >
      <span class="white--text">Sanatorio del Sur | Sistema de Gestión Sanatorial</span>
    </v-footer>
  </v-app>
</template>
<script>
import mixUtils from '@/mixins/utils'
import { mapState } from 'vuex'

const namespace = 'consultas'

export default {
  components: [
  ],

  mixins: [
    mixUtils
  ],

  data: () => ({
    headers: [
      { value: 'nombre', text: 'PACIENTE', width: '70%', class: 'headline font-weight-bold' },
      { value: 'consultorio', text: 'CONSULTORIO', align: 'right', class: 'headline font-weight-bold' }
    ],
    time: null
  }),

  computed: {
    items () {
      const list = this.consultas.filter(el => el.estado === 'CONSULTANDO')
      list.forEach(el => { el.nombre = el.nombre.toUpperCase() })
      return list
    },

    llamados () {
      return this.items.filter(el => el.llamar)
    },

    dialog () {
      return !!this.llamados.length
    },

    ...mapState(namespace, {
      consultas: 'consultas'
    })
  },

  created () {
    this.timerItervalId = setInterval(() => {
      this.time = this.toTimestamp(new Date())
    }, 1000)
  },

  beforeDestroy () {
    clearInterval(this.timerItervalId)
  }
}
</script>
