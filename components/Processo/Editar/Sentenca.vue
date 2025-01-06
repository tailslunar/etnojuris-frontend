<template>
    <v-form v-model="isValid">
        <h3>Sentença</h3>
        <div class="sentenca">
            <v-select :items="sentencas" label="Sentença" item-text="nome" v-model="field.processo.sentenca_id" outlined
                clearable item-value="id"></v-select>

            <v-text-field label="Data da Publicação:" v-model="field.processo.data_publicacao" outlined clearable
                v-mask="'##/##/####'"></v-text-field>
            <v-text-field label="Data da Sentença:" v-model="field.processo.data_sentenca" outlined clearable
                v-mask="'##/##/####'"></v-text-field>
            <v-text-field label="Data da Distribuição:" v-model="field.processo.data_distribuicao" outlined clearable
                v-mask="'##/##/####'"></v-text-field>
        </div>
        <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="atualizarProcesso()"
            :disabled="!isValid">Atualizar Sentença</v-btn>

    </v-form>
</template>

<script>
import { mapActions } from "vuex";

export default {
    data: () => {
        return {
            field: {
                processo: {
                    sentenca_id: null,
                    data_publicacao: null,
                    data_sentenca: null,
                    data_distribuicao: null,
                }
            },
            isValid: false,
            sentencas: [],
            dados_processo: {},
        }
    },
    computed: {
        polos() {
            return [
                { value: 'Ativo', descricao: 'Ativo' },
                { value: 'Passivo', descricao: 'Passivo' },
                { value: null, descricao: 'Neutro' },
            ];
        },
        updateProcesso() {
            let { sentenca_id, data_publicacao, data_sentenca, data_distribuicao } = this.field.processo;

            const dataAPI = (data) => {
                if (!data) return null
                const [dia, mes, ano] = data.split('/');
                return `${ano}-${mes}-${dia}`;
            }

            data_publicacao = dataAPI(data_publicacao);
            data_sentenca = dataAPI(data_sentenca);
            data_distribuicao = dataAPI(data_distribuicao);

            let correcao = { sentenca_id, data_publicacao, data_sentenca, data_distribuicao };
            return { ...this.dados_processo.objProcesso, ...this.field.processo, ...correcao };
        }
    },
    mounted() {
        this.iniciarSentenca().then(() => this.iniciarProcesso());
    },
    methods: {
        ...mapActions("notificacao", ["sucesso", "falha"]),

        async iniciarSentenca() {
            try {
                const { data: { data } } = await this.$axios.get(`/api/tb_sentenca`);
                this.sentencas = data;
            } catch (error) {
                console.error("Erro ao carregar as sentencas:", error);
            }
        },

        async iniciarProcesso() {
            try {
                let id = this.$route.params.id;
                const { data } = await this.$axios.get(`/api/dados_processo/${id}`);
                this.dados_processo = data;

                this.field.processo.sentenca_id = data.objProcesso.sentenca_id;
                this.field.processo.data_publicacao = this.formatarData(data.objProcesso.data_publicacao);
                this.field.processo.data_sentenca = this.formatarData(data.objProcesso.data_sentenca);
                this.field.processo.data_distribuicao = this.formatarData(data.objProcesso.data_distribuicao);

            } catch (error) {
                console.error(error);
            }
        },
        formatarData(data) {
            if (!data) {
                return null; // Retorna null se o valor for nulo
            }

            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        },

        async atualizarProcesso() {
            try {
                let id = this.$route.params.id;

                const response = await this.$axios.put(`/api/tb_processo/${id}`, this.updateProcesso);
                let { message } = response.data;
                this.sucesso({ titulo: message });
                this.iniciarProcesso()
            } catch (error) {
                let { message } = error.response.data;
                let { status, statusText } = error.response;
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message });
            }
        }
    }
}
</script>

<style scoped>
h3 {
    color: var(--v-roxo-base);
    padding: 5px;
}

.sentenca {
    padding: 10px 0px;
    display: grid;
    grid-template: 'sentenca sentenca sentenca' 'dt_publicacao dt_sentenca dt_distribuicao' / 1fr 1fr 1fr;
    gap: 5px 40px;
}

.sentenca>*:nth-child(1) {
    grid-area: sentenca
}

.sentenca>*:nth-child(2) {
    grid-area: dt_publicacao;
}

.sentenca>*:nth-child(3) {
    grid-area: dt_sentenca;
}

.sentenca>*:nth-child(4) {
    grid-area: dt_distribuicao;
}
</style>