<template>
  <div class="item-repositorio">
    <header>
      <h1 @click.prevent="abrirArtigo">{{ display.titulo }}</h1>
      <div v-show="isAdmin">
        <v-btn text color="roxo" :to="{ name: 'dashboard-repositorio-admin-editar-id', params: { id: display.id } }">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn text color="vermelho_telha" @click.prevent="deleteRepositorio(display.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </header>
    <section><strong>Publicado em:</strong> {{ display.data }}</section>
    <section><strong>Nível:</strong> {{ display.nivel }}</section>
    <section><strong>Órgão:</strong> {{ display.orgao }}</section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ['artigo', 'to'],
  computed: {
    ...mapGetters("auth", ["isAdmin", "token"]),
    objRepositorio() {
      return {
        Bearer: this.token
      }
    },
    display() {
      return {
        id: this.artigo.id,
        titulo: this.artigo.legislacao_titulo,
        data: this.$moment(this.artigo?.legislacao_dt_publicacao || Date.now()).format('DD/MM/YYYY'),
        nivel: this.artigo.legislacao_nivel || '-',
        orgao: this.artigo.legislacao_orgao || '-',
      }
    }
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha", "confirmar"]),
    abrirArtigo() {
      let { id, legislacao_titulo } = this.artigo;
      if (this.to) {
        let urlMagica = legislacao_titulo
        ? legislacao_titulo
            .normalize("NFD") // Remove acentos e diacríticos
            .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas restantes
            .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove caracteres especiais, exceto letras, números, espaços e hífens
            .trim() // Remove espaços no início e no fim
            .replace(/\s+/g, "-") // Substitui espaços por hífen
            .toLowerCase() // Converte tudo para minúsculas
          : '0000-0000-0000-0000'; // Valor padrão caso não tenha título

        this.$router.push({
          name: this.to,
          params: {
            id,
            artigo: urlMagica // Usa a URL mágica
          }
        });
      } else {
        this.$router.push({
          name: 'dashboard-legislacao-artigo',
          params: { artigo: id }
        });
      }
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