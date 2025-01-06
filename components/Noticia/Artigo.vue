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
    <section><strong>Autor:</strong> {{ display.autor }}</section>
    <section><strong>Publicado em:</strong> {{ display.data }}</section>
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
        titulo: this.artigo.noticia_titulo || 'Sem titulo',
        autor: this.artigo.noticia_autor || 'Sem autor',
        data: this.$moment(this.artigo?.noticia_dt_publicacao || Date.now()).format('DD/MM/YYYY')
      }
    }
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha", "confirmar"]),
    abrirArtigo() {
      let { id, noticia_titulo } = this.artigo;
      if (this.to) {
        let urlMagica = noticia_titulo
        ? noticia_titulo
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
          name: 'dashboard-noticias-artigo',
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