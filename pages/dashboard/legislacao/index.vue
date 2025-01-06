<template>
  <Canvas header_with_template="Legislação" :short="true">
    <template slot="coluna">
      <div class="rightIsAdmin">
        <v-btn depressed class="botao" color="amarelo_mostarda"
          :to="{ name: 'dashboard-repositorio-admin-novo', query: { tipo: 'legislacao' } }">
          <v-icon>mdi-plus</v-icon>
          Adicionar publicação
        </v-btn>
      </div>
    </template>
    <LegislacaoPesquisar />
    <div class="repositorio">
      <header>{{ noticiasComFiltro.length }} leis cadastradas
        <v-btn v-if="hasQuery" text class="botao limpar" color="amarelo_mostarda"
          :to="{ name: 'dashboard-legislacao' }"><v-icon>mdi-close</v-icon> Limpar pesquisa </v-btn>
        <LegislacaoFiltro :nivel="getAllNivel" :orgao="getAllOrgao" :tags="getAllTags" />
      </header>
      <LegislacaoArtigo v-for="(noticia, i) in noticiasPorPagina" :key="i" :artigo="noticia" @up="iniciarRepositorio" />
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
          ...Object.fromEntries(Object.entries(repo).filter(([key]) => key.startsWith('legislacao_')))
        }
      });
      if (!noticias) return [];
      let noticiasFiltradasPor = {};

      if (pesquisar && pesquisar.trim() !== "") {
        let termo = pesquisar.trim().toLowerCase();
        noticiasFiltradasPor.pesquisar = noticias.filter(r => {
          let titulo = r.legislacao_titulo?.toLowerCase().includes(termo) || false;
          let nivel = r.legislacao_nivel?.toLowerCase().includes(termo) || false;
          let orgao = r.legislacao_orgao?.toLowerCase().includes(termo) || false;
          let conteudo = r.legislacao_decisao?.toLowerCase().includes(termo) || false;
          return titulo || nivel || orgao || conteudo;
        });
      }

      // Filtro por Nivel
      if (filtros.nivel && filtros.nivel.length > 0) {
        noticiasFiltradasPor.nivel = noticias.filter(noticia =>
          filtros.nivel.includes(noticia.legislacao_nivel)
        );
      }

      // Filtro por Órgão
      if (filtros.orgao && filtros.orgao.length > 0) {
        noticiasFiltradasPor.orgao = noticias.filter(noticia =>
          filtros.orgao.includes(noticia.legislacao_orgao)
        );
      }

      // Filtro por tags
      if (filtros.tags && filtros.tags.length > 0) {
        noticiasFiltradasPor.tags = noticias.filter(noticia => {
          let noticiaTags = noticia.legislacao_tags?.split(',').map(tag => tag.trim().toLowerCase()) || [];
          return filtros.tags.some(tag => noticiaTags.includes(tag));
        });
      }

      // Filtro por data (intervalo de datas)
      if (filtros.dt_inicio && filtros.dt_fim) {
        const { dt_inicio, dt_fim } = filtros;
        noticiasFiltradasPor.data = noticias.filter(noticia => {
          let dataNoticia = noticia.legislacao_dt_publicacao;
          return dataNoticia >= dt_inicio && dataNoticia <= dt_fim;
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
    getAllNivel() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let nivelUnicos = new Set();
      this.repositorios.forEach(repo => {
        if (repo.legislacao_nivel) {
          nivelUnicos.add(repo.legislacao_nivel.trim());
        }
      });
      return Array.from(nivelUnicos).sort((a, b) => a.localeCompare(b));
    },
    getAllOrgao() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let orgaoUnicos = new Set();
      this.repositorios.forEach(repo => {
        if (repo.legislacao_orgao) {
          orgaoUnicos.add(repo.legislacao_orgao.trim());
        }
      });
      return Array.from(orgaoUnicos).sort((a, b) => a.localeCompare(b));
    },
    getAllTags() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let todasTags = new Set();
      this.repositorios.forEach(repo => {
        if (repo.legislacao_tags) {
          let tags = repo.legislacao_tags.split(',').map(tag => tag.trim().toLowerCase());
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
        const { data: { data } } = await this.$axios.get(`/api/tb_repositorio?tipo_publicacao=legislacao`);
        this.repositorios = data;
      } catch (error) {
        console.error(error);
      }
    },
    irParaPagina(pagina) {
      this.paginacao.pagina = pagina;
      let { query } = this.$route
      this.$router.push({ name: "dashboard-legislacao", query: { ...query, pagina } });
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