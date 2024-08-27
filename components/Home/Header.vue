<template>
  <section class="bloco" :class="isHeght">
    <div>
      <h4>Número de processos</h4>
      <h1>{{ nrProcesso }}</h1>
    </div>
    <div>
      <h4>Quilombos</h4>
      <h1>{{ nrQuilombo }}</h1>
    </div>
    <div>
      <h4>Tempo médio dos processos</h4>
      <h1>{{ tempoProcesso }} <span>Dias</span></h1>
    </div>
    <div>
      <h4>Processos com Sentença</h4>
      <h1>{{ sentenca }}</h1>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters("dashboard", ["dashboard"]),
    isHeght() {
      return this.$vuetify.breakpoint.name;
    },
    nrProcesso() {
      const estadosSelecionados = this.dashboard.estadosSelecionados;
      const estadosData = this.dashboard.estados;
      const estadosFiltrados = estadosData.filter((estado) =>
        estadosSelecionados.includes(estado.estado)
      );
      const totalProcesso = estadosFiltrados.reduce((acc, estado) => {
        return acc + (estado.total.processo || 0);
      }, 0);
      return totalProcesso;
    },
    nrQuilombo() {
      const estadosSelecionados = this.dashboard.estadosSelecionados;
      const estadosData = this.dashboard.estados;

      const estadosFiltrados = estadosData.filter((estado) =>
        estadosSelecionados.includes(estado.estado)
      );

      const totalQuilombo = estadosFiltrados.reduce((acc, estado) => {
        return acc + (estado.total.quilombo || 0);
      }, 0);
      return totalQuilombo;
    },
    tempoProcesso() {
      const estadosSelecionados = this.dashboard.estadosSelecionados;
      const estadosData = this.dashboard.estados;

      const estadosFiltrados = estadosData.filter((estado) =>
        estadosSelecionados.includes(estado.estado)
      );
      const maiorTempo = estadosFiltrados.reduce((max, estado) => {
        return Math.max(max, estado.total.tempo_meio || 0);
      }, 0);
      return maiorTempo;
    },
    sentenca() {
      const estadosSelecionados = this.dashboard.estadosSelecionados;
      const estadosData = this.dashboard.estados;
      const estadosFiltrados = estadosData.filter((estado) =>
        estadosSelecionados.includes(estado.estado)
      );
      const totalSentenca = estadosFiltrados.reduce((acc, estado) => {
        const sentenca = estado.sentenca;
        const somaSentenca = Object.values(sentenca).reduce(
          (sum, valor) => sum + (valor || 0),
          0
        );
        return acc + somaSentenca;
      }, 0);
      return totalSentenca;
    },
  },
};
</script>

<style scoped>
.bloco {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);
}
.bloco:is(.md, .sm) {
  grid-template-columns: repeat(2, 1fr);
}
.bloco:is(.xs) {
  grid-template-columns: repeat(1, 1fr);
}
.bloco > * {
  font-family: var(--font-featured);
  background: var(--v-bege_claro-base);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  border-radius: 8px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.bloco h4 {
  font-weight: 600;
  font-size: 16px;
}

.bloco h1 {
  font-weight: 300;
  font-size: 40px;
  color: var(--v-roxo-base);
}

.bloco h1 > span {
  font-size: 24px;
  color: var(--v-preto_noite-base);
}
</style>
