<template>
  <div class="item">
    <div data-grid="processo">
      <ProcessoItem label="Processo" :value="processo.objProcesso?.numero || '-'" />
      <ProcessoItem label="Competencia" :value="processo.objProcesso?.competencia || '-'" />
      <ProcessoItem label="Comarca" :value="processo.objProcesso?.comarca || '-'" />
      <ProcessoItem label="UF" :value="processo.objLocalidade?.uf || '-'" />
      <ProcessoItem label="Jurisdição" :value="processo.objProcesso?.jurisdicao || '-'" />
      <ProcessoItem label="Distribuição" :value="formatData(processo.objProcesso.data_distribuicao)" />
    </div>
    <div data-grid="parte">
      <h1>Quilombo</h1>
      <ProcessoItem label="Associação" :value="processo.objQuilombo?.associacao || '-'" />
      <ProcessoItem label="Polo" :value="processo.objProcesso?.polo || '-'" />
      <ProcessoItem label="Quilombo" :value="processo.objQuilombo?.associacao || '-'" />
    </div>
    <div data-grid="extra" v-if="partes.length > 0">
      <h1>Partes</h1>
      <ProcessoParte  v-for="(parte, i) in partes" :key="i" :parte="parte"/>
    </div>
    <div data-grid="sentenca">
      <h1>Sentença</h1>
      <ProcessoItem label="Classificação sentença" :value="processo.objSentenca?.nome || '-'" />
    </div>
  </div>
</template>
<script>
export default {
  props: ["processo"],
  computed: {
    partes() {
      const { objParte, objParticipante, objAdvogado, objProcurador, objDefensoria } = this.processo;
      let partesComRepresentantes = [];

      const getParteId = (id) => {
        let parte = objParte.flat().find(parte => parte.id == id);
        if (!parte) return {}
        return {
          nome: parte.nome,
          documento: parte.cpf_cnpj || parte.cnpj || parte.cpf || 'Sem Documento',
        }
      }

      const getParteRepresentanteId = (categoria, id) => {
        switch (categoria) {
          case 'advogado':
            let advogado = objAdvogado.flat().find(adv => adv.id == id);
            if (!advogado) return {}
            return advogado
            break;
          case 'procurador':
            let procurador = objProcurador.flat().find(pro => pro.id == id);
            if (!procurador) return {}
            return procurador
            break;
          case 'defensoria':
            let defensoria = objDefensoria.flat().find(dev => dev.id == id);
            if (!defensoria) return {}
            return defensoria
            break;
        }
      }

      partesComRepresentantes = objParticipante.map(p => ({
        categoria: {
          tipo: p.categoria,
          ...getParteRepresentanteId(p.categoria, p[`${p.categoria}_id`])
        },
        papel: {
          id: p.parte_id,
          tipo: p.papel,
          ...getParteId(p.parte_id)
        },
      }))

      return partesComRepresentantes;
    }
  },
  methods: {
    formatData(data) {
      if (!data) return data;
      const [year, month, day] = data.split('-');
      return `${day}/${month}/${year}`;
    }
  }
};
</script>
<style scoped>
.item {
  background: var(--v-branco-base);
  font-family: var(--font-featured);
  border-radius: 5px;
}

.item>div {
  padding: 10px 25px;
  border-bottom: 1px solid var(--v-amarelo_mostarda-base);
}

.item>div:last-child {
  border-bottom: none;
}

.item h1 {
  color: var(--v-preto_noite-base);
  font-size: 16px;
  grid-area: header;
}

/* LAYOUT */
.item>div {
  display: grid;
  gap: 15px;
}

.item h1 {
  grid-area: header;
}

.item>div[data-grid="processo"] {
  grid-template: ". . . . . ." / max-content 1fr 1fr 1fr 1fr 1fr;
}

.item>div[data-grid="parte"] {
  grid-template: "header header" ". ." ". . " / 1fr 1fr;
}

.item>div[data-grid="natureza"] {
  grid-template: "header" "." / 1fr;
}

.item>div[data-grid="extra"] {
  grid-template: "header" "." / 1fr;
  gap: 0px;
}

.item>div[data-grid="sentenca"] {
  grid-template:
    "header header header header header"
    ". . . . ."
    "final final final final final"
    / 1fr 1fr 1fr 1fr 1fr;
}

.item>div[data-grid="sentenca"]>*:last-child {
  grid-area: final;
}
</style>
