<template>
  <c-ficha>
    <c-ficha-card sm="8" titulo="INDICACIONES">
      <v-list shaped>
        <div
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-item>
            <v-list-item-icon>
              {{i + 1 + '.'}}
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset/>
        </div>
        <v-list-item
          :disabled="disable.create"
        >
          <v-list-item-content>
            <v-list-item-title>
              <c-forms-add
                :send="send"
                :_id="internacion._id"
                field="nuevo"
              />
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </c-ficha-card>
    <c-ficha-card sm="4" titulo="ACCIONES">
      <v-list shaped dense>
        <v-list-item
          :disabled="disable.save"
          @click="save"
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-content-save'" color="green"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'GUARDAR'"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :disabled="disable.clean"
          @click="clean"
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-delete'" color="red"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'BORRAR'"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </c-ficha-card>
  </c-ficha>
</template>
<script>
import { mapActions } from 'vuex'
import mixUtils from '@/mixins/utils'

const namespace = 'internaciones/indicaciones/nuevo'

export default {
  components: {
    'c-ficha': () => import('@/components/ficha/Ficha.vue'),
    'c-ficha-card': () => import('@/components/ficha/FichaCard.vue'),
    'c-forms-add': () => import('@/components/forms/inner/Add.vue')
  },

  mixins: [
    mixUtils
  ],

  props: {
    internacion: Object
  },

  data: () => ({
    titulo: 'NUEVO'
  }),

  computed: {
    disable () {
      return {
        create: this.internacion.estado === 'FINALIZADO',
        save: this.internacion.estado === 'FINALIZADO' || !this.items.length,
        clean: !this.items.length
      }
    },
    items () {
      const indicaciones = this.internacion.indicaciones || {}
      return indicaciones.nuevo || []
    }
  },

  methods: {
    save () {
      this.send({
        command: 'save',
        args: { _id: this.internacion._id }
      }).then(() => {
        this.$store.commit('success')
      })
    },

    clean () {
      this.send({
        command: 'delete',
        args: { _id: this.internacion._id }
      }).then(() => {
        this.$store.commit('success')
      })
    },

    ...mapActions(namespace, [
      'send'
    ])
  }
}

</script>
