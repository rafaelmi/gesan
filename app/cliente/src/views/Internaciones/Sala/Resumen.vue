<template>
  <v-list dense>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title v-text="paciente"/>
        <v-list-item-subtitle v-text="'PACIENTE'"/>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    paciente: String
  }
}
</script>
