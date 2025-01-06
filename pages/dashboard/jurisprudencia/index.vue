<template>
  <Canvas header_with_template="Jurisprudência" :short="true">
    <template slot="coluna">
      <div class="rightIsAdmin">
        <v-btn depressed class="botao" color="amarelo_mostarda"
          :to="{ name: 'dashboard-repositorio-admin-novo', query: { tipo: 'jurisprudencia' } }">
          <v-icon>mdi-plus</v-icon>
          Adicionar publicação
        </v-btn>
      </div>
    </template>
    <JurisprudenciaPesquisar />
    <div class="repositorio">
      <header>{{ noticiasComFiltro.length }} documentos de jurisprudência
        <v-btn v-if="hasQuery" text class="botao limpar" color="amarelo_mostarda"
          :to="{ name: 'dashboard-jurisprudencia' }"><v-icon>mdi-close</v-icon> Limpar pesquisa </v-btn>
        <JurisprudenciaFiltro :competencia="getAllCompetencia" :tribunal="getAllTribunal" :relator="getAllRelator"
          :tags="getAllTags" />
      </header>
      <JurisprudenciaArtigo v-for="(noticia, i) in noticiasPorPagina" :key="i" :artigo="noticia"
        @up="iniciarRepositorio" />
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
          ...Object.fromEntries(Object.entries(repo).filter(([key]) => key.startsWith('jurisprudencia_')))
        }
      });
      if (!noticias) return [];
      let noticiasFiltradasPor = {};

      if (pesquisar && pesquisar.trim() !== "") {
        let termo = pesquisar.trim().toLowerCase();
        noticiasFiltradasPor.pesquisar = noticias.filter(r => {
          let titulo = r.jurisprudencia_titulo?.toLowerCase().includes(termo) || false;
          let ano_processo = r.jurisprudencia_ano_processo?.toLowerCase().includes(termo) || false;
          let ano_decisao = r.jurisprudencia_ano_decisao?.toLowerCase().includes(termo) || false;
          let numero_processo = r.jurisprudencia_numero_processo?.toLowerCase().includes(termo) || false;
          let competencia = r.jurisprudencia_competencia?.toLowerCase().includes(termo) || false;
          let tribunal = r.jurisprudencia_tribunal?.toLowerCase().includes(termo) || false;
          let relator = r.jurisprudencia_relator?.toLowerCase().includes(termo) || false;
          let ementa = r.jurisprudencia_ementa?.toLowerCase().includes(termo) || false;
          return titulo
            || ano_processo
            || ano_decisao
            || numero_processo
            || competencia
            || tribunal
            || relator
            || ementa
        });
      }

      // Filtro por Competencia
      if (filtros.competencia && filtros.competencia.length > 0) {
        noticiasFiltradasPor.competencia = noticias.filter(noticia =>
          filtros.competencia.includes(noticia.jurisprudencia_competencia)
        );
      }

      // Filtro por Tribunal
      if (filtros.tribunal && filtros.tribunal.length > 0) {
        noticiasFiltradasPor.tribunal = noticias.filter(noticia =>
          filtros.tribunal.includes(noticia.jurisprudencia_tribunal)
        );
      }

      // Filtro por Relator
      if (filtros.relator && filtros.relator.length > 0) {
        noticiasFiltradasPor.relator = noticias.filter(noticia =>
          filtros.relator.includes(noticia.jurisprudencia_relator)
        );
      }

      if (filtros.tags && filtros.tags.length > 0) {
        noticiasFiltradasPor.tags = noticias.filter(noticia => {
          let noticiaTags = noticia.jurisprudencia_tags?.split(',').map(tag => tag.trim().toLowerCase()) || [];
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
    getAllCompetencia() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let competenciaUnicos = new Set();
      this.repositorios.forEach(repo => {
        if (repo.jurisprudencia_competencia) {
          competenciaUnicos.add(repo.jurisprudencia_competencia.trim());
        }
      });
      return Array.from(competenciaUnicos).sort((a, b) => a.localeCompare(b));
    },
    getAllTribunal() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let unico = new Set();
      this.repositorios.forEach(repo => {
        if (repo.jurisprudencia_tribunal) {
          unico.add(repo.jurisprudencia_tribunal.trim());
        }
      });
      return Array.from(unico).sort((a, b) => a.localeCompare(b));
    },
    getAllRelator() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let unico = new Set();
      this.repositorios.forEach(repo => {
        if (repo.jurisprudencia_relator) {
          unico.add(repo.jurisprudencia_relator.trim());
        }
      });
      return Array.from(unico).sort((a, b) => a.localeCompare(b));
    },
    getAllTags() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let todasTags = new Set();
      this.repositorios.forEach(repo => {
        if (repo.jurisprudencia_tags) {
          let tags = repo.jurisprudencia_tags.split(',').map(tag => tag.trim().toLowerCase());
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
        const { data: { data } } = await this.$axios.get(`/api/tb_repositorio?tipo_publicacao=jurisprudencia`);
        this.repositorios = data;
      } catch (error) {
        console.error(error);
      }
    },
    irParaPagina(pagina) {
      this.paginacao.pagina = pagina;
      let { query } = this.$route
      this.$router.push({ name: "dashboard-jurisprudencias", query: { ...query, pagina } });
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