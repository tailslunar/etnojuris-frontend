<template>
  <Canvas>
    <ProcessoPesquisar @update_filterby="updateFilterBy" />
    <header>
      <div>Processos</div>
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
                <v-checkbox v-for="(header, ind) in headerTable" :key="ind" v-model="header.show" v-if="!header.hidden"
                  :label="header.text" color="roxo" />
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
                <div class="itensField">
                  <h5>Estado:</h5>
                  <v-autocomplete chips deletable-chips multiple solo :items="estados"
                    v-model="filterby.estado"></v-autocomplete>
                </div>                
                <div class="itensField">
                  <h5>Cidade:</h5>
                  <v-autocomplete chips deletable-chips multiple solo :items="cidades"
                    v-model="filterby.cidade"></v-autocomplete>
                </div>
              </div>
              <v-divider></v-divider>
              <v-card-actions class="justify-end">
                <v-btn class="botao lexand" color="roxo branco--text" @click="dialog.value = false">Confirmar</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-btn depressed class="botao" color="bege_sombrio" @click.prevent="exportData">
          <v-icon>mdi-tray-arrow-down</v-icon> Exportar</v-btn>
        <v-btn depressed class="botao" color="amarelo_mostarda" v-if="false && !!this.isAdmin"
          :to="{ name: 'dashboard-processos-admin-novo' }">
          <v-icon>mdi-plus</v-icon> <span>Adicionar Processo</span>
        </v-btn>
      </div>
    </header>
    <div>
      <v-chip v-for="(filtro, i) in filtrosAtivos" :key="i" class="ma-2" color="roxo branco--text" close
        @click:close="removerFiltro(filtro)">{{ filtro.value }}</v-chip>
    </div>
    <v-data-table :headers="headers" :items="processosFiltrados" item-key="id">
      <template v-slot:item.processo="{ item }">
        <v-btn text class="botao" color="roxo" :to="{ name: 'dashboard-quilombos-processos-nr', params: { nr: item.id } }"> {{ item.processo }} </v-btn>
      </template>
      <template v-slot:item._action="{ item }">
        <div class="botoesAcao">
          <v-btn small text color="roxo"
            :to="{ name: 'dashboard-processos-admin-editar-id', params: { id: item.id } }"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn small text color="vermelho_telha"
            @click.prevent="deleteProcesso(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </template>
    </v-data-table>
  </Canvas>
</template>

<script>
import { createExcel } from '@/services/export';
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      processos: [],
      headerTable: [
        { text: "#", value: "id", show: false, hidden: false },
        { text: "Processo", value: "processo", show: true, hidden: false },
        { text: "Competência", value: "competencia", show: false, hidden: false },
        { text: "Jurisdição", value: "jurisdicao", show: false, hidden: false },
        { text: "Comarca", value: "comarca", show: false, hidden: false },
        { text: "Foro", value: "foro", show: false, hidden: false },
        { text: "Vara", value: "vara", show: false, hidden: false },
        { text: "Data", value: "data", show: false, hidden: false },
        { text: "Quilombo", value: "quilombo", show: true, hidden: false },
        { text: "Sentença", value: "sentenca", show: false, hidden: false },
        { text: "Cidade", value: "cidade", show: true, hidden: false },
        { text: "Estado", value: "estado", show: true, hidden: false },
        { text: "Advogados", value: "advogados", show: false, hidden: false },
        { text: "Partes", value: "partes", show: false, hidden: false },
        { text: "Ações", value: "_action", show: true, hidden: true, width: "150" }
      ],
      ativarFiltros: false,
      filterby: {
        numero: "",
        parte: "",
        localidade: "",
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
    ...mapGetters("historico", ["getProcessos"]),
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
    processosQuilomboLocalidade() {
      const processo = [...this.processos]
      const formatarData = (data) => {
        if (!data) return null; // Retorna null se a data não existir
        const [year, month, day] = data.split('-');
        return `${day}/${month}/${year}`;
      };

      const listarAdvogados = (p) => {
        let advogados = [];
        if (p?.objAdvogado?.length > 0) {
          advogados.push(...p.objAdvogado.flat().map(a => a.nome));
        }
        if (p?.objDefensoria?.length > 0) {
          advogados.push(...p.objDefensoria.map(d => d.instituicao));
        }
        if (p?.objProcurador?.length > 0) {
          advogados.push(...p.objProcurador.map(p => p.instituicao));
        }
        return advogados.length > 0 ? advogados.join(', ') : null;
      };
      const listarPartes = (p) => {
        let partes = [];

        if (p?.objParte?.length > 0) {
          p.objParte.forEach(parteArray => {
            parteArray.forEach(parte => {
              partes.push(parte.nome);
            });
          });
        }

        return partes.length > 0 ? partes.join(', ') : null;
      };
      const novoProcesso = processo.map(p => {
        return {
          id: p?.objProcesso?.id ?? null, // Garante que id será null se não existir
          processo: p?.objProcesso?.numero ?? null,
          competencia: p?.objProcesso?.competencia ?? null,
          jurisdicao: p?.objProcesso?.jurisdicao ?? null,
          comarca: p?.objProcesso?.comarca ?? null,
          foro: p?.objProcesso?.foro ?? null,
          vara: p?.objProcesso?.vara ?? null,
          data: formatarData(p?.objProcesso?.data_publicacao) ?? null,
          quilombo: p?.objQuilombo?.nome ?? null,
          sentenca: p?.objSentenca?.nome ?? null,
          estado: p?.objLocalidade?.uf ?? null,
          cidade: p?.objLocalidade?.cidade ?? null,
          advogados: listarAdvogados(p),
          partes: listarPartes(p)
        };
      });
      return novoProcesso.sort((a, b) => b.id - a.id);
    },
    processosFiltrados() {
      let { numero, parte, localidade, competencia, jurisdicao, comarca, foro, vara, quilombo, estado, cidade } = this.filterby;

      const normalizarTexto = (texto) => {
        if (!texto) return ''; // Retorna string vazia se o texto for null ou undefined
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      };

      const filtrarPorTermos = (array, termos, campo) => {
        const termosNormalizados = termos.split(" ").map(normalizarTexto);
        return array.filter(item =>
          termosNormalizados.every(termo => normalizarTexto(item[campo]).includes(termo))
        );
      };

      const filtrarPorArray = (array, termos, campo) => {
        const termosNormalizados = termos.map(normalizarTexto); // Normaliza os itens do array
        return array.filter(item =>
          termosNormalizados.some(termo => normalizarTexto(item[campo]).includes(termo))
        );
      };

      const processos = [...this.processosQuilomboLocalidade]

      let fProcessos = {};

      if (numero) fProcessos.processo = processos.filter(q => q.processo == numero);
      if (parte) fProcessos.parte = filtrarPorTermos(processos, parte, "partes");

      if (localidade) {
        const termosLocalidade = localidade.split(" ").map(normalizarTexto);
        fProcessos.localidade = processos.filter(q =>
          termosLocalidade.every(termo => normalizarTexto(q.cidade).includes(termo)) ||
          termosLocalidade.every(termo => normalizarTexto(q.estado).includes(termo))
        );
      }

      if (competencia && competencia.length > 0) fProcessos.competencia = filtrarPorArray(processos, competencia, "competencia");
      if (jurisdicao && jurisdicao.length > 0) fProcessos.jurisdicao = filtrarPorArray(processos, jurisdicao, "jurisdicao");
      if (comarca && comarca.length > 0) fProcessos.comarca = filtrarPorArray(processos, comarca, "comarca");
      if (foro && foro.length > 0) fProcessos.foro = filtrarPorArray(processos, foro, "foro");
      if (vara && vara.length > 0) fProcessos.vara = filtrarPorArray(processos, vara, "vara");
      if (quilombo && quilombo.length > 0) fProcessos.quilombo = filtrarPorArray(processos, quilombo, "quilombo");
      if (estado && estado.length > 0) fProcessos.estado = filtrarPorArray(processos, estado, "estado");
      if (cidade && cidade.length > 0) fProcessos.cidade = filtrarPorArray(processos, cidade, "cidade");

      let listasFiltradas = Object.values(fProcessos);
      if (listasFiltradas.length === 0) return processos

      let interseccao = listasFiltradas.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );
      return interseccao;
    },
    competencia() {
      return [...new Set(this.processosQuilomboLocalidade.map(p => p.competencia))].sort()
    },    
    jurisdicao() {
      return [...new Set(this.processosFiltrados.map(p => p.jurisdicao))].sort()
    },  
    comarca() {
      return [...new Set(this.processosFiltrados.map(p => p.comarca))].sort()
    },  
    foro() {
      return [...new Set(this.processosFiltrados.map(p => p.foro))].sort()
    },      
    vara() {
      return [...new Set(this.processosFiltrados.map(p => p.vara))].sort()
    },          
    quilombos() {
      return [...new Set(this.processosFiltrados.map(p => p.quilombo))].sort()
    },          
    estados() {
      return [...new Set(this.processosFiltrados.map(p => p.estado))].sort()
    },        
    cidades() {
      return [...new Set(this.processosFiltrados.map(p => p.cidade))].sort()
    },
    objProcessoDelete() {
      return {
        Bearer: this.token
      }
    }
  },
  mounted() {
    this.iniciarProcessos()
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha", "confirmar"]),
    ...mapActions("historico", ["setProcesso"]),
    async iniciarProcessos() {
      try {
        this.processos = this.getProcessos
        const { data } = await this.$axios.get(`/api/dados_processos`);
        this.processos = data;
        this.setProcesso(data)
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
    removerFiltro({ key, value }) {
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
              let response = await this.$axios.delete(`/api/tb_processo/${id}`, { data: this.objProcessoDelete });
              let { message } = response.data;
              this.sucesso({ titulo: 'Processo Excluido' });
              this.iniciarProcessos(); 
            } catch (error) {
              let { message } = error.response.data;
              let { status, statusText } = error.response;
              this.falha({ titulo: `${status} ${statusText}`, mensagem: message });
            }
          }
        },
      });
    },
    exportData(){
      const cols = [
        ['UUID', 'id'],
        ['Processo', 'processo'],
        ['Competência', 'competencia'],
        ['Jurisdição', 'jurisdicao'],
        ['Comarca', 'comarca'],
        ['Foro', 'foro'],
        ['Vara', 'vara'],
        ['Data Publicação', 'data'],
        ['Quilombo', 'quilombo'],
        ['Sentença', 'sentenca'],
        ['Cidade', 'cidade'],
        ['Estado', 'estado'],
        ['Advogados', 'advogados'],
        ['Partes', 'partes'],
      ]
      createExcel('Processos', this.processosFiltrados, cols);
    }
  }
}
</script>

<style scoped>
.grid_filter {
  display: grid;
  grid-template: ". . . ." min-content/ 1fr 1fr 1fr 1fr;
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
  color: #000000de;
}

.botoesAcao {
  display: flex;
  gap: 10px;
}
</style>