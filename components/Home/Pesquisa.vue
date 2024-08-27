<template>
  <section :class="isHeght">
    <header>Pesquisas</header>
    <main>
      <article v-for="(artigo, i) in artigos" :key="i">
        <NuxtLink :to="{name: 'dashboard-repositorio-artigo', params: { artigo: artigo.id }}" class="h1">{{ artigo.titulo | artigoTitulo }}</NuxtLink>
        <div>{{artigo.conteudo | artigoConteudo}}</div>
      </article>
    </main>
    <footer>
      <v-btn :to="{name:'dashboard-repositorio'}" class="botao lexend vejaMais" color="azul_turquesa" depressed>
        Ver mais pesquisas
      </v-btn>
    </footer>
  </section>
</template>

<script>
export default {
  data() {
    return {
      repositorios: [],
    };
  },
  computed: {
    isHeght() {
      return this.$vuetify.breakpoint.name;
    },
    artigos(){
      return this.repositorios.sort((a, b) => b.id - a.id).slice(0, 3);
    }
  },
  filters: {
    artigoTitulo( title ){
      let palavras = title.split(" ")
      for(let i =0; i < palavras.length; i++){
        palavras[i] = palavras[i][0].toUpperCase() + palavras[i].substr(1).toLowerCase()
      }
      return palavras.join(" ")
    },
    artigoConteudo(content) {
      return content.length > 300 ? content.slice(0, 300) + '...' : content;
    },
  },
  mounted() {
    this.iniciarRepositorio();
  },
  methods: {
    async iniciarRepositorio() {
      try {
        const { data: { data } } = await this.$axios.get(`/api/tb_repositorio`);
        this.repositorios = data;
      } catch (error) {
        console.error(error);
      }
    },
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
section > header {
  font-size: 32px;
  font-weight: 800;
  color: var(--v-roxo-base);
  font-family: var(--font-featured);
}

section > main{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

section:is(.md, .sm, .xs) > main{
  grid-template-columns: 1fr;
  gap: 60px;
}

section > footer {
  display: flex;
  align-content: center;
  justify-content: center;
}

article{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
article > h1,
article > .h1{
  font-size: 24px;
  font-weight: 600;
  color: var(--v-roxo-base);
  font-family: var(--font-featured);
  text-decoration: none;
}
article > div{
  font-size: 14px;
  color: var(--v-preto_noite-base);
  font-family: var(--font-featured);
}
</style>