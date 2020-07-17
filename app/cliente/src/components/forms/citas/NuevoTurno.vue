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
          <v-select v-if="type === 'consulta'"
            label="Médico"
            :items="medicos.map(el => el.nombre)"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            required
            v-model="medico"
          />
          <v-text-field
            label="Seguro Médico"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            required
            v-model="seguro"
          />
          <v-select v-if="type === 'consulta'"
            :items="[ 1, 2, 3 ]"
            :rules="[(val => !!val || 'Este campo es obligatorio')]"
            label="Consultorio"
            required
            v-model="consultorio"
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
import { mapGetters, mapActions } from 'vuex'

const namespace = 'consultas'

export default {
  props: {
    value: Boolean,
    paciente: Object,
    type: {
      type: String,
      default: 'consulta'
    }
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    medico: '', // 'Justo Melgarejo',
    consultorio: 1,
    seguro: 'PARTICULAR',
    title: 'Nueva Consulta'
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
      const medico = this.medicos.find(el => el.nombre === this.medico)
      const res = Object.assign({}, this.paciente,
        {
          tipo: this.type,
          medico: medico ? medico._id : 'urgencias', // medico && medico._id,
          consultorio: this.type === 'urgencia' ? 'URGENCIAS' : this.consultorio,
          seguro: this.seguro
        }
      )
      delete res._id
      delete res.historial
      return res
    },

    ...mapGetters([
      'medicos'
    ])
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
