<template>
  <aside>
    <h3>Filtro:</h3>

    <template v-if="anos">
      <h5>Ano da publicação</h5>
      <div class="controle_filtro">
        <v-btn class="botao" color="roxo" :outlined="!isActive('filterby_ano', ano)"  x-small  v-for="(ano, i) in anos" :key="i"
          :to="{ name: 'dashboard-repositorio', query: { filterby_ano: `${ano}` } }" v-html="ano" />
      </div>
    </template>

    <template v-if="autores">
      <h5>Autores</h5>
      <div class="controle_filtro">
        <v-btn class="botao" color="roxo"  :outlined="!isActive('filterby_autor', autor)"  x-small v-for="(autor, i) in autores" :key="i"
          :to="{ name: 'dashboard-repositorio', query: { filterby_autor: autor } }" v-html="autor" />
      </div>
    </template>

    <template v-if="tags">
      <h5>Tags</h5>
      <div class="controle_filtro">
        <v-btn class="botao" color="roxo" :outlined="!isActive('filterby_tag', tag)" x-small v-for="(tag, i) in tags" :key="i"
          :to="{ name: 'dashboard-repositorio', query: { filterby_tag: tag } }" v-html="tag" />
      </div>
    </template>
  </aside>
</template>

<script>
export default {
  props: ['anos', 'autores', 'tags'],
  methods: {
    isActive(param, value) {
      return this.$route.query[param] == value;
    },
  }
};
</script>

<style scoped>
.controle_filtro {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 5px;
}
</style>