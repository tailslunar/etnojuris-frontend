<template>
    <Canvas header_with_template="Editar Glossário" :short="true" v-show="!!isAdmin">
        <template slot="coluna">
            <div class="rightIsAdmin">
                <v-btn depressed class="botao" color="amarelo_mostarda"
                    :to="{ name: 'dashboard-glossario' }">Voltar</v-btn>
            </div>
        </template>
        <v-form v-model="isValid">
            <v-text-field label="Termo" outlined v-model="glossario.termo" :rules="rules.termo"
                counter="100"></v-text-field>
            <v-textarea label="Descrição" outlined v-model="glossario.descricao" :rules="rules.descricao"
                counter="400"></v-textarea>
            <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="submitGlossario"
                :disabled="!isValid">Salvar</v-btn>
        </v-form>
    </Canvas>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    data: () => {
        return {
            glossario: {
                termo: "",
                descricao: "",
            },
            rules: {
                termo: [
                    (v) => !!v || "Termo é obrigatório",
                    (v) => (v && v.length <= 100) || "Termo não pode exceder 100 caracteres",
                ],
                descricao: [
                    (v) => !!v || "Descrição é obrigatória",
                    (v) => (v && v.length <= 400) || "Descrição não pode exceder 400 caracteres",
                ],
            },
            isValid: false,
        }
    },
    computed: {
        ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
        objGlossario() {
            return {
                Bearer: this.token,
                termo: this.glossario.termo,
                descricao: this.glossario.descricao,
                usuario_id: this.usuarioID,
            }
        }
    },
    mounted() {
        this.glossarioId()
    },
    methods: {
        ...mapActions("notificacao", ["sucesso", "falha"]),
        async glossarioId() {
            let { id } = this.$route.params
            try {
                const { data: { data } } = await this.$axios.get(`/api/tb_glossario/${id}`);
                this.glossario.termo = data.termo
                this.glossario.descricao = data.descricao
            } catch (error) {
                let { message } = error.response.data
                let { status, statusText } = error.response
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message })
            }
        },
        async submitGlossario() {
            if (!this.isValid) return;
            this.isValid = false
            let { id } = this.$route.params
            try {
                const response = await this.$axios.put(`/api/tb_glossario/${id}`, this.objGlossario);
                let { message } = response.data
                this.sucesso({ titulo: message })
                this.$router.push({ name: 'dashboard-glossario' })
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