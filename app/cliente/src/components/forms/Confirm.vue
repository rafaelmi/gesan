<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template #activator="{ on }">
      <slot name="activator" :on="on"/>
    </template>
    <v-card>
      <v-card-title>
        <span class="title">{{ title }}</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">No</v-btn>
        <v-btn color="blue darken-1" text @click="$emit('confirmado')">Si</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    title: String
  },
  data: () => ({
    dialog: false
  })
}
</script>
