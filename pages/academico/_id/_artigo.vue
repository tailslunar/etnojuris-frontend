<template>
  <Canvas header_with_template="Acadêmico" :short="true">
    <section class="grid-artigo">
      <h1>{{ artigo.academico_titulo }}</h1>
      <span><strong>Categoria: </strong>{{ artigo.academico_tipo }}</span>
      <span class="autoria"><strong>Autoria: </strong>
        <span v-for="(autorObj, index) in parsedAutores" :key="index">
          <template v-if="autorObj.lattes">
            <v-btn class="botao" color="roxo" rounded text :href="autorObj.lattes" target="_blank">
              {{ autorObj.autor }} ({{ autorObj.vinculo }}) <v-icon right>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <v-btn class="botao" color="roxo" rounded text disabled>{{ autorObj.autor }} ({{
              autorObj.vinculo }})</v-btn>
          </template>
        </span>
      </span>
      <span><strong>Ano: </strong>{{ artigo.academico_ano }}</span>
      <span><strong>Referência da publicação: </strong>{{ artigo.academico_referencia }}</span>

      <div>
        <v-btn depressed class="botao vejaMais" color="azul_turquesa"
          @click.prevent="abrirArquivo(artigo.academico_link)">
          <v-icon>mdi-file-document</v-icon>
          Acessar documento
        </v-btn>
      </div>
      <div class="tags">
        <strong>Palavras-chaves: </strong>
        <v-btn class="botao" color="roxo" outlined x-small v-for="(tag, i) in palavrasChaves" :key="i"
          :to="{ name: 'academico', query: { filterBy: JSON.stringify({ tags: [tag.trim().toLowerCase()] }) } }" v-html="tag" />
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
      let tags = this.artigo.academico_tags;
      if (!tags || tags.trim() === "") return;
      tags = tags.split(',').map(tag => tag.trim());
      return tags;
    },
    parsedAutores() {
      try {
        return JSON.parse(this.artigo.academico_autor);
      } catch (error) {
        console.error("Erro ao analisar JSON de autores:", error);
        return [];
      }
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

.autoria,
.autoria>span {
  display: flex;
  gap: 10px;
  align-items: center;
}
.botao.v-btn--disabled{
  color: var(--v-roxo-base) !important;
}
</style>