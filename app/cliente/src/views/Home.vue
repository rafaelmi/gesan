<template>
  <v-card
    class="mx-auto"
    max-width="900"
    color="green lighten-5"
  >
    <!--<v-card-text class="text-center display-1 font-weight-light blue--text text--darken-4">-->
      <v-row class="text-center display-1 font-weight-bold blue--text text--darken-4">
        <v-col cols="3" class="text-center my-auto">
          <v-img class="mx-4" src="../assets/logo-sanatorio-del-sur.jpg"/>
        </v-col>
        <v-col cols="9" class="my-auto">
          <v-row>
            <v-col class="text-center">
              Bienvenido(a) al Sitema de Gestión
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center">
              Sanatorio del Sur
            </v-col>
          </v-row>
        </v-col>
      </v-row>
  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  }
}
</script>
