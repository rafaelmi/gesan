<template>
  <v-dialog v-model="swDialog" fullscreen>
    <v-app id="inspire">
      <v-content>
        <v-container
          fluid
          fill-height
        >
          <v-layout
            align-center
            justify-center
          >
            <v-flex
              xs12
              sm8
              md4
            >
              <v-card class="elevation-12">
                <v-toolbar
                  color="primary"
                  dark
                  flat
                >
                  <v-toolbar-title>Ingresar</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      v-model="credentials.username"
                      label="Usuario"
                      name="login"
                      prepend-icon="mdi-account"
                      type="text"
                      @keyup.enter="send"
                    ></v-text-field>

                    <v-text-field
                      v-model="credentials.password"
                      label="Contraseña"
                      name="password"
                      prepend-icon="mdi-lock"
                      type="password"
                      @keyup.enter="send"
                    ></v-text-field>
                  </v-form>
                  <v-alert v-if="swAlert" dense text type="error">
                    <strong>{{error.title}}:</strong> {{error.details}}
                  </v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="send">ENVIAR</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </v-dialog>
</template>

<script>
import Api from '@/mixins/api'

// const API_URL = '/user'

export default {
  components: {
  },
  mixins: [
    Api
  ],
  data: () => ({
    swDialog: true,
    swAlert: false,
    credentials: {
      username: '',
      password: ''
    },
    error: {
      title: 'ERROR',
      details: ''
    }
  }),
  methods: {
    send () {
      this.$store.dispatch('login', this.credentials)
        .then(() => this.$router.replace(this.$store.state.nextRoute))
        .catch((error) => {
          this.error.details = error.message
          this.swAlert = true
        })
    }
  }
}
</script>
