<template>
    <v-form v-model="isValid">
        <h3>Processo</h3>
        <div class="processo">
            <v-text-field label="Número do processo:" v-mask="'#######-##.####.#.##.####'"
                v-model="field.processo.numero" outlined clearable></v-text-field>

            <v-select :items="competencia" label="Competencia" item-text="descricao" item-value="descricao"
                v-model="field.processo.competencia" outlined clearable></v-select>


            <v-text-field label="Jurisdição:" v-model="field.processo.jurisdicao" outlined></v-text-field>
            <v-text-field label="Comarca:" v-model="field.processo.comarca" outlined></v-text-field>
            <v-text-field label="Foro:" v-model="field.processo.foro" outlined></v-text-field>
            <v-text-field label="Vara:" v-model="field.processo.vara" outlined></v-text-field>

            <v-select :items="estados" label="Estado" item-text="nome" v-model="field.processo.estado" outlined
                clearable item-value="sigla"></v-select>
            <v-autocomplete :items="cidadesUf" label="Cidade" :filter="acharCidade"
                v-model="field.processo.localidade_id" outlined clearable item-text="cidade"
                item-value="id"></v-autocomplete>
        </div>
        <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="atualizarProcesso()"
            :disabled="!isValid">Atualizar
            Processo</v-btn>
    </v-form>
</template>

<script>
import {  mapActions } from "vuex";
import estados from '~/services/estados';

export default {
    data: () => {
        return {
            field: {
                processo: {
                    numero: null,
                    competencia: null,
                    jurisdicao: null,
                    comarca: null,
                    foro: null,
                    vara: null,
                    localidade_id: null,
                    estado: null
                }
            },
            isValid: false,
            estados,
            cidades: [],
            dados_processo: {},
        }
    },
    computed: {
        competencia() {
            return [
                { id: 1, descricao: 'Federal' },
                { id: 2, descricao: 'Estadual' },
            ]
        },
        cidadesUf() {
            let { estado } = this.field.processo
            if (estado == null) {
                return this.cidades
            }
            return this.cidades.filter(cidade => cidade.uf === estado);
        },
        updateProcesso() {
            return { ...this.dados_processo.objProcesso, ...this.field.processo }
        }
    },
    mounted() {
        this.iniciarLocalizacao().then(() => this.iniciarProcesso())
    },
    methods: {
        ...mapActions("notificacao", ["sucesso", "falha"]),
        async iniciarLocalizacao() {
            try {
                const { data: { data } } = await this.$axios.get(`/api/tb_localidade`);
                this.cidades = data;
            } catch (error) {
                console.error("Erro ao carregar as localidades:", error);
            } 
        },
        acharCidade(item, queryText, itemText) {
            const normalizeText = (text) => {
                return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            };
            const searchTerms = normalizeText(queryText).split(' ');
            const normalizedItemText = normalizeText(`${item.cidade} ${item.uf}`);
            return searchTerms.every(term => normalizedItemText.includes(term));
        },
        async iniciarProcesso() {
            try {
                let id = this.$route.params.id
                const { data } = await this.$axios.get(`/api/dados_processo/${id}`);
                this.dados_processo = data
                // objProcesso
                this.field.processo.numero = data.objProcesso.numero
                this.field.processo.competencia = data.objProcesso.competencia
                this.field.processo.jurisdicao = data.objProcesso.jurisdicao
                this.field.processo.comarca = data.objProcesso.comarca
                this.field.processo.foro = data.objProcesso.foro
                this.field.processo.vara = data.objProcesso.vara
                this.field.processo.localidade_id = data.objProcesso.localidade_id
                this.field.processo.estado = data.objLocalidade.uf

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

.processo {
    padding: 10px 0px;
    display: grid;
    grid-template: 'nr nr nr comp' ' ju co fo va' 'estado estado cidade cidade' / 1fr 1fr 1fr 1fr;
    gap: 5px 40px;
}

.processo>*:nth-child(1) {
    grid-area: nr
}

.processo>*:nth-child(2) {
    grid-area: comp
}

.processo>*:nth-child(3) {
    grid-area: ju
}

.processo>*:nth-child(4) {
    grid-area: co
}

.processo>*:nth-child(5) {
    grid-area: fo
}

.processo>*:nth-child(6) {
    grid-area: va
}

.processo>*:nth-child(7) {
    grid-area: estado
}

.processo>*:nth-child(8) {
    grid-area: cidade
}
</style>