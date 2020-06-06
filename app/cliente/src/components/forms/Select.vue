<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template #activator="{ on }">
      <slot name="activator" :on="on"/>
    </template>
    <v-card>
      <v-card-title>
        <span class="title">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-select
            :items="itemValues"
            :label="label"
            :prepend-icon="icon"
            required
            v-model="selected"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="dialog = false">CERRAR</v-btn>
        <v-btn color="blue darken-1" text @click="$emit('success', selected); dialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    title: String,
    label: String,
    items: Array,
    icon: String,
    value: Boolean
  },
  data: () => ({
    selected: null
  }),

  computed: {
    dialog: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    itemValues () {
      return this.items.map(el => el.value)
    }
  }
}
</script>
