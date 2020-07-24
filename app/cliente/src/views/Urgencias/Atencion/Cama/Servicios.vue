<template>
  <c-ficha-card
    titulo="SERVICIOS Y MEDICAMENTOS"
    sm="8"
  >
    <v-list shaped>
      <div
        v-for="(servicio, i) in servicios"
        :key="i"
      >
        <v-list-item>
          <v-list-item-icon>
            {{i + 1 + '.'}}
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="servicio"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider inset/>
      </div>
      <v-list-item
        :disabled="disable.add"
      >
        <v-list-item-content>
          <v-list-item-title>
            <v-text-field
              v-model="newService"
              :disabled="sending"
              :loading="sending"
              :error-messages="newServiceError"
              label="AGREGAR"
              prepend-icon="mdi-plus"
              :append-outer-icon="newService.length && 'mdi-send'"
              clearable
              @click:append-outer="onAdd"
              @keyup.enter="onAdd"
            />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </c-ficha-card>
</template>
<script>
import { mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'urgencias'

export default {
  components: {
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
    cama: Object
  },

  data: () => ({
    accion: null,
    items: [],
    sending: false,
    newService: '',
    newServiceError: null
  }),

  computed: {
    urgencia () {
      return this.cama
    },

    servicios () {
      return this.urgencia.servicios || []
    },

    disable () {
      return {
        add: this.urgencia.estado === 'FINALIZADO'
      }
    }
  },

  methods: {
    onAdd () {
      if (this.newService.length) {
        this.sending = true
        this.addService({
          urgencia: this.urgencia,
          servicio: this.newService
        })
          .then(() => {
            this.sending = false
            this.newService = ''
          })
      }
    },

    save () {
      if (!this.disable.editar) {
        return this.send({
          command: 'update',
          args: this.editedItem
        })
      }
    },

    ...mapActions(namespace, [
      'send',
      'addService',
      'finishConsulta'
    ])
  }
}

</script>
