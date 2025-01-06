<template>
  <v-dialog persistent v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn depressed class="botao" color="bege_sombrio" v-bind="attrs" v-on="on"><v-icon>mdi-filter-variant</v-icon>
        Filtrar</v-btn>
    </template>
    <template v-slot:default="dialog">
      <div class="filtros">
        <header>
          Filtros
          <v-btn icon @click.prevent="changeDialog()" class="close"><v-icon>mdi-close</v-icon></v-btn>
        </header>

        <v-select v-model="filtrarPor.nivel" :items="nivel" label="Nível" deletable-chips multiple chips small-chips
          outlined hide-details ref="nivelSelect" @change="fecharMenu('nivelSelect')"></v-select>

        <v-select v-model="filtrarPor.orgao" :items="orgao" label="Órgão" deletable-chips multiple chips
          small-chips outlined hide-details ref="orgaoSelect" @change="fecharMenu('orgaoSelect')"></v-select>

        <v-select v-model="filtrarPor.tags" :items="tags" label="Palavras-chaves" multiple deletable-chips chips
          small-chips outlined hide-details ref="tagsSelect" @change="fecharMenu('tagsSelect')"></v-select>

        <v-menu ref="menu0" v-model="open[0].menu" :close-on-content-click="false" :nudge-right="40"
          transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="dataInicioControle" label="Data Inicial:" readonly v-bind="attrs" v-on="on" outlined
              hide-details prepend-inner-icon="mdi-calendar-month-outline" />
          </template>
          <v-date-picker v-model="filtrarPor.dt_inicio" no-title @input="updateDataInicio" :max="open[1].data" />
        </v-menu>

        <v-menu ref="menu1" v-model="open[1].menu" :close-on-content-click="false" :nudge-right="40"
          transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="dataFinalControle" label="Data Final:" readonly v-bind="attrs" v-on="on" outlined
              hide-details prepend-inner-icon="mdi-calendar-month-outline" />
          </template>
          <v-date-picker v-model="filtrarPor.dt_fim" no-title @input="updateDataFinal" :min="open[0].data" />
        </v-menu>

        <footer>
          <v-btn class="botao" color="roxo" text @click.prevent="changeDialog()">Cancelar</v-btn>
          <v-btn class="botao" color="roxo" depressed dark @click.prevent="enviarFiltro()">Filtrar</v-btn>
        </footer>
      </div>
    </template>
  </v-dialog>
</template>

<script>
export default {
  props: ['nivel', 'orgao', 'tags'],
  data() {
    return {
      dialog: false,
      filtrarPor: {},
      open: [
        { data: null, menu: false },
        { data: null, menu: false },
      ]
    }
  },
  computed: {
    dataInicioControle() {
      return this.filtrarPor.dt_inicio ? this.$moment(this.filtrarPor.dt_inicio).format('DD/MM/YYYY') : ''
    },
    dataFinalControle() {
      return this.filtrarPor.dt_fim ? this.$moment(this.filtrarPor.dt_fim).format('DD/MM/YYYY') : ''
    },
  },
  methods: {
    changeDialog() {
      this.dialog = false
    },
    updateDataInicio(val) {
      this.open[0].data = this.$moment(val).format('YYYY-MM-DD')
      this.open[0].menu = false
    },
    updateDataFinal(val) {
      this.open[1].data = this.$moment(val).format('YYYY-MM-DD')
      this.open[1].menu = false
    },
    enviarFiltro() {
      let { query } = this.$route
      let filterBy = JSON.stringify(this.filtrarPor)
      this.$router.push({ query: { ...query, filterBy } });
      this.dialog = false
      this.filtrarPor = {}
    },
    fecharMenu(refName) {
      this.$refs[refName].blur(); // Fecha o menu do v-select usando a referência
    }
  }
};
</script>


<style scoped>
.filtros {
  background: white;
  font-family: var(--font-featured);
  display: grid;
  grid-template: 'header header' 'dois dois' 'tres tres' 'quatro quatro' 'seis oito' 'footer footer' / 1fr 1fr;
}

.filtros>* {
  padding: 15px;
}

.filtros>*:first-child {
  grid-area: header;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 900;
  color: var(--v-roxo-base);
}

.filtros .close {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.filtros>*:last-child {
  grid-area: footer;
  display: flex;
  gap: 15px;
  justify-content: flex-end;

}

.filtros>*:nth-child(2) {
  grid-area: dois;
}

.filtros>*:nth-child(3) {
  grid-area: tres;
}

.filtros>*:nth-child(4) {
  grid-area: quatro;
}

.filtros>*:nth-child(6) {
  grid-area: seis;
}

.filtros>*:nth-child(8) {
  grid-area: oito;
}
</style>