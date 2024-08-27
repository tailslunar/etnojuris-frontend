<template>
  <div class="item">
    <div data-grid="processo">
      <ProcessoItem label="Processo" value="1000.00.0000.0000-0000" />
      <ProcessoItem label="Comarca" value="TJAP" />
      <ProcessoItem label="UF" value="AP" />
      <ProcessoItem label="Tribunal" value="TRMG3" />
      <ProcessoItem label="Distribuição" value="12/03/2022" />
    </div>
    <div data-grid="parte">
      <h1>Parte monitorada</h1>
      <ProcessoItem
        label="Nome"
        value="Associação de Moradores da Comunidade Quilombola de Conceição do Macacoari"
      />
      <ProcessoItem label="Polo" value="Passivo" />
      <ProcessoItem
        label="Nome do Quilombo"
        value="Quilombo de Conceição do Macacoari"
      />
    </div>
    <div data-grid="natureza">
      <h1>Natureza</h1>
      <ProcessoItem value="Direito Civil Coisas Posse Esbulho Turbação Ameaça" />
      <ProcessoItem
        value="Direito Civil 899 - Coisas - 10432 - Posse 10444 - Esbulho Turbação Ameaça 10445"
      />
    </div>
    <div data-grid="extra">
      <h1>Assusto Extra</h1>
      <ProcessoItem value="Direito Civil Coisas Posse Esbulho Turbação Ameaça" />
      <ProcessoItem
        value="Direito Civil 899 - Coisas - 10432 - Posse 10444 - Esbulho Turbação Ameaça 10445"
      />
    </div>
    <div data-grid="sentenca">
      <h1>Senteça</h1>
      <ProcessoItem label="Status" value="Sim" />
      <ProcessoItem label="Data da sentença" value="10/10//2017" />
      <ProcessoItem label="Classificação sentença" value="SENTENCA_SEM_INFORMACAO" />
      <ProcessoItem label="Transitado julg." value="Sim" />
      <ProcessoItem label="Arquivado" value="Definitivo" />
      <ProcessoItem
        label="Texto da sentença"
        value="Juntada de certidão de trânsito em julgado"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: ["processo"],
  mounted(){
    this.init()
  },
  methods:{
    async init(){

    }
  }
};
</script>
<style scoped>
.item {
  background: var(--v-bege_escuro-base);
  font-family: var(--font-featured);
  border-radius: 25px;
}
.item > div {
  padding: 10px 25px;
  border-bottom: 1px solid var(--v-amarelo_mostarda-base);
}
.item > div:last-child {
  border-bottom: none;
}
.item h1 {
  color: var(--v-preto_noite-base);
  font-size: 16px;
  grid-area: header;
}
/* LAYOUT */
.item > div {
  display: grid;
  gap: 15px;
}
.item h1 {
  grid-area: header;
}

.item > div[data-grid="processo"] {
  grid-template: ". . . . ." / 1fr 1fr 1fr 1fr 1fr;
}
.item > div[data-grid="parte"] {
  grid-template: "header header" ". ." ". . "/ 1fr 1fr;
}
.item > div[data-grid="natureza"] {
  grid-template: "header" "." / 1fr;
}
.item > div[data-grid="extra"] {
  grid-template: "header" "." / 1fr;
}
.item > div[data-grid="sentenca"] {
  grid-template: 
    "header header header header header" 
    ". . . . ." 
    "final final final final final"
    / 1fr 1fr 1fr 1fr 1fr;
}
.item > div[data-grid="sentenca"] > *:last-child {
  grid-area: final;
}
</style>
