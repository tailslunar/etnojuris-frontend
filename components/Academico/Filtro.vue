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

        <v-select v-model="filtrarPor.categoria" :items="categoria" label="Categoria" deletable-chips multiple chips
          small-chips outlined hide-details ref="categoriaSelect" @change="fecharMenu('categoriaSelect')"></v-select>

        <v-select v-model="filtrarPor.autoria" :items="autoria" label="Autoria" deletable-chips multiple chips
          small-chips outlined hide-details ref="autoriaSelect" @change="fecharMenu('autoriaSelect')"></v-select>

        <v-select v-model="filtrarPor.tags" :items="tags" label="Palavras-chaves" multiple deletable-chips chips
          small-chips outlined hide-details ref="tagsSelect" @change="fecharMenu('tagsSelect')"></v-select>

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
  props: ['categoria', 'autoria', 'tags'],
  data() {
    return {
      dialog: false,
      filtrarPor: {},
    }
  },

  methods: {
    changeDialog() {
      this.dialog = false
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
  /* display: grid;*/
  grid-template: 'header header' 'autor autor' 'tag tag' 'dt_i dt_f' 'footer footer' / 1fr 1fr;
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
</style>