<template>
  <Canvas>
    <QuilomboPesquisar @update_filterby="updateFilterBy" />
    <header>
      <div>Quilombos</div>
      <div>
        <v-btn depressed class="botao" color="bege_sombrio" :to="{ name: 'dashboard-quilombos' }">
          <v-icon>mdi-map-marker</v-icon> Mapa
        </v-btn>
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
              <v-divider></v-divider>
              <v-card-actions class="justify-end">
                <v-btn class="botao lexand" color="roxo branco--text" @click="dialog.value = false">Confirmar</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-btn depressed class="botao" color="bege_sombrio" @click.prevent="exportData">
          <v-icon>mdi-tray-arrow-down</v-icon> Exportar</v-btn>
        <v-btn depressed class="botao" color="amarelo_mostarda" v-if="!!this.isAdmin"
          :to="{ name: 'dashboard-quilombos-admin-novo' }">
          <v-icon>mdi-plus</v-icon> <span>Adicionar Quilombo</span>
        </v-btn>
      </div>
    </header>
    <div>
      <v-chip v-for="(filtro, i) in filtrosAtivos" :key="i" class="ma-2" color="roxo branco--text" close
        @click:close="removerFiltro(filtro)">{{ filtro.value }}</v-chip>
    </div>
    <v-data-table :headers="headers" :items="quilombosFiltrados" item-key="id">
      <template v-slot:item._nr_processo="{ item }">
        <template v-if="item.nr_processo === 0">
          <v-btn text class="botao" color="roxo" disabled>0 Processo </v-btn>
        </template>
        <template v-if="item.nr_processo === 1">
          <v-btn text class="botao" color="roxo"
            :to="{ name: 'dashboard-quilombos-processos-nr', params: { nr: item.processos } }"> 1 Processo </v-btn>
        </template>
        <template v-if="item.nr_processo > 1">
          <v-btn text class="botao" color="roxo"
            :to="{ name: 'dashboard-quilombos-processos-nr', params: { nr: item.processos } }"> {{ item.nr_processo }}
            Processos </v-btn>
        </template>
      </template>

      <template v-slot:item._action="{ item }">
        <div class="botoesAcao">
          <v-btn small text color="roxo"
            :to="{ name: 'dashboard-quilombos-admin-editar-id', params: { id: item.id } }"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn small text color="vermelho_telha"
            @click.prevent="deleteQuilombo(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
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
      quilombos: [],
      headerTable: [
        { text: "#", value: "id", align: "start", show: true, hidden: false, width: "100" },
        { text: "CNPJ", value: "cnpj", show: false, hidden: false },
        { text: "Quilombo", value: "nome", show: false, hidden: false },
        { text: "Quilombo/Associacao", value: "associacao", show: true, hidden: false },
        { text: "Processos", value: "_nr_processo", show: true, hidden: false, width: "200" },
        { text: "Cidade", value: "cidade", show: true, hidden: false },
        { text: "Estado", value: "estado", show: true, hidden: false },
        //{ text: "CEP", value: "cep", show: false, hidden: false },
        //{ text: "Endereço", value: "endereco", show: false, hidden: false },
        //{ text: "Número", value: "numero", show: false, hidden: false },
        //{ text: "Latitude", value: "latitude", show: false, hidden: false },
        //{ text: "Longitude", value: "longitude", show: false, hidden: false },
        //{ text: "Área", value: "area", show: false, hidden: false },
        //{ text: "IDLocalidade", value: "localidade_id", hidden: false },
        //{ text: "Localidade", value: "localidade_id", show: false, hidden: false },
        //{ text: "IDUsuario", value: "usuario_id", hidden: false },
        //{ text: "Usuário", value: "usuario_id", show: false, hidden: false },
        { text: " ", value: "_action", show: true, hidden: true, width: "150" }
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
    ...mapGetters("historico", ["getQuilombos"]),
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

      const quilombos = this.quilombos.map(q => (
        {
          id: q.id,
          nome: q.nome,
          associacao: q.associacao,
          cnpj: q.cnpj,
          nr_processo: q.processos.length,
          processos: q.processos.length > 0
            ? q.processos.map(p => p.id).join('|')
            : '',
          cidade: q.localidade?.cidade || '-',
          estado: q.localidade?.uf || '-',
        }
      ))

      let fQuilombos = {};

      if (nome) {
        const termosNome = nome.split(" ").map(normalizarTexto);
        fQuilombos.nome = quilombos.filter(q =>
          termosNome.every(termo => normalizarTexto(q.nome).includes(termo)) ||
          termosNome.every(termo => normalizarTexto(q.associacao).includes(termo))
        );
      }

      if (associacao) {
        const termosAssociacao = associacao.split(" ").map(normalizarTexto);
        fQuilombos.associacao = quilombos.filter(q =>
          termosAssociacao.every(termo => normalizarTexto(q.nome).includes(termo)) ||
          termosAssociacao.every(termo => normalizarTexto(q.associacao).includes(termo))
        );
      }

      if (cnpj) fQuilombos.cnpj = quilombos.filter(q => q.cnpj == cnpj);

      if (localidade) {
        const termosLocalidade = localidade.split(" ").map(normalizarTexto);
        fQuilombos.localidade = quilombos.filter(q =>
          termosLocalidade.every(termo => normalizarTexto(q.cidade).includes(termo)) ||
          termosLocalidade.every(termo => normalizarTexto(q.estado).includes(termo))
        );
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
    objQuilomboDelete() {
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
    ...mapActions("historico", ["setQuilombo"]),
    async iniciarQuilombo() {
      this.quilombos = this.getQuilombos
      try {
        const { data } = await this.$axios.get(`/api/quilombos_processos`);
        this.quilombos = data;
        this.setQuilombo(data)
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
              let response = await this.$axios.delete(`/api/tb_quilombo/${id}`, { data: this.objQuilomboDelete });
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
    exportData() {
      const cols = [
        ['UUID', 'id'],
        ['Nome do Quilombo', 'nome'],
        ['Associação', 'associacao'],
        ['CNPJ', 'cnpj'],
        ['Total Processos', 'nr_processo'],
        ['Cidade', 'cidade'],
        ['Estado', 'estado'],
      ]
      createExcel('Quilombos', this.quilombosFiltrados, cols);
    }
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
