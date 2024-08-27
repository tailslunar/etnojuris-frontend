<template>
  <div class="pesquisar" :class="isHeght">
    <v-select v-model="item" :items="items" item-text="label" item-value="value" label="Selecione um filtro"
      outlined></v-select>

    <template v-if="item == 'numero'">
      <v-text-field label="Digite o nº do processo, nome da parte, localidade ou jurisdição:" clearable
        @click:clear="limparBuscar" v-mask='"#######-##.####.#.##.####"' v-model="query" outlined></v-text-field>
    </template>

    <template v-else>
      <v-text-field label="Digite o nº do processo, nome da parte, localidade ou jurisdição:" v-model="query" clearable
        @click:clear="limparBuscar" outlined></v-text-field>
    </template>

    <v-btn x-large depressed class="botao" color="amarelo_mostarda" @click="buscar">
      <v-icon>mdi-magnify</v-icon>
      Buscar
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { label: "Nº Processo", value: "numero", mask: "#######-##.####.#.##.####" },
      { label: "Parte", value: "parte", mask: false },
      { label: "Localidade", value: "localidade", mask: false },
      //{ label: "Jurisdição", value: "jurisdicao", mask: false }
    ],
    item: "numero",
    query: "",
  }),
  computed: {
    isHeght() {
      return this.$vuetify.breakpoint.name;
    },
  },
  methods: {
    buscar() {
      this.$emit('update_filterby', { filterby: this.item, query: this.query })
    },
    limparBuscar() {
      this.$emit('update_filterby', { filterby: this.item, query: '' })
    },
  },
};
</script>

<style scoped>
.pesquisar {
  font-family: var(--font-featured);
  display: grid;
  grid-template-columns: minmax(20px, 210px) 1fr minmax(20px, 120px);
  gap: 15px;
}

.pesquisar:is(.xl, .lg, .md) {
  padding: 0 140px;
}
</style>
