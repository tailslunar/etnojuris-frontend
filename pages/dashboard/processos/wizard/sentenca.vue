<template>
    <Wizard>
        <template #footer>
            <v-btn class="botao lexend" color="amarelo_mostarda" outlined :disabled="voltar.disabled"
                v-text="voltar.text" @click.prevent="voltar.action" />
            <v-btn class="botao lexend" color="amarelo_mostarda" depressed :disabled="avancar.disabled"
                v-text="avancar.text" @click.prevent="avancar.action" />
        </template>

        <WizardMain titulo="Sentença">
            <v-form v-model="isValid">
                <v-text-field label="Data da publicação:" v-model="field.data_publicacao" outlined clearable v-mask="'##/##/####'"></v-text-field>
                <v-select :items="sentencas" label="Sentenca" item-text="nome" v-model="field.sentenca_id" outlined clearable item-value="id"></v-select>
            </v-form>
        </WizardMain>
    </Wizard>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        const field = {
            data_publicacao: "",
            sentenca_id: null,
        }
        return {
            field, isValid: false,
            sentencas:[],
        }
    },
    computed: {
        ...mapGetters("processo", ["processo"]),
        voltar() {
            return {
                text: "Voltar",
                disabled: false,
                action: () => this.$router.push({ name: `dashboard-processos-wizard-partes` })
            }
        },
        avancar() {
            return {
                text: "Finalizar",
                disabled: false,
                action: () => this.submitProcessoComplemento()
            }
        },
    },
    mounted() {
        this.iniciarSentenca()
        let { data_publicacao, sentenca_id } = this.processo
        if( data_publicacao !== undefined ){
            this.field.data_publicacao = data_publicacao
        }
        if( sentenca_id !== undefined ){
            this.field.sentenca_id = sentenca_id
        }
    },
    methods: {
        ...mapActions('processo', ['whatProcesso']),
        async iniciarSentenca() {
            this.loading = true;
            try {
                const { data: { data } } = await this.$axios.get(`/api/tb_sentenca`);
                this.sentencas = data;
            } catch (error) {
                this.sentencas.push({id: 1, nome: 'Sem informações'})
                console.error("Erro ao carregar:", error);
            } finally {
                this.loading = false;
            }
        },
        submitProcessoComplemento() {
            const processo = { ...this.processo }
            processo.data_publicacao = this.field.data_publicacao
            processo.sentenca_id = this.field.sentenca_id
            this.whatProcesso(processo)
            this.$router.push({ name: `dashboard-processos-wizard-finalizar` })
        }
    }
}
</script>