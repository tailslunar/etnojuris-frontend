<template>
    <v-form v-model="isValid">
        <h3>Quilombo</h3>
        <div class="quilombo">
            <v-radio-group v-model="field.processo.polo" row>
                <v-radio v-for="(polo, p) in polos" :key="p" :label="polo.descricao" :value="polo.value"></v-radio>
            </v-radio-group>

            <v-autocomplete :items="quilombos" label="Quilombo" item-text="nome" v-model="field.processo.quilombo_id"
                outlined clearable item-value="id"></v-autocomplete>
        </div>
        <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="atualizarProcesso()"
            :disabled="!isValid">Atualizar Quilombo</v-btn>
    </v-form>
</template>

<script>
import { mapActions } from "vuex";

export default {
    data: () => {
        return {
            field: {
                processo: {
                    quilombo_id: null,
                    polo: null,
                }
            },
            isValid: false,
            quilombos: [],
            dados_processo: {},
        }
    },
    computed: {
        polos() {
            return [
                { value: 'Ativo', descricao: 'Ativo' },
                { value: 'Passivo', descricao: 'Passivo' },
                { value: null, descricao: 'Neutro' },
            ]
        },
        updateProcesso() {
            return { ...this.dados_processo.objProcesso, ...this.field.processo }
        }
    },
    mounted() {
        this.iniciarQuilombo().then(() => this.iniciarProcesso())
    },
    methods: {
        ...mapActions("notificacao", ["sucesso", "falha"]),
        async iniciarQuilombo() {
            this.loading = true;
            try {
                const { data: { data } } = await this.$axios.get(`/api/tb_quilombo`);
                this.quilombos = data;
            } catch (error) {
                console.error("Erro ao carregar os quilombos:", error);
            } finally {
                this.loading = false;
            }
        },
        acharQuilombo(item, queryText, itemText) {
            const searchTerms = queryText.toLowerCase().split(' ');
            return searchTerms.every(term => itemText.toLowerCase().includes(term));
        },
        async iniciarProcesso() {
            try {
                let id = this.$route.params.id
                const { data } = await this.$axios.get(`/api/dados_processo/${id}`);
                this.dados_processo = data
                this.field.processo.quilombo_id = data.objProcesso.quilombo_id
                this.field.processo.polo = data.objProcesso.polo
            } catch (error) {
                console.error(error)
            }
        },
        async atualizarProcesso() {
            try {
                let id = this.$route.params.id
                const response = await this.$axios.put(`/api/tb_processo/${id}`, this.updateProcesso);
                let { message } = response.data
                this.sucesso({ titulo: message })
                this.$router.go(0);
            } catch (error) {
                let { message } = error.response.data
                let { status, statusText } = error.response
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message })
            }
        },
    }
}

</script>




<style scoped>
h3 {
    color: var(--v-roxo-base);
    padding: 5px;
}

.quilombo {
    padding: 10px 0px;
    display: grid;
    grid-template: 'polo qui' / max-content 1fr;
    gap: 5px 40px;
}

.quilombo>*:nth-child(1) {
    grid-area: polo
}

.quilombo>*:nth-child(2) {
    grid-area: qui
}
</style>