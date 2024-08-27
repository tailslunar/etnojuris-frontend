<template>
    <v-dialog width="600" @input="iniciar">
        <template v-slot:activator="{ on, attrs }">
            <v-btn depressed class="botao" color="amarelo_mostarda" v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon> Adicionar partes
            </v-btn>
        </template>
        <template v-slot:default="dialog">
            <v-form v-model="isValid" ref="form" lazy-validation>
                <div class="partes lexend">
                    <header>Tipo de Parte</header>
                    <section>
                        <v-btn-toggle class="grid_four">
                            <v-btn v-for="({ label, key }) in papeis" :key="key" class="botao"
                                :color="field.papel == key ? `roxo` : `preto_noite`" :outlined="field.papel != key"
                                @click.prevent="field.papel = key">
                                <v-icon class="mr-1" color="branco" v-if="field.papel == key">
                                    mdi-checkbox-marked-circle
                                </v-icon> {{ label }}
                            </v-btn>
                        </v-btn-toggle>

                        <div class="row_grid">
                            <v-text-field label="Nome" outlined v-model="field.nome" :rules="rules.nome"></v-text-field>
                            <v-text-field label="CFP/CNPJ" outlined v-model="field.cpf_cnpj" :rules="rules.cpf_cnpj"
                                v-mask="maskCPFCNPJ" @input="cpf_cnpj_valid"></v-text-field>
                        </div>
                        <header>Representante legal</header>
                        <v-btn-toggle class="grid_four">
                            <v-btn v-for="({ label, key }) in categorias" :key="key" class="botao"
                                :color="field.categoria == key ? `roxo` : `preto_noite`"
                                :outlined="field.categoria != key" @click.prevent="field.categoria = key">
                                <v-icon class="mr-1" color="branco" v-if="field.categoria == key">
                                    mdi-checkbox-marked-circle
                                </v-icon> {{ label }}
                            </v-btn>
                        </v-btn-toggle>

                        <div class="advogado" v-if="field.categoria == `advogado`">
                            <v-text-field label="Nome Completo" outlined v-model="field.advogado.nome"
                                :rules="rules.advogado.nome"></v-text-field>
                            <v-text-field label="OAB" outlined v-model="field.advogado.oab"
                                :rules="rules.advogado.oab"></v-text-field>
                            <v-select :items="estados" label="Estado" item-text="nome" outlined clearable
                                item-value="sigla" v-model="field.advogado.uf" :rules="rules.advogado.uf"></v-select>
                            <v-text-field label="Escritorio ou Instituição" outlined
                                v-model="field.advogado.instituicao" :rules="rules.advogado.instituicao"></v-text-field>
                        </div>

                        <div class="procurador" v-if="field.categoria == `procurador`">
                            <v-select :items="procuradores" label="Instituição" outlined clearable
                                item-text="instituicao" return-object v-model="field.procurador.instituicao"
                                :rules="rules.procurador.instituicao"></v-select>
                        </div>

                        <div class="defensoria" v-if="field.categoria == `defensoria`">
                            <v-select :items="defensorias" label="Instituição" outlined clearable
                                item-text="instituicao" return-object v-model="field.defensoria.instituicao"
                                :rules="rules.defensoria.instituicao"></v-select>
                        </div>

                    </section>
                    <footer>
                        <v-btn class="botao" color="amarelo_mostarda" outlined @click="dialog.value = false"> Cancelar
                        </v-btn>
                        <v-btn class="botao" color="amarelo_mostarda" depressed @click.prevent="submitParte(dialog)"
                            :disabled="!isValid"> Salvar </v-btn>
                    </footer>
                </div>
            </v-form>
        </template>
    </v-dialog>
</template>



<script>
import { mapActions } from 'vuex'
import estados from '~/services/estados';
export default {
    data() {
        const field = {
            papel: 'autor',
            nome: '',
            cpf_cnpj: '',
            categoria: 'advogado',
            advogado: {
                nome: "",
                oab: "",
                uf: "",
                instituicao: "",
            },
            procurador: {
                instituicao: "",
            },
            defensoria: {
                instituicao: "",
            }
        }

        const resetField = JSON.parse(JSON.stringify(field))

        const rules = {
            nome: [(v) => !!v || "Nome é obrigatório"],
            cpf_cnpj: [
                (v) => !!v || "CPF/CNPJ é obrigatório",
                (v) => (v && v.length === 14) || (v && v.length === 18) || ""
            ],
            advogado: {
                nome: [(v) => this.field.categoria === 'advogado' ? !!v || "Nome é obrigatório" : true],
                oab: [(v) => this.field.categoria === 'advogado' ? !!v || "OAB é obrigatório" : true],
                uf: [(v) => this.field.categoria === 'advogado' ? !!v || "UF é obrigatório" : true],
                instituicao: [(v) => this.field.categoria === 'advogado' ? !!v || "Instituição é obrigatório" : true],
            },
            procurador: {
                instituicao: [(v) => this.field.categoria === 'procurador' ? !!v || "Instituição é obrigatório" : true],
            },
            defensoria: {
                instituicao: [(v) => this.field.categoria === 'defensoria' ? !!v || "Instituição é obrigatório" : true],
            }
        }

        return {
            estados,
            procuradores: [],
            defensorias: [],
            field, resetField, rules, isValid: false,
            maskCPFCNPJ: '###.###.###-##',
        }
    },
    computed: {
        objParte() {
            let { papel, categoria, nome, cpf_cnpj } = { ...this.field }
            let parte = {
                papel, categoria, nome, cpf_cnpj
            }
            parte[categoria] = this.field[categoria]

            return parte
        },
        papeis() {
            return [
                { label: "Autor", key: "autor" },
                { label: "Réu", key: "reu" },
                { label: "Assistente", key: "assistente" },
                { label: "Terceiro interessado", key: "interessado" }
            ]
        },
        categorias() {
            return [
                { label: "Advogado", key: "advogado" },
                { label: "Procurador", key: "procurador" },
                { label: "Defensoria", key: "defensoria" },
            ]
        }
    },
    watch: {
        'field.categoria'() {
            this.$refs.form.resetValidation()
        }
    },
    methods: {
        ...mapActions('processo', ['whatParte']),
        iniciar(val) {
            if (val) {
                this.iniciarProcurador();
                this.iniciarDefesoria();
            } else {
                this.$refs.form.reset()
                this.$refs.form.resetValidation()
            }
        },
        async iniciarProcurador() {
            try {
                let { data: { data } } = await this.$axios.get(`/api/tb_procurador`);
                this.procuradores = data;
            } catch (error) {
                console.error("Erro ao carregar:", error);
            } finally {
                this.loading = false;
            }
        },
        async iniciarDefesoria() {
            try {
                let { data: { data } } = await this.$axios.get(`/api/tb_defensoria`);
                this.defensorias = data;
            } catch (error) {
                console.error("Erro ao carregar:", error);
            } finally {
                this.loading = false;
            }
        },
        cpf_cnpj_valid() {
            if (!this.field.cpf_cnpj) return
            let count = this.field.cpf_cnpj.length;
            if (count >= 15) {
                this.maskCPFCNPJ = '##.###.###/####-##'; // CNPJ
            } else {
                this.maskCPFCNPJ = '###.###.###-##'; // CPF
            }
        },
        submitParte(dialog) {
            dialog.value = false
            this.whatParte(this.objParte)
            this.field = JSON.parse(JSON.stringify(this.resetField))
        }
    }
}
</script>


<style scoped>
.v-btn.roxo {
    color: var(--v-branco-base);
}

.grid_four {
    display: grid;
    grid-template: ". . . ." / 1fr 1fr 1fr max-content;
}

.grid_tree {
    display: grid;
    grid-template: ". . ." / 1fr 1fr 1fr;
}

.partes {
    background: var(--v-branco-base);
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
}

.partes>* {
    padding: 0px 10px;
}

header {
    font-weight: 900;
    color: var(--v-roxo-base);
}

.partes>section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.partes>footer {
    display: flex;
    justify-content: space-between;
}

.row_grid {
    display: grid;
    grid-template: ". ." / 1fr 1fr;
    gap: 20px;
}

.advogado {
    display: grid;
    grid-template: 'nome nome' 'oab uf' 'escritorio escritorio' / 3fr 2fr;
    gap: 10px;
}

.advogado>*:nth-child(1) {
    grid-area: nome
}

.advogado>*:nth-child(2) {
    grid-area: oab
}

.advogado>*:nth-child(3) {
    grid-area: uf
}

.advogado>*:nth-child(4) {
    grid-area: escritorio
}
</style>