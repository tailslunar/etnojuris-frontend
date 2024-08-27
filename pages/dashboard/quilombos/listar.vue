<template>
  <Canvas>
    <QuilomboPesquisar @update_filterby="updateFilterBy" />
    <header>
      <div>Quilombos</div>
      <div>
        <v-btn
          depressed
          class="botao"
          color="bege_sombrio"
          :to="{ name: 'dashboard-quilombos' }"
        >
          <v-icon>mdi-map-marker</v-icon> Mapa
        </v-btn>
        <v-dialog v-model="ativarFiltros">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              class="botao"
              color="bege_sombrio"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-filter-variant</v-icon> Filtrar
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="amarelo_mostarda branco--text" class="lexand"
                >Filtros</v-toolbar
              >
              <div class="itensColuna">
                <h5>Mostrar campos:</h5>
                <v-checkbox
                  v-for="(header, ind) in headerTable"
                  :key="ind"
                  v-model="header.show"
                  v-if="header.show !== undefined"
                  :label="header.text"
                  color="roxo"
                />
              </div>

              <div class="grid_filter" v-if="false">
                <div class="itensField">
                  <h5>Competência:</h5>
                  <v-autocomplete
                    chips
                    deletable-chips
                    multiple
                    solo
                    :items="competencia"
                    v-model="filterby.competencia"
                  ></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Jurisdicao:</h5>
                  <v-autocomplete
                    chips
                    deletable-chips
                    multiple
                    solo
                    :items="jurisdicao"
                    v-model="filterby.jurisdicao"
                  ></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Comarca:</h5>
                  <v-autocomplete
                    chips
                    deletable-chips
                    multiple
                    solo
                    :items="comarca"
                    v-model="filterby.comarca"
                  ></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Foro:</h5>
                  <v-autocomplete
                    chips
                    deletable-chips
                    multiple
                    solo
                    :items="foro"
                    v-model="filterby.foro"
                  ></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Vara:</h5>
                  <v-autocomplete
                    chips
                    deletable-chips
                    multiple
                    solo
                    :items="vara"
                    v-model="filterby.vara"
                  ></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Quilombo:</h5>
                  <v-autocomplete
                    chips
                    deletable-chips
                    multiple
                    solo
                    :items="quilombos"
                    v-model="filterby.quilombo"
                  ></v-autocomplete>
                </div>
              </div>
              <v-divider></v-divider>
              <v-card-actions class="justify-end">
                <v-btn
                  class="botao lexand"
                  color="roxo branco--text"
                  @click="dialog.value = false"
                  >Confirmar</v-btn
                >
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-btn depressed class="botao" color="bege_sombrio">
          <v-icon>mdi-tray-arrow-down</v-icon> Exportar</v-btn
        >
        <v-btn depressed class="botao" color="amarelo_mostarda" v-if="!!this.isAdmin"
        :to="{ name: 'dashboard-quilombos-admin-novo' }"
        >
          <v-icon>mdi-plus</v-icon> <span>Adicionar Quilombo</span>
        </v-btn>
      </div>
    </header>

    <div>
      <v-chip
        v-for="(filtro, i) in filtrosAtivos"
        :key="i"
        class="ma-2"
        color="roxo branco--text"
        close
        @click:close="removerFiltro(filtro)"
        >{{ filtro.value }}</v-chip
      >
    </div>
    
    <v-data-table :headers="headers" :items="quilombosFiltrados" item-key="id">
      <template v-slot:item._action="{ item }">
        <div class="botoesAcao">
          <v-btn small text color="roxo" :to="{ name: 'dashboard-quilombos-admin-editar-id', params: { id: item.id} }"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn small text color="vermelho_telha" @click.prevent="deleteQuilombo(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </template>
    </v-data-table>
  </Canvas>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      quilombos: [],
      headerTable: [
        { text: "#", value: "id", align: "start", show: true },

        { text: "CNPJ", value: "cnpj", show: true},
        { text: "Quilombo", value: "nome", show: true },

        { text: "Associação", value: "associacao", show: false },
        { text: "CEP", value: "cep", show: false },
        { text: "Endereço", value: "endereco", show: false },
        { text: "Número", value: "numero", show: false },
        { text: "Latitude", value: "latitude", show: false },
        { text: "Longitude", value: "longitude", show: false },
        { text: "Área", value: "area", show: false },
        { text: "IDLocalidade", value: "localidade_id" },
        { text: "Localidade", value: "localidade_id", show: false },
        { text: "IDUsuario", value: "usuario_id" },
        { text: "Usuário", value: "usuario_id", show: false },
        { text: "Ações", value: "_action", show: true },
      ],
      ativarFiltros: false,
      filterby: {
        nome: "",
        associacao: "",
        localidade: "",
        cnpj: "",
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
     headers() {
      let index = this.headerTable.findIndex((a) => a.value === "_action");
      if (index !== -1) {
        this.headerTable[index].show = !!this.isAdmin;
      }
      return this.headerTable.filter((a) => a.show);
    },
    filtrosAtivos() {
      let activeFilters = [];
      Object.entries(this.filterby).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            if (val) activeFilters.push({ key, value: val });
          });
        } else if (value !== "" && value !== null && value !== undefined) {
          activeFilters.push({ key, value });
        }
      });
      return activeFilters;
    },
    quilombosFiltrados() {
      let { nome, associacao, localidade, cnpj } = this.filterby;
      let { quilombos } = this;

      let fQuilombos = {};

      if (!!nome && nome != "") {
        const termosNome = nome.split(" ");
        fQuilombos.nome = quilombos.filter((q) =>
          termosNome.every((termo) => q.nome.includes(termo))
        );
      }

      if (!!associacao && associacao != "") {
        const termosAssociacao = associacao.split(" ");
        fQuilombos.associacao = quilombos.filter((q) =>
          termosAssociacao.every((termo) => q.associacao.includes(termo))
        );
      }

      if (!!cnpj && cnpj != "") {
        fQuilombos.cnpj = quilombos.filter((q) => q.cnpj == cnpj);
      }

      let listasFiltradas = Object.values(fQuilombos);
      if (listasFiltradas.length === 0)
        return quilombos.sort((a, b) => b.id - a.id);
      let interseccao = listasFiltradas.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );
      interseccao.sort((a, b) => b.id - a.id);
      return interseccao;
    },
    objDelete() {
      return {
        Bearer: this.token
      }
    }
  },
  mounted() {
    this.iniciarQuilombo();
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha", "confirmar"]),
    async iniciarQuilombo() {
      try {
        const {
          data: { data },
        } = await this.$axios.get(`/api/tb_quilombo`);
        this.quilombos = data;
      } catch (error) {
        console.error(error);
      }
    },
    updateFilterBy({ filterby, query }) {
      this.filterby.nome = "";
      this.filterby.associacao = "";
      this.filterby.localidade = "";
      this.filterby.cnpj = "";
      this.filterby[filterby] = query;
    },
    removerFiltro({ key, value }) {
      if (Array.isArray(this.filterby[key])) {
        this.filterby[key] = this.filterby[key].filter(
          (item) => item !== value
        );
      } else {
        this.filterby[key] = "";
      }
    },
    async deleteQuilombo(id) {
      this.confirmar({
        titulo: 'Confirmar Exclusão',
        callback: async (confirmed) => {
          if (confirmed) {
            try {
              let response = await this.$axios.delete(`/api/tb_quilombo/${id}`, { data: this.objDelete });
              let { message } = response.data;
              this.sucesso({ titulo: message });
              this.iniciarQuilombo(); // Atualiza a lista de glossários após a exclusão
            } catch (error) {
              let { message } = error.response.data;
              let { status, statusText } = error.response;
              this.falha({ titulo: `${status} ${statusText}`, mensagem: message });
            }
          }
        },
      });
    },
  },
};
</script>

<style scoped>
.grid_filter {
  display: grid;
  grid-template: ". ." min-content/ 1fr 1fr;
  gap: 0px 15px;
  padding: 25px;
}

.itensColuna {
  padding: 25px;
  display: flex;
  gap: 0px 10px;
  flex-wrap: wrap;
}

.itensField {
  display: flex;
  flex-direction: column;
  gap: 0px 10px;
}

.itensColuna h5,
.itensField h5 {
  width: 100%;
  color: var(--v-preto_noite-base);
  font-family: var(--font-featured);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header > div:nth-child(1) {
  font-size: 16px;
  color: var(--v-roxo-base);
  font-family: var(--font-featured);
}

header > div:nth-child(2) {
  display: flex;
  gap: 25px;
}

.link {
  color: #000000de;
}
.botoesAcao {
  display: flex;
  gap: 10px;
}
</style>
