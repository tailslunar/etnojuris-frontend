<template>
  <Canvas header_with_template="Notícias" :short="true">
    <section class="grid-artigo">
      <h1>{{ artigo.noticia_titulo }}</h1>
      <span><strong>Publicado em: </strong>{{ dataBR(artigo.noticia_dt_publicacao) }}</span>
      <span><strong>Autor: </strong>{{ artigo.noticia_autor }}</span>

      <main v-html="conteudo"></main>
      <div>
        <v-btn depressed class="botao vejaMais" color="azul_turquesa" @click.prevent="abrirArquivo(artigo.noticia_link)">
          <v-icon>mdi-file-document</v-icon>
          Acessar documento
        </v-btn>
      </div>
      <div class="tags">
        <strong>Palavras-chaves: </strong>
        <v-btn class="botao" color="roxo" outlined x-small v-for="(tag, i) in palavrasChaves" :key="i"
          :to="{ name: 'noticias', query: { filterBy: JSON.stringify({tags:[tag.trim().toLowerCase()]}) } }" v-html="tag" />
      </div>
    </section>
  </Canvas>
</template>

<script>
export default {
  layout: 'site',
  data: () => ({
    artigo: {}
  }),
  computed: {
    palavrasChaves() {
      let { noticia_tags } = this.artigo;
      if (!noticia_tags || noticia_tags.trim() === "") return;
      let tags = noticia_tags.split(',').map(tag => tag.trim());
      return tags;
    },
    conteudo() {
      let conteudo = this.artigo.noticia_conteudo
      if (!conteudo) return ''
      return conteudo
        .split('\n\n') // Divide por parágrafos (duas quebras de linha)
        .map(paragraph => `<p>${paragraph.trim()}</p>`)
        .join('');
    }
  },
  mounted() {
    this.iniciarArquivo();
  },
  methods: {
    async iniciarArquivo() {
      let id = this.$route.params.id
      try {
        const { data: { data } } = await this.$axios.get(`/api/tb_repositorio/${id}`);
        this.artigo = data;
      } catch (error) {
        console.error(error);
      }
    },
    dataBR(val) {
      if (!val) return val;
      return this.$moment ? this.$moment(val).format('DD/MM/YYYY') : val;
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

.grid-artigo>h1 {
  grid-area: h1;
  font-size: 32px;
  font-weight: 600;
  color: var(--v-roxo-base);
}

.grid-artigo>span {
  font-size: 0.9rem;
  color: var(--v-preto_noite-base);
}

.grid-artigo>.tags {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 0.9rem;
}

.grid-artigo>main {
  margin: 50px 0px;
  font-size: 0.9rem;
  color: var(--v-preto_noite-base);
}
</style>