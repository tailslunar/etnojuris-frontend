<template>
  <section>
    <div style="display: flex; gap: 10px; flex-wrap: wrap">
      <v-btn
        v-for="regiao in Object.keys(dashboard.regiao)"
        :key="regiao"
        class="botao"
        color="roxo"
        :outlined="!dashboard.regiao[regiao].selected"
        x-small
        @click.prevent="regiaoIs(regiao)"
      >
        {{ dashboard.regiao[regiao].nome }}
      </v-btn>
    </div>
    <CheckboxSvgMap
      :map="BrazilMap"
      v-model="selecionados"
      @mouseover="atualizaProcessoQuilombo"
      @mousemove="updatePosicaoMouse"
      @mouseleave="mouse.state = false"
    />
    <div
      v-if="mouse.state"
      class="state-name-box"
      :style="{ top: mouse.y + 'px', left: mouse.x + 'px' }"
    >
      <h1>{{ mapEstado.estado }}</h1>
      <div>Processos: {{ mapEstado.processo }}</div>
      <div>Quilombos: {{ mapEstado.quilombo }}</div>
    </div>
  </section>
</template>

<script>
import BrazilMap from "@svg-maps/brazil";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      BrazilMap,
      mouse: {
        state: false,
        x: 0,
        y: 0,
      },
      mapEstado:{}
    };
  },
  computed: {
    ...mapGetters("dashboard", ["dashboard", "estadoProcessoQuilombo"]),
    selecionados: {
      get() {
        return this.dashboard.estadosSelecionados.map((state) =>
          state.toLowerCase()
        );
      },
      set(value) {
        this.setDashboardEstado(value.map((state) => state.toUpperCase()));
      },
    },
  },
  methods: {
    ...mapActions("dashboard", [
      "setDashboardEstado",
      "setDashboardRegiaoSelected",
    ]),
    regiaoIs(regiao) {
      this.setDashboardRegiaoSelected(regiao); // Chama a mutação que seleciona a região
      this.selecionados = this.dashboard.regiao[regiao].estados; // Atualiza os selecionados com os estados da região
    },
    atualizaProcessoQuilombo(e) {
      let estado = e.target.getAttribute("id")
      this.mapEstado = this.estadoProcessoQuilombo(estado.toUpperCase())
      this.mouse.state = true;
    },
    updatePosicaoMouse(e) {
      this.mouse.x = e.pageX + 15;
      this.mouse.y = e.pageY + 15;
    },
  },
};
</script>

<style scoped>
.state-name-box {
  position: absolute;
  background-color: white;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.state-name-box {
  display: flex;
  flex-direction: column;
}
.state-name-box h1 {
  font-size: 12px;
  color: var(--v-preto_noite-base);
}
.state-name-box div {
  font-size: 12px;
  color: var(--v-roxo-base);
}
</style>
