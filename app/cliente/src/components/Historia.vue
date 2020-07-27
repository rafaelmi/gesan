<template>
  <v-col cols="12">
    <v-card v-for="(header, key) in editedHeaders"
      :key="key"
      elevation="1"
      width="100%"
      class="mb-1"
    >
      <v-subheader v-text="header.titulo"/>
      <div class="mx-4">
        <v-row v-for="(child, childKey) in header.children"
          :key="childKey"
          no-gutters
        >
            <v-text-field v-if="child.type === 'textfield'"
              v-model="editedItem[key][childKey]"
              :label="child.titulo"
              outlined
              :readonly="disable.editar"
              @blur="save"
            />
            <v-textarea v-else-if="child.type === 'textarea'"
              v-model="editedItem[key][childKey]"
              :label="child.titulo"
              auto-grow
              :clearable="!disable.editar"
              outlined
              :rows="child.rows"
              :readonly="disable.editar"
              @blur="save"
            />
            <v-checkbox v-if="child.checkbox"
              v-model="editedItem[key]['realizado'][childKey]"
              class="ml-2"
              color="green"
              @change="saveRealizado"
            ></v-checkbox>
        </v-row>
      </div>
    </v-card>
  </v-col>
</template>
<script>
import mixUtils from '@/mixins/utils'
import { mapActions } from 'vuex'

const namespace = 'consultas'

export default {
  components: {
    // 'c-ficha-card': () => import('@/components/ficha/FichaCard.vue')
  },

  props: {
    consulta: Object
  },

  mixins: [
    mixUtils
  ],

  data: () => ({
    sending: false,
    editedHeaders: {
      historia: {
        titulo: 'HISTORIA CLÍNICA',
        children: {
          motivo: { titulo: 'MOTIVO DE CONSULTA', type: 'textarea', rows: 1 },
          aea: { titulo: 'A.E.A.', type: 'textarea', rows: 1 },
          efisico: { titulo: 'EXAMEN FÍSICO', type: 'textarea' },
          dxpresuntivo: { titulo: 'Dx. PRESUNTIVO', type: 'textarea', rows: 1 },
          tratamiento: { titulo: 'TRATAMIENTO', type: 'textarea', rows: 1 },
          observaciones: { titulo: 'OBSERVACIONES', type: 'textarea' }
        }
      },
      estudios: {
        titulo: 'ESTUDIOS',
        children: {
          laboratorios: { titulo: 'LABORATORIOS', type: 'textarea', rows: 1, checkbox: true },
          ecografias: { titulo: 'ECOGRAFÍAS', type: 'textarea', rows: 1, checkbox: true },
          rayosx: { titulo: 'RAYOS X', type: 'textarea', rows: 1, checkbox: true },
          tac: { titulo: 'T.A.C.', type: 'textarea', rows: 1, checkbox: true },
          otros: { titulo: 'OTROS', type: 'textarea', rows: 1, checkbox: true },
          observaciones: { titulo: 'OBSERVACIONES', type: 'textarea' }
        }
      }
    }
  }),

  computed: {
    editedItem () {
      const res = {}
      for (const [key, val] of Object.entries(this.editedHeaders)) {
        const children = Object.keys(val.children)
        res[key] = Object.assign(
          Object.fromEntries(children.map(el => [el, null])),
          { realizado: Object.fromEntries(children.filter(el => val.children[el].checkbox).map(el => [el, null])) },
          this.consulta[key]
        )
      }
      return Object.assign(res, { _id: this.consulta._id })
    },

    disable () {
      return {
        editar: this.sending || this.consulta.estado !== 'CONSULTANDO'
      }
    }
  },

  methods: {
    save () {
      if (!this.disable.editar) {
        this.sending = true
        return this.send({
          command: 'update',
          args: this.editedItem
        }).then(() => {
          this.sending = false
        })
      }
    },

    saveRealizado () {
      this.sending = true
      return this.send({
        command: 'update',
        args: this.editedItem
      }).then(() => {
        this.sending = false
      })
    },

    ...mapActions(namespace, [
      'send'
    ])
  }
}
</script>
