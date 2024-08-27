<template>
  <div v-if="open">
    <div
      class="modal-background"
      ref="modalBackground"
      @click="closeModal"
    ></div>
    <div ref="modal" class="modal" v-if="notification">
      <h1>{{ title }}</h1>
      <section v-if="$slots['default']"><slot /></section>
      <footer v-if="$slots['footer']">
        <v-btn text class="botao" color="vermelho_telha" @click="$emit('update:open', false)"> Cancelar </v-btn>
        <slot name="footer" />
      </footer>
    </div>
    <div ref="modal" class="modal" v-else>
      <h1>{{ title }}</h1>
      <v-icon @click="$emit('update:open', false)">mdi-close</v-icon>
      <section><slot /></section>
      <footer v-if="$slots['footer']"><slot name="footer" /></footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Titulo",
    },
    open: {
      type: Boolean,
      default: false,
    },
    notification: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    open: {
      handler: function (open) {
        if (open) {
          this.$nextTick(() => {
            this.$refs.modal.show = true;
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    closeModal(event) {
      if (event.target === this.$refs.modalBackground) {
        this.$emit("update:open", false);
      }
    },
  },
};
</script>

<style scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fundo semi-transparente */
  z-index: 999; /* Z-index para garantir que o modal fique sobreposto a outros elementos */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
  z-index: 1000;
}

.modal {
  display: grid;
  grid-template: "header close" min-content "main main" min-content "footer footer" min-content / 1fr min-content;
  gap: 5px;
  width: 50%;
  max-height: 90vh;  
  overflow-x: hidden;
  overflow-y: auto;
}
.modal > *{
  padding: 15px 30px;
}

.modal > h1 {
  grid-area: header;
  font-size: 24px;
  font-weight: 600;
  color: var(--v-roxo-base);
  font-family: var(--font-featured);
}

.modal > i {
  grid-area: close;
  cursor: pointer;
  color: var(--v-preto_noite-base);
}
.modal > section {
  grid-area: main;
}
.modal > footer {
  grid-area: footer;
  display: flex;
  justify-content: center;
  gap: 50px;
  background: var(--v-bege_escuro-base)
}
</style>
