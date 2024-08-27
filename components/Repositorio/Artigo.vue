<template>
  <div class="item-repositorio">
    <header>
      <h1 @click.prevent="abrirArtigo">{{ repositorio.titulo }}</h1>
      <div v-show="isAdmin">
        <v-btn text color="roxo"
          :to="{ name: 'dashboard-repositorio-admin-editar-id', params: { id: repositorio.id } }">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn text color="vermelho_telha" @click.prevent="deleteRepositorio(repositorio.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </header>
    <div>
      <span>{{ repositorio.autor }}</span>,
      <span>{{ repositorio.ano }}</span>
    </div>
    <section>{{ repositorio.conteudo }}</section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ['repositorio'],
  computed: {
    ...mapGetters("auth", ["isAdmin", "token"]),
    objRepositorio() {
      return {
        Bearer: this.token
      }
    }
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha", "confirmar"]),
    abrirArtigo() {
      let { id } = this.repositorio
      this.$router.push({
        name: 'dashboard-repositorio-artigo',
        params: { artigo: id }
      })
    },
    async deleteRepositorio(id) {
      this.confirmar({
        titulo: 'Confirmar Exclusão',
        callback: async (confirmed) => {
          if (confirmed) {
            try {
              let response = await this.$axios.delete(`/api/tb_repositorio/${id}`, { data: this.objRepositorio });
              let { message } = response.data;
              this.sucesso({ titulo: message });
              this.$emit('up')
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