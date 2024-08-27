<template>
  <Canvas header_with_template="Repositório" :short="true">
    <RepositorioPesquisar />
    <section class="grid-artigo">
      <header>
        <h1>{{ artigo.titulo }}</h1>
        <span>{{ artigo.autor }}</span>
        <span>{{ artigo.ano }}</span>
        <div v-if="artigo.has_palavras_chave"><span>Palavras-chaves</span>:
          <v-btn class="botao" color="roxo" outlined x-small v-for="(tag, i) in palavrasChaves" :key="i"
            :to="{ name: 'dashboard-repositorio', query: { filterby_tag: tag } }" v-html="tag" />
        </div>
      </header>
      <section v-html="artigo.conteudo"></section>
      <section v-if="artigo.has_link">
        <v-btn depressed class="vejaMais" color="azul_turquesa" @click.prevent="abrirArquivo(artigo.link)">
          <v-icon>mdi-file-document</v-icon>
          Acessar documento
        </v-btn>
      </section>
    </section>
  </Canvas>
</template>

<script>
export default {
  data: () => ({
    repositorio: {}
  }),
  computed: {
    palavrasChaves() {
      let { palavras_chave } = this.repositorio;
      if (!palavras_chave || palavras_chave.trim() === "") return;
      let tags = palavras_chave.split(',').map(tag => tag.trim());
      return tags;
    },
    artigo() {
      if (this.repositorio && this.repositorio.conteudo) {
        let artigo = {
          ...this.repositorio,
          autor: this.repositorio.autor == '' ? "Sem Autor" : this.repositorio.autor,
          ano: this.repositorio.ano == '' || this.repositorio.ano == 0 ? "Sem ano" : this.repositorio.ano,
          conteudo: this.repositorio.conteudo == "" ? "" : this.repositorio.conteudo.replace(/\n/g, "<br>"),
          has_palavras_chave: this.repositorio.palavras_chave == "" ? false : true,
          palavras_chave: this.repositorio.palavras_chave == "" ? "-" : this.repositorio.palavras_chave,
          has_link: this.repositorio.link == "" ? false : true,
          link: this.repositorio.link == "" ? "" : this.repositorio.link
        }
        return artigo
      } else {
        return {
          ...this.repositorio
        }
      }
    }
  },
  mounted() {
    this.iniciarArquivo();
  },
  methods: {
    async iniciarArquivo() {
      let id = this.$route.params.artigo
      try {
        const { data: { data } } = await this.$axios.get(`/api/tb_repositorio/${id}`);
        this.repositorio = data;
      } catch (error) {
        console.error(error);
      }

    },
    abrirArquivo(url) {
      window.open(url, "_blank");
    }
  }
};
</script>


<style scoped>
.grid-artigo {
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: var(--font-featured);
  padding-bottom: 100px;
}

.grid-artigo>header {
  display: grid;
  grid-template: "h1 h1" ". ." "div div" / max-content 1fr;
  gap: 5px;
}

.grid-artigo>header>h1 {
  grid-area: h1;
  font-size: 32px;
  font-weight: 600;
  color: var(--v-roxo-base);
}

.grid-artigo>header>span {
  font-size: 20px;
  font-weight: 600;
  color: var(--v-preto_noite-base);
}

.grid-artigo>header>span:nth-child(3) {
  font-weight: 400;
}

.grid-artigo>header>div {
  grid-area: div;
  font-size: 14px;
  font-weight: 400;
  color: var(--v-preto_noite-base);


  display: flex;
  gap: 10px;
}

.grid-artigo>header>div>span {
  font-weight: 600;
}

.grid-artigo>section {
  font-size: 16px;
  font-weight: 400;
  color: var(--v-preto_noite-base);
}
</style>