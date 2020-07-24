<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="title">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Paciente"
            :value="args.nombre"
            disabled
          />
          <v-text-field
            label="Cédula"
            :value="args.cedula"
            :messages="toMilSeparator(args.cedula)"
            disabled
          />
          <v-text-field
            label="Seguro Médico"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            required
            v-model="seguro"
          />
          <v-select
            :items="[ 'cama_a', 'cama_b', 'observacion' ]"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            label="Cama"
            required
            v-model="cama"
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
import { mapActions } from 'vuex'

const namespace = 'urgencias'

export default {
  props: {
    value: Boolean,
    paciente: Object,
    type: {
      type: String,
      default: 'urgencia'
    }
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    cama: 'cama_a',
    seguro: 'PARTICULAR',
    title: 'Nueva Urgencia'
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
      const res = Object.assign({}, this.paciente,
        {
          cama: this.cama,
          seguro: this.seguro
        }
      )
      delete res._id
      delete res.historial
      return res
    }
  },

  methods: {
    save () {
      if (this.$refs.form.validate()) {
        this.send({
          command: 'create',
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

    ...mapActions(namespace, [
      'send'
    ])
  }
}
</script>
