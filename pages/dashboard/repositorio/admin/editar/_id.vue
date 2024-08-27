<template>
    <Canvas header_with_template="Editar Repositório" :short="true" v-show="!!isAdmin">
        <template slot="coluna">
            <div class="rightIsAdmin">
                <v-btn depressed class="botao" color="amarelo_mostarda"
                    :to="{ name: 'dashboard-repositorio' }">Voltar</v-btn>
            </div>
        </template>
        <v-form v-model="isValid">
            <v-text-field v-model="repositorio.titulo" :rules="rules.titulo" required label="Título:" outlined
                counter="200"></v-text-field>
            <v-text-field v-model="repositorio.autor" :rules="rules.autor" required label="Autor:" outlined
                counter="200"></v-text-field>
            <v-text-field v-model="repositorio.ano" :rules="rules.ano" required label="Ano:" outlined></v-text-field>
            <v-textarea v-model="repositorio.conteudo" :rules="rules.conteudo" label="Conteúdo" outlined></v-textarea>

            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="formattedDate" label="Data da Publicação" readonly v-bind="attrs" v-on="on"
                        :rules="rules.data_publicacao" outlined></v-text-field>
                </template>
                <v-date-picker v-model="repositorio.data_publicacao" no-title @input="updateDate"
                    :max="new Date().toISOString().substr(0, 10)"></v-date-picker>
            </v-menu>

            <v-text-field v-model="repositorio.link" label="Link da Publicação ou Url do Arquivo:" outlined
                counter="200"></v-text-field>
            <v-text-field v-model="repositorio.palavras_chave" label="Palavras-chaves:" outlined
                counter="200"></v-text-field>
            <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="submitRepositorio"
                :disabled="!isValid">Salvar</v-btn>
        </v-form>
    </Canvas>
</template>




<script>
import { mapGetters, mapActions } from "vuex"

export default {
    data: () => {
        return {
            repositorio: {
                titulo: "",
                autor: "",
                ano: "",
                conteudo: "",
                link: "",
                data_publicacao: "",
                palavras_chave: "",
            },
            menu: false,
            rules: {
                titulo: [
                    (v) => !!v || "Título é obrigatório",
                    (v) => (v && v.length <= 200) || "Título não pode exceder 200 caracteres",
                ],
                autor: [
                    (v) => !!v || "Autor é obrigatório",
                    (v) => (v && v.length <= 200) || "Autor não pode exceder 200 caracteres",
                ],
                ano: [
                    (v) => !!v || "Ano é obrigatório",
                    (v) => /^\d{4}$/.test(v) || "Ano deve ser um número de 4 dígitos",
                ],
                conteudo: [
                    (v) => !!v || "Conteúdo é obrigatório",
                    (v) => (v && v.length <= 4000) || "Conteúdo não pode exceder 4000 caracteres",
                ],
                data_publicacao: [
                    (v) => !!v || "Data da publicação é obrigatória",
                ],
                link: [
                    (v) => (v && v.length <= 200) || "Link não pode exceder 200 caracteres",
                ],
                palavras_chave: [
                    (v) => (v && v.length <= 200) || "Palavras-chaves não podem exceder 200 caracteres",
                ],
            },
            isValid: false,
        }
    },
    computed: {
        ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
        formattedDate() {
            return this.repositorio.data_publicacao ? this.$moment(this.repositorio.data_publicacao).format('DD/MM/YYYY') : ''
        },
        objRepositorio() {
            return {
                Bearer: this.token,
                titulo: this.repositorio.titulo,
                autor: this.repositorio.autor,
                ano: this.repositorio.ano,
                conteudo: this.repositorio.conteudo,
                link: this.repositorio.link,
                palavras_chave: this.repositorio.palavras_chave,
                data_publicacao: this.repositorio.data_publicacao,
                usuario_id: this.usuarioID,
            }
        }
    },
    mounted() {
        this.iniciarRepositorio();
    },
    methods: {
        ...mapActions("notificacao", ["sucesso", "falha"]),
        async iniciarRepositorio() {
            let { id } = this.$route.params
            try {
                const { data: { data } } = await this.$axios.get(`/api/tb_repositorio/${id}`);
                this.repositorio.titulo = data.titulo
                this.repositorio.autor = data.autor
                this.repositorio.ano = data.ano
                this.repositorio.conteudo = data.conteudo
                this.repositorio.link = data.link
                this.repositorio.data_publicacao = data.data_publicacao
                this.repositorio.palavras_chave = data.palavras_chave
            } catch (error) {
                let { message } = error.response.data
                let { status, statusText } = error.response
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message })
            }
        },
        updateDate(val) {
            this.repositorio.data_publicacao = this.$moment(val).format('YYYY-MM-DD')
            this.menu = false
        },
        async submitRepositorio() {
            if (!this.isValid) return;
            this.isValid = false
            let { id } = this.$route.params
            try {
                const response = await this.$axios.put(`/api/tb_repositorio/${id}`, this.objRepositorio);
                let { message } = response.data
                this.sucesso({ titulo: message })
                this.$router.push({ name: 'dashboard-repositorio' })
            } catch (error) {
                let { message } = error.response.data
                let { status, statusText } = error.response
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message })
            } finally {
                this.isValid = true
            }
        },
    }
}
</script>
