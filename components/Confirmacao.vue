<template>
  <v-dialog v-model="confirmar" max-width="500px">
    <v-card>
      <v-card-title class="headline">{{ titulo }}</v-card-title>
      <v-card-text>{{ mensagem }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text depressed class="botao" color="cinza_medio"
          @click="handleConfirm(false)">Cancelar</v-btn>
        <v-btn depressed class="botao" color="amarelo_mostarda" @click="handleConfirm(true)">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("notificacao", ["confirmar", "titulo", "mensagem", "confirmarCallback"]),
  },
  methods: {
    ...mapActions("notificacao", ["confirmarReset"]),
    handleConfirm(response) {
      if (this.confirmarCallback) {
        this.confirmarCallback(response);
      }
      this.confirmarReset();
    },
  },
};
</script>