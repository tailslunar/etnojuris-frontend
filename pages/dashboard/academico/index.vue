<template>
  <Canvas header_with_template="Acadêmico" :short="true">
    <template slot="coluna">
      <div class="rightIsAdmin">
        <v-btn depressed class="botao" color="amarelo_mostarda"
          :to="{ name: 'dashboard-repositorio-admin-novo', query: { tipo: 'academico' } }">
          <v-icon>mdi-plus</v-icon>
          Adicionar publicação
        </v-btn>
      </div>
    </template>
    <AcademicoPesquisar />
    <div class="repositorio">
      <header>{{ noticiasComFiltro.length }} publicações
        <v-btn v-if="hasQuery" text class="botao limpar" color="amarelo_mostarda"
          :to="{ name: 'dashboard-academico' }"><v-icon>mdi-close</v-icon> Limpar pesquisa </v-btn>
        <AcademicoFiltro :categoria="getAllCategoria" :autoria="getAllAutoria" :tags="getAllTags" />
      </header>
      <AcademicoArtigo v-for="(noticia, i) in noticiasPorPagina" :key="i" :artigo="noticia" @up="iniciarRepositorio" />
      <footer><v-pagination v-model="paginacao.pagina" :length="paginacao.totalPaginas" :total-visible="8"
          @input="irParaPagina" color="roxo"></v-pagination></footer>
    </div>
  </Canvas>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      repositorios: [],
      paginacao: {
        pagina: 1,
        totalPaginas: 0,
        itensPorPagina: 6
      },
    }
  },
  computed: {
    ...mapGetters("auth", ["isAdmin", "token"]),
    hasQuery() {
      let { pesquisar, filterBy } = this.$route.query;
      return (!!pesquisar || !!filterBy)
    },
    noticiasComFiltro() {
      let { pesquisar, filterBy } = this.$route.query;

      let filtros = filterBy ? JSON.parse(decodeURIComponent(filterBy)) : {};

      let noticias = this.repositorios.map(({ id, ...repo }) => {
        return {
          id,
          ...Object.fromEntries(Object.entries(repo).filter(([key]) => key.startsWith('academico_')))
        }
      });
      if (!noticias) return [];
      let noticiasFiltradasPor = {};

      if (pesquisar && pesquisar.trim() !== "") {
        let termo = pesquisar.trim().toLowerCase();
        noticiasFiltradasPor.pesquisar = noticias.filter(r => {
          let academico_titulo = r.academico_titulo?.toLowerCase().includes(termo) || false;
          let academico_tipo = r.academico_tipo?.toLowerCase().includes(termo) || false;
          let academico_referencia = r.academico_referencia?.toLowerCase().includes(termo) || false;
          let academico_ano = r.academico_ano?.toLowerCase().includes(termo) || false;
          let academico_autor = r.academico_autor?.toLowerCase().includes(termo) || false;
          return academico_titulo
            || academico_tipo
            || academico_referencia
            || academico_ano
            || academico_autor
        });
      }

      // Filtro por categoria
      if (filtros.categoria && filtros.categoria.length > 0) {
        noticiasFiltradasPor.categoria = noticias.filter(noticia =>
          filtros.categoria.includes(noticia.academico_tipo)
        );
      }
      // Filtro por Autoria
      if (filtros.autoria && filtros.autoria.length > 0) {
        noticiasFiltradasPor.autoria = noticias.filter(noticia => {
          if (!noticia.academico_autor) return false;
          try {
            const autoresArray = JSON.parse(noticia.academico_autor);
            return autoresArray.some(autorObj => filtros.autoria.includes(autorObj.autor));
          } catch (error) {
            console.error("Erro ao analisar JSON de autores:", error);
            return false;
          }
        });
      }

      // Filtro por tags
      if (filtros.tags && filtros.tags.length > 0) {
        noticiasFiltradasPor.tags = noticias.filter(noticia => {
          let noticiaTags = noticia.academico_tags?.split(',').map(tag => tag.trim().toLowerCase()) || [];
          return filtros.tags.some(tag => noticiaTags.includes(tag));
        });
      }

      let listasFiltradas = Object.values(noticiasFiltradasPor);
      if (listasFiltradas.length === 0) return noticias.sort((a, b) => b.id - a.id);
      let interseccao = listasFiltradas.reduce((a, b) => a.filter(c => b.includes(c)));

      interseccao.sort((a, b) => b.id - a.id);
      return interseccao;
    },
    noticiasPorPagina() {
      let quantidade_noticias = this.noticiasComFiltro.length

      let { pagina, itensPorPagina } = this.paginacao
      const start = (pagina - 1) * itensPorPagina
      const end = start + itensPorPagina
      this.paginacao.totalPaginas = Math.ceil(quantidade_noticias / itensPorPagina)
      return this.noticiasComFiltro.slice(start, end);
    },
    getAllCategoria() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let unicos = new Set();
      this.repositorios.forEach(repo => {
        if (repo.academico_tipo) {
          unicos.add(repo.academico_tipo.trim());
        }
      });
      return Array.from(unicos).sort((a, b) => a.localeCompare(b));
    },
    getAllAutoria() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let unicos = new Set();
      this.repositorios.forEach(repo => {
        if (repo.academico_autor) {
          try {
            const autoresArray = JSON.parse(repo.academico_autor);
            autoresArray.forEach(autorObj => {
              if (autorObj.autor) {
                unicos.add(autorObj.autor.trim());
              }
            });
          } catch (error) {
            console.error("Erro ao analisar JSON de autores:", error);
          }
        }
      });
      return Array.from(unicos).sort((a, b) => a.localeCompare(b));
    },
    getAllTags() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let todasTags = new Set();
      this.repositorios.forEach(repo => {
        if (repo.academico_tags) {
          let tags = repo.academico_tags.split(',').map(tag => tag.trim().toLowerCase());
          tags.forEach(tag => {
            if (tag) {
              todasTags.add(tag);
            }
          });
        }
      });
      return Array.from(todasTags).sort((a, b) => a.localeCompare(b));
    }
  },
  mounted() {
    this.iniciarRepositorio();
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha", "confirmar"]),
    async iniciarRepositorio() {
      try {
        const { data: { data } } = await this.$axios.get(`/api/tb_repositorio?tipo_publicacao=academico`);
        this.repositorios = data;
      } catch (error) {
        console.error(error);
      }
    },
    irParaPagina(pagina) {
      this.paginacao.pagina = pagina;
      let { query } = this.$route
      this.$router.push({ name: "dashboard-academico", query: { ...query, pagina } });
    }
  }
}
</script>


<style scoped>
.repositorio {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.repositorio>header {
  display: grid;
  grid-template: '. .' / 1fr max-content;
  gap: 25px;
  color: var(--v-cinza_medio-base);
  align-items: center;
}

.repositorio>header:has(.limpar) {
  grid-template: '. . .' / 1fr max-content max-content;
}
</style>