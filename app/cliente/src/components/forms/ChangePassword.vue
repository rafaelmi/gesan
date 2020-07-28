<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="title">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Password actual"
            type="password"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            required
            v-model="oldPassword"
          />
          <v-text-field
            label="Nuevo Password"
            type="password"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            required
            v-model="newPassword"
          />
          <v-text-field
            label="Repetir Nuevo Password"
            type="password"
            :rules="[
              (val => !!val || 'Este campo es obligatorio'),
              (val => val === newPassword || 'Las contraseñas deben coincidir')
            ]"
            required
            v-model="repeat"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="close">CERRAR</v-btn>
        <v-btn color="blue darken-1" text @click="save">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import mixUtils from '@/mixins/utils'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    value: Boolean,
    paciente: Object
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    oldPassword: null,
    newPassword: null,
    repeat: null,
    title: 'Cambiar Password'
    // icon: 'mdi-smart-card'
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

    args () {
      return {
        username: this.user.username,
        password: this.oldPassword,
        new: this.newPassword,
        repeat: this.repeat
      }
    },

    ...mapState([
      'user'
    ])

  },

  methods: {
    save () {
      if (this.$refs.form.validate()) {
        this.send({
          url: '/user/password',
          command: 'update',
          args: this.args
        }).then((result) => {
          this.$store.commit('success', result, { root: true })
        }).catch(() => {})
        this.close()
      }
    },

    close () {
      this.$refs.form.resetValidation()
      this.dialog = false
    },

    ...mapActions([
      'send'
    ])

  }

}
</script>
