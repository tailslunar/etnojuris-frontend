<template>
  <Canvas>
    <ProcessoPesquisar @update_filterby="updateFilterBy" />
    <header>
      <div>Últimos processos cadastrados</div>
      <div>
        <v-dialog v-model="ativarFiltros">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed class="botao" color="bege_sombrio" v-bind="attrs" v-on="on">
              <v-icon>mdi-filter-variant</v-icon> Filtrar
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="amarelo_mostarda branco--text" class="lexand">Filtros</v-toolbar>
              <div class="itensColuna">
                <h5>Mostrar campos:</h5>
                <v-checkbox v-for="(header, ind) in headerTable" :key="ind" v-model="header.show"
                  v-if="header.show !== undefined" :label="header.text" color="roxo" />
              </div>
              <div class="grid_filter">
                <div class="itensField">
                  <h5>Competência:</h5>
                  <v-autocomplete chips deletable-chips multiple solo :items="competencia"
                    v-model="filterby.competencia"></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Jurisdicao:</h5>
                  <v-autocomplete chips deletable-chips multiple solo :items="jurisdicao"
                    v-model="filterby.jurisdicao"></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Comarca:</h5>
                  <v-autocomplete chips deletable-chips multiple solo :items="comarca"
                    v-model="filterby.comarca"></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Foro:</h5>
                  <v-autocomplete chips deletable-chips multiple solo :items="foro"
                    v-model="filterby.foro"></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Vara:</h5>
                  <v-autocomplete chips deletable-chips multiple solo :items="vara"
                    v-model="filterby.vara"></v-autocomplete>
                </div>

                <div class="itensField">
                  <h5>Quilombo:</h5>
                  <v-autocomplete chips deletable-chips multiple solo :items="quilombos"
                    v-model="filterby.quilombo"></v-autocomplete>
                </div>
              </div>
              <v-divider></v-divider>
              <v-card-actions class="justify-end">
                <v-btn class="botao lexand" color="roxo branco--text" @click="dialog.value = false">Confirmar</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-btn depressed class="botao" color="bege_sombrio">
          <v-icon>mdi-tray-arrow-down</v-icon> Exportar
        </v-btn>
      </div>
    </header>
    <div>
      <v-chip v-for="(filtro, i) in filtrosAtivos" :key="i" class="ma-2" color="roxo branco--text" close
        @click:close="removerFiltro(filtro)">{{ filtro.value }}</v-chip>
    </div>
    <v-data-table :headers="headers" :items="processosFiltrados" item-key="id">
      <template v-slot:item.numero="{ item }">
        <v-btn text :to="{ name: 'dashboard-processo-numero', params: { numero: item.id} }">{{item.numero}}</v-btn>
      </template>
      <template v-slot:item._action="{ item }">
        <div class="botoesAcao">
          <v-btn small text color="roxo" :to="{ name: 'dashboard-processos-admin-editar-id', params: { id: item.id} }"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn small text color="vermelho_telha" @click.prevent="deleteProcesso(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </template>
    </v-data-table>
  </Canvas>
</template>

<script>
export default {
  data() {
    return {
      // original dados
      processos: [],
      localidades: [],
      usuarios: [],
      // configurações da tabela
      headerTable: [
        { text: "#", value: "id", align: "start", show: true },
        { text: "Processo", value: "numero", show: true },
        { text: "Competencia", value: "competencia", show: false },
        { text: "Jurisdiçao", value: "jurisdicao", show: false },
        { text: "Comarca", value: "comarca", show: false },
        { text: "Foro", value: "foro", show: false },
        { text: "Vara", value: "vara", show: false },
        { text: "Localizacao ID", value: "localidade_id" },
        { text: "Quilombo ID", value: "quilombo_id" },
        { text: "Quilombo", value: "quilombo", show: true },
        { text: "Usuario ID", value: "usuario_id" },
        { text: "Ações", value: "_action", show: true },
      ],
      ativarFiltros: false,
      filterby: {
        numero: "",
        parte: "",
        localidade: "",
        competencia: [],
        jurisdicao: [],
        comarca: [],
        foro: [],
        vara: [],
        quilombo: [],
      }
    }
  },
  computed: {
    competencia() {
      return [...new Set(this.processos.map(p => p.competencia))].sort()
    },
    jurisdicao() {
      return [...new Set(this.processos.map(p => p.jurisdicao))].sort()
    },
    comarca() {
      return [...new Set(this.processos.map(p => p.comarca))].sort()
    },
    foro() {
      return [...new Set(this.processos.map(p => p.foro))].sort()
    },
    vara() {
      return [...new Set(this.processos.map(p => p.vara))].sort()
    },
    quilombos() {
      return [...new Set(this.processos.map(p => p.quilombo.split(' (')[0]))].sort()
    },
    processosFiltrados() {
      let { numero, parte, localidade, competencia, jurisdicao, comarca, foro, vara, quilombo } = this.filterby
      let { processos } = this
      let novosProcessos = {}

      if (!!numero && numero != "") {
        novosProcessos.numero = processos.filter(processo =>
          processo.numero == numero
        );
      }

      if (!!parte && parte != "") {
        novosProcessos.parte = processos.filter(processo =>
          processo.quilombo.toLowerCase().includes(parte.toLowerCase())
        );
      }

      if (!!localidade && localidade != "") {
        novosProcessos.localidade = processos.filter(processo =>
          processo.quilombo.toLowerCase().includes(localidade.toLowerCase())
        );
      }

      if (competencia.length > 0) {
        novosProcessos.competencia = processos.filter(processo =>
          competencia.includes(processo.competencia)
        );
      }

      if (jurisdicao.length > 0) {
        novosProcessos.jurisdicao = processos.filter(processo =>
          jurisdicao.includes(processo.jurisdicao)
        );
      }

      if (comarca.length > 0) {
        novosProcessos.comarca = processos.filter(processo =>
          comarca.includes(processo.comarca)
        );
      }

      if (foro.length > 0) {
        novosProcessos.foro = processos.filter(processo =>
          foro.includes(processo.foro)
        );
      }

      if (vara.length > 0) {
        novosProcessos.vara = processos.filter(processo =>
          vara.includes(processo.vara)
        );
      }

      if (quilombo.length > 0) {
        novosProcessos.quilombo = processos.filter(processo =>
          quilombo.some(q => processo.quilombo.includes(q))
        );
      }

      let listasFiltradas = Object.values(novosProcessos);
      if (listasFiltradas.length === 0) return processos.sort((a, b) => b.id - a.id);
      let interseccao = listasFiltradas.reduce((a, b) => a.filter(c => b.includes(c)));
      interseccao.sort((a, b) => b.id - a.id);
      return interseccao;

    },
    headers() {
      return this.headerTable.filter(a => a.show)
    },
    filtrosAtivos() {
      let activeFilters = [];
      Object.entries(this.filterby).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val) activeFilters.push({ key, value: val });
          });
        } else if (value !== "" && value !== null && value !== undefined) {
          activeFilters.push({ key, value });
        }
      });
      return activeFilters;
    }
  },
  mounted() {
    this.iniciarProcessos()
  },
  methods: {
    async iniciarProcessos() {
      try {
        const { data: { data } } = await this.$axios.get(`/api/tb_processo`);
        this.processos = data;
      } catch (error) {
        console.error(error)
      }
    },
    updateFilterBy({ filterby, query }) {
      this.filterby.numero = ''
      this.filterby.parte = ''
      this.filterby.localidade = ''
      this.filterby[filterby] = query
    },
    removerFiltro({key, value}) {
      if (Array.isArray(this.filterby[key])) {
        this.filterby[key] = this.filterby[key].filter(item => item !== value);
      } else {
        this.filterby[key] = "";
      }
    },
    async deleteProcesso(id) {
      this.confirmar({
        titulo: 'Confirmar Exclusão',
        callback: async (confirmed) => {
          if (confirmed) {
            try {
              //let response = await this.$axios.delete(`/api/tb_quilombo/${id}`, { data: this.objDelete });
              //let { message } = response.data;
              this.sucesso({ titulo: 'Processo Excluido' });
              //this.iniciarQuilombo(); // Atualiza a lista de glossários após a exclusão
            } catch (error) {
              let { message } = error.response.data;
              let { status, statusText } = error.response;
              this.falha({ titulo: `${status} ${statusText}`, mensagem: message });
            }
          }
        },
      });
    },
  }
}
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

header>div:nth-child(1) {
  font-size: 16px;
  color: var(--v-roxo-base);
  font-family: var(--font-featured);
}

header>div:nth-child(2) {
  display: flex;
  gap: 25px;
}

.link {
  color: #000000DE;
}
</style>