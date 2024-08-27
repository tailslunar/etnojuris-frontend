<template>
    <Wizard>
        <template #footer>
            <v-btn class="botao lexend" color="amarelo_mostarda" outlined :disabled="voltar.disabled"
                v-text="voltar.text" @click.prevent="voltar.action" />
            <v-btn class="botao lexend" color="amarelo_mostarda" depressed :disabled="avancar.disabled"
                v-text="avancar.text" @click.prevent="avancar.action" />
        </template>

        <WizardMain titulo="Dados do processo">
            <v-form v-model="isValid">
                <v-text-field label="Número do processo:" v-mask="'#######-##.####.#.##.####'" v-model="field.numero"
                    :rules="rules.numero" outlined clearable></v-text-field>
                <section :rules="rules.competencia">
                    <div>Competência:</div>
                    <v-btn-toggle>
                        <v-btn class="botao lexend" :color="field.competencia == 1 ? `roxo` : ``"
                            :class="{ vejaMais: field.competencia == 1 }" @click.prevent="field.competencia = 1">
                            <v-icon v-if="field.competencia == 1"
                                class="mr-2 vejaMais">mdi-checkbox-marked-circle</v-icon>
                            Federal
                        </v-btn>
                        <v-btn class="botao lexend" :color="field.competencia == 2 ? `roxo` : ``"
                            :class="{ vejaMais: field.competencia == 2 }" @click.prevent="field.competencia = 2">
                            <v-icon v-if="field.competencia == 2"
                                class="mr-2 vejaMais">mdi-checkbox-marked-circle</v-icon>
                            Estadual
                        </v-btn>
                    </v-btn-toggle>
                </section>
                <v-text-field label="Jurisdição:" v-model="field.jurisdicao" outlined></v-text-field>
                <v-text-field label="Comarca:" v-model="field.comarca" outlined></v-text-field>
                <v-text-field label="Foro:" v-model="field.foro" outlined></v-text-field>
                <v-text-field label="Vara:" v-model="field.vara" outlined></v-text-field>
                <div class="row_grid">
                    <v-select :items="estados" label="Estado" item-text="nome" v-model="field.estado" outlined clearable
                        :rules="rules.estado" item-value="sigla"></v-select>
                    <v-autocomplete :items="cidadesUf" label="Cidade" :filter="acharCidade" v-model="field.cidade"
                        :rules="rules.cidade" outlined clearable item-text="cidade" item-value="id"></v-autocomplete>
                </div>
            </v-form>
        </WizardMain>
    </Wizard>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import estados from '~/services/estados';
export default {
    data: () => {
        const field = {
            numero: "",
            competencia: null,
            jurisdicao: "",
            comarca: "",
            foro: "",
            vara: "",
            cidade: "",
            estado: "",
        }

        const rules = {
            numero: [
                (v) => !!v || "Número do processo é obrigatório",
                (v) => /^[0-9]{7}-[0-9]{2}\.[0-9]{4}\.[0-9]\.[0-9]{2}\.[0-9]{4}$/.test(v)
            ],
            competencia: [(v) => !!v || "Competencia é obrigatório"],

            cidade: [(v) => !!v || "Cidade é obrigatório"],
            estado: [(v) => !!v || "Estado é obrigatório"],
        }
        return {
            field, rules, isValid: false,
            estados,
            cidades: [],
        }
    },
    computed: {
        ...mapGetters("auth", ["usuarioID"]),
        ...mapGetters("processo", ["processo"]),
        voltar() {
            return {
                text: "Voltar",
                disabled: false,
                action: () => this.$router.push({ name: `dashboard-processos-wizard-endereco` })
            }
        },
        avancar() {
            return {
                text: "Avançar",
                disabled: !this.isValid,
                action: () => this.submitProcesso()
            }
        },
        cidadesUf() {
            let { estado } = this.field
            if (estado == null) {
                return this.cidades
            }
            return this.cidades.filter(cidade => cidade.uf === estado);
        },
        objProcesso() {
            return {
                numero: this.field.numero,
                competencia: this.field.competencia == 1 ? 'Federal' : 'Estadual',
                jurisdicao: this.field.jurisdicao,
                comarca: this.field.comarca,
                foro: this.field.foro,
                vara: this.field.vara,
                localidade_id: this.field.cidade,
                usuario_id: this.usuarioID,
            }
        }
    },
    watch: {
        "field.numero"(processo) {
            if (processo == null) return
            if (processo.includes('.4.'))
                this.field.competencia = 1
            if (processo.includes('.8.'))
                this.field.competencia = 2
        },
    },
    mounted() {
        this.iniciarLocalizacao().finally( _ => {
            let {numero,  competencia, jurisdicao, comarca, foro, vara, localidade_id } = this.processo
            if(numero !== undefined){
                this.field.numero = numero
                this.field.competencia = competencia
                this.field.jurisdicao = jurisdicao
                this.field.comarca = comarca
                this.field.foro = foro
                this.field.vara = vara
                let cidade = this.cidades.find(c => c.id == localidade_id)
                this.field.estado = cidade.uf
                this.field.cidade = cidade.id
            }
        })
    },
    methods: {
        ...mapActions('processo', ['whatProcesso']),
        async iniciarLocalizacao() {
            this.loading = true;
            try {
                const { data: { data } } = await this.$axios.get(`/api/tb_localidade`);
                this.cidades = data;
            } catch (error) {
                console.error("Erro ao carregar as localidades:", error);
            } finally {
                this.loading = false;
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
        submitProcesso() {
            const processo = { ...this.objProcesso }
            this.whatProcesso(processo)
            this.$router.push({ name: `dashboard-processos-wizard-partes` })
        }
    }
};
</script>

<style scoped>
section {
    padding: 0px 0px 40px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
}

.row_grid {
    display: grid;
    grid-template: ". ." / 1fr 1fr;
    gap: 20px;
}
</style>