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
            :items="[ '1', '2', '3', '4', '5', '6', '7' ]"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            label="Sala"
            required
            v-model="sala"
          />
          <v-select
            :items="[
              'URGENCIAS',
              'QUIRÓFANO',
              'TRASLADO',
              'UTI',
              'OTRO'
            ]"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            label="Orígen"
            required
            v-model="origen"
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

const namespace = 'internaciones'

export default {
  props: {
    value: Boolean,
    paciente: Object
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    sala: '1',
    seguro: 'PARTICULAR',
    origen: 'URGENCIAS',
    title: 'Nuevo Ingreso'
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
          sala: this.sala,
          seguro: this.seguro,
          origen: this.origen
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
