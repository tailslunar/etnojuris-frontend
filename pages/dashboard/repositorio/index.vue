<template>
  <Canvas header_with_template="Repositório" :short="true">
    <template slot="coluna">
      <div v-show="isAdmin" class="rightIsAdmin">
        <v-btn depressed class="botao" color="amarelo_mostarda" :to="{ name: 'dashboard-repositorio-admin-novo' }">
          <v-icon>mdi-plus</v-icon>
          Adicionar publicação
        </v-btn>
      </div>
    </template>
    <RepositorioPesquisar />
    <div class="grid-repositorio">
      <section>
        <RepositorioArtigo v-for="repositorio in repositorioPorPagina" :key="repositorio.id" :repositorio="repositorio"
          @up="iniciarRepositorio" />
      </section>
      <RepositorioFiltro :anos="anos" :autores="autores" :tags="tags" />
      <div class="text-center">
        <v-pagination v-model="paginacao.pagina" :length="paginacao.totalPaginas" :total-visible="8"
          @input="irParaPagina" color="roxo"></v-pagination>
      </div>
    </div>
  </Canvas>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      repositorios: [],
      pesquisar: "",
      filtros: {
        data_publicacao: ""
      },
      paginacao: {
        pagina: 1,
        totalPaginas: 0,
        itensPorPagina: 6
      },
    }
  },
  watch: {
    $route(v) {
      if (!v.query.pagina)
        this.paginacao.pagina = 1
    },
    filtros: {
      handler(v) {
        let { data_publicacao } = v
        let { query } = this.$route
        if (data_publicacao !== "") {
          this.$router.push({ name: "dashboard-repositorio", query: { ...query, filterby_data_publicacao: data_publicacao } })
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters("auth", ["isAdmin", "token"]),
    repositorioComFiltro() {
      let query = this.$route.query;
      let repositorios = this.repositorios;

      if (!repositorios) return [];

      let novosRepositorios = {};

      if (query.pesquisar && query.pesquisar.trim() !== "") {
        let termo = query.pesquisar.trim().toLowerCase();
        novosRepositorios.pesquisar = repositorios.filter(r => {
          let titulo = r.titulo.toLowerCase().includes(termo);
          let autor = r.autor.toLowerCase().includes(termo);
          let conteudo = r.conteudo.toLowerCase().includes(termo);
          return titulo || autor || conteudo;
        });
      }

      if (query.filterby_ano && query.filterby_ano.trim() !== "") {
        let ano = query.filterby_ano.trim();
        novosRepositorios.filterby_ano = repositorios.filter(r => {
          return r.ano == ano;
        });
      }

      if (query.filterby_autor && query.filterby_autor.trim() !== "") {
        let autor = query.filterby_autor.trim();
        novosRepositorios.filterby_autor = repositorios.filter(r => {
          return r.autor == autor;
        });
      }

      if (query.filterby_tag && query.filterby_tag.trim() !== "") {
        let tag = query.filterby_tag.trim().toLowerCase();
        novosRepositorios.filterby_tag = repositorios.filter(r => {
          return r.palavras_chave.toLowerCase().includes(tag);
        });
      }

      let listasFiltradas = Object.values(novosRepositorios);
      if (listasFiltradas.length === 0) return repositorios.sort((a, b) => b.id - a.id);
      let interseccao = listasFiltradas.reduce((a, b) => a.filter(c => b.includes(c)));

      interseccao.sort((a, b) => b.id - a.id);
      return interseccao;
    },
    repositorioPorPagina() {
      let totalRepositorio = this.repositorioComFiltro.length

      let { pagina, itensPorPagina } = this.paginacao
      const start = (pagina - 1) * itensPorPagina
      const end = start + itensPorPagina
      this.paginacao.totalPaginas = Math.ceil(totalRepositorio / itensPorPagina)
      return this.repositorioComFiltro.slice(start, end);
    },
    autores() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let autoresUnicos = new Set();

      this.repositorios.forEach(repo => {
        if (repo.autor) {
          autoresUnicos.add(repo.autor.trim());
        }
      });
      return Array.from(autoresUnicos).sort((a, b) => a.localeCompare(b));
    },
    anos() {
      if (!this.repositorios || this.repositorios.length === 0) return [];

      let anosUnicos = new Set();
      this.repositorios.forEach(repo => {
        if (repo.ano) {
          anosUnicos.add(repo.ano);
        }
      });

      return Array.from(anosUnicos).sort((a, b) => b - a);
    },
    tags() {
      if (!this.repositorios || this.repositorios.length === 0) return [];
      let todasTags = new Set();
      this.repositorios.forEach(repo => {
        if (repo.palavras_chave) {
          let tags = repo.palavras_chave.split(',').map(tag => tag.trim().toLowerCase());
          tags.forEach(tag => {
            if (tag) {
              todasTags.add(tag);
            }
          });
        }
      });
      return Array.from(todasTags).sort((a, b) => a.localeCompare(b));
    },
  },
  mounted() {
    this.iniciarRepositorio();
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha", "confirmar"]),
    async iniciarRepositorio() {
      try {
        const { data: { data } } = await this.$axios.get(`/api/tb_repositorio`);
        this.repositorios = data;
      } catch (error) {
        console.error(error);
      }
    },
    irParaPagina(pagina) {
      this.paginacao.pagina = pagina;
      let { query } = this.$route
      this.$router.push({ name: "dashboard-repositorio", query: { ...query, pagina } });
    }
  }
}
</script>
