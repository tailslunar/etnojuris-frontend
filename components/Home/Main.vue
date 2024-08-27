<template>
  <section class="bloco" :class="isHeght">
    <div grid="mapa">
      <h4>Processos</h4>
      <HomeGraficoMapaInterativo />
    </div>

    <section>
      <div>
        <HomeGraficoMicroRegiao />
      </div>
      <div>
        <h3>Por Estado</h3>
        <HomeGraficoPorEstado />
      </div>
    </section>

    <section>
      <div>
        <h3>Pólo do quilombo</h3>
        <HomeGraficoQuilombo />
      </div>
      <div>
        <h3>Sentenças</h3>
        <HomeGraficoSentencas />
      </div>
    </section>
  </section>
</template>

<script>
export default {
  computed: {
    isHeght() {
      return this.$vuetify.breakpoint.name;
    },
  },
};
</script>

<style scoped>
.bloco {
  box-sizing: border-box;
  display: grid;
  gap: 20px;
  grid-template: "mapa mapa . ." / 1fr 1fr 1fr 1fr;
  align-items: start;
}
.bloco:is(.sm) {
  grid-template: "mapa mapa" ". ." / 1fr 1fr;
}
.bloco:is(.xs) {
  grid-template: "mapa" "." "." "." / 1fr;
}
.bloco section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.bloco > div,
.bloco > section > div {
  font-family: var(--font-featured);
  background: var(--v-bege_claro-base);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.bloco h4 {
  font-weight: 600;
  font-size: 16px;
}

.bloco h3 {
  font-weight: 600;
  font-size: 12px;
  color: var(--v-roxo-base);
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

/* LAYOUT */
.bloco div[grid="mapa"] {
  grid-area: mapa;
}
</style>
