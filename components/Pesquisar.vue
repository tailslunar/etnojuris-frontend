<template>
    <div class="pesquisar" :class="isHeght">
      <v-select :items="items" :label="items[0]" outlined></v-select>
      <v-text-field
        label="Digite o nº do processo, nome da parte, localidade ou jurisdição:"
        outlined
      ></v-text-field>
      <v-btn x-large depressed class="botao" color="amarelo_mostarda">
        <v-icon>mdi-magnify</v-icon>
        Buscar
      </v-btn>
    </div>
  </template>
  
  <script>
  export default {
    data: () => ({
      items: ["Nº Processo", "Parte", "Localidade", "Jurisdição"],
    }),
    computed: {
      isHeght() {
        return this.$vuetify.breakpoint.name;
      },
    },
  };
  </script>
  
  <style scoped>
  .pesquisar{
      font-family: var(--font-featured);
      display: grid;
      grid-template: ". . ." / minmax(20px, 210px) 1fr minmax(20px, 120px);
      gap: 15px;
    }
    .pesquisar:is(.xl, .lg, .md){
      padding: 0px 140px;
    }
  </style>