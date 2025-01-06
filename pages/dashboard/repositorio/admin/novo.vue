<template>
    <Canvas header_with_template="Novo Repositório" :short="true" v-show="!!isAdmin">
        <template slot="coluna">
            <div class="rightIsAdmin">
                <v-btn depressed class="botao" color="amarelo_mostarda"
                    :to="{ name: 'dashboard-repositorio' }">Voltar</v-btn>
            </div>
        </template>
        <v-form v-model="isValid" class="formRepositorio" ref="formRepositorio">
            <div class="tipo">
                <header>Tipo de Repositório</header>
                <v-input v-model="repositorio.tipo_publicacao" :rules="[v => !!v || 'Selecione um tipo de publicação']"
                    hide-details="auto">
                    <template #default>
                        <v-btn-toggle v-model="repositorio.tipo_publicacao">
                            <v-btn v-for="({ label, key }, iTipo) in tipo_publicacao" :key="iTipo" class="botao"
                                :color="repositorio.tipo_publicacao == key ? `roxo` : `preto_noite`"
                                :outlined="repositorio.tipo_publicacao != key" :value="key">
                                <v-icon class="mr-1" color="branco" v-if="repositorio.tipo_publicacao == key">
                                    mdi-checkbox-marked-circle
                                </v-icon>
                                {{ label }}
                            </v-btn>
                        </v-btn-toggle>
                    </template>
                </v-input>
            </div>
            <template v-if="repositorio.tipo_publicacao == `noticia`">
                <v-text-field v-model="repositorio.noticia.noticia_titulo" required label="Título:" outlined
                    counter="200" :rules="[v => !!v || 'Obrigatorio']"></v-text-field>

                <v-text-field v-model="repositorio.noticia.noticia_autor" label="Autor:" outlined
                    counter="200"></v-text-field>

                <v-textarea v-model="repositorio.noticia.noticia_conteudo" label="Conteúdo:" outlined></v-textarea>

                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="formattedDateNoticia" label="Data da Publicação:" readonly v-bind="attrs"
                            v-on="on" outlined></v-text-field>
                    </template>
                    <v-date-picker v-model="repositorio.noticia.noticia_dt_publicacao" no-title @input="updateDate" />
                </v-menu>

                <v-text-field v-model="repositorio.noticia.noticia_link" label="Arquivo Externo/URL/Link da Noticia:"
                    outlined></v-text-field>

                <v-text-field v-model="repositorio.noticia.noticia_tags" label="Tags:" outlined
                    counter="200"></v-text-field>

            </template>
            <template v-if="repositorio.tipo_publicacao == `jurisprudencia`">
                <v-text-field v-model="repositorio.jurisprudencia.jurisprudencia_titulo" required label="Título:"
                    outlined counter="200" :rules="[v => !!v || 'Obrigatorio']"></v-text-field>

                <div class="tipo">
                    <header>Competência</header>
                    <v-input v-model="repositorio.jurisprudencia.jurisprudencia_competencia"
                        :rules="[v => !!v || 'Selecione uma competência']" hide-details="auto">
                        <template #default>
                            <v-btn-toggle v-model="repositorio.jurisprudencia.jurisprudencia_competencia">
                                <v-btn v-for="(label, iTipo) in ['Federal', 'Estadual']" :key="iTipo" class="botao"
                                    :color="repositorio.jurisprudencia.jurisprudencia_competencia == label ? `roxo` : `preto_noite`"
                                    :outlined="repositorio.jurisprudencia.jurisprudencia_competencia != label"
                                    :value="label">
                                    <v-icon class="mr-1" color="branco"
                                        v-if="repositorio.jurisprudencia.jurisprudencia_competencia == label">
                                        mdi-checkbox-marked-circle
                                    </v-icon>
                                    {{ label }}
                                </v-btn>
                            </v-btn-toggle>
                        </template>
                    </v-input>
                </div>

                <v-text-field v-model="repositorio.jurisprudencia.jurisprudencia_tribunal" label="Tribunal:" outlined
                    counter="200"></v-text-field>
                <div class="jurisprudencia_ano">
                    <v-text-field v-model="repositorio.jurisprudencia.jurisprudencia_ano_decisao" label="Ano Decisão:"
                        outlined maxlength="4" counter="4" pattern="[0-9]{4}"
                        :rules="[v => !v || /^[0-9]{4}$/.test(v) || 'Ano deve conter 4 dígitos entre 0000 e 9999']"></v-text-field>

                    <v-text-field v-model="repositorio.jurisprudencia.jurisprudencia_ano_processo" label="Ano Processo:"
                        outlined maxlength="4" counter="4" pattern="[0-9]{4}"
                        :rules="[v => !v || /^[0-9]{4}$/.test(v) || 'Ano deve conter 4 dígitos entre 0000 e 9999']"></v-text-field>

                    <v-text-field v-model="repositorio.jurisprudencia.jurisprudencia_numero_processo"
                        label="Nº do Processo:" outlined v-mask="'#######-##.####.#.##.####'"></v-text-field>
                </div>
                <v-text-field v-model="repositorio.jurisprudencia.jurisprudencia_relator" label="Relator:" outlined
                    counter="200"></v-text-field>

                <v-textarea v-model="repositorio.jurisprudencia.jurisprudencia_ementa" label="Ementa:"
                    outlined></v-textarea>

                <v-text-field v-model="repositorio.jurisprudencia.jurisprudencia_inteiro_teor" label="Inteiro teor:"
                    outlined></v-text-field>

                <v-text-field v-model="repositorio.jurisprudencia.jurisprudencia_tags" label="Tags:" outlined
                    counter="200"></v-text-field>

            </template>
            <template v-if="repositorio.tipo_publicacao == `legislacao`">
                <v-text-field v-model="repositorio.legislacao.legislacao_titulo" required label="Nº da Lei/Título:"
                    outlined counter="200" :rules="[v => !!v || 'Obrigatorio']"></v-text-field>

                <div class="tipo">
                    <header>Nível</header>
                    <v-input v-model="repositorio.legislacao.legislacao_nivel"
                        :rules="[v => !!v || 'Selecione um nivel']" hide-details="auto">
                        <template #default>
                            <v-btn-toggle v-model="repositorio.legislacao.legislacao_nivel">
                                <v-btn v-for="(label, iTipo) in ['Federal', 'Estadual', 'Municipal']" :key="iTipo"
                                    class="botao"
                                    :color="repositorio.legislacao.legislacao_nivel == label ? `roxo` : `preto_noite`"
                                    :outlined="repositorio.legislacao.legislacao_nivel != label" :value="label">
                                    <v-icon class="mr-1" color="branco"
                                        v-if="repositorio.legislacao.legislacao_nivel == label">
                                        mdi-checkbox-marked-circle
                                    </v-icon>
                                    {{ label }}
                                </v-btn>
                            </v-btn-toggle>
                        </template>
                    </v-input>
                </div>

                <v-text-field v-model="repositorio.legislacao.legislacao_orgao" required label="Orgão Julgador:"
                    outlined counter="200"></v-text-field>

                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="formattedDateLegislacao" label="Data da Publicação:" readonly
                            v-bind="attrs" v-on="on" outlined></v-text-field>
                    </template>
                    <v-date-picker v-model="repositorio.legislacao.legislacao_dt_publicacao" no-title
                        @input="updateDate" />
                </v-menu>

                <v-textarea v-model="repositorio.legislacao.legislacao_decisao" label="Dispõe sobre:"
                    outlined></v-textarea>

                <v-text-field v-model="repositorio.legislacao.legislacao_link" required label="Arquivo/Link/URL:"
                    outlined></v-text-field>

                <v-text-field v-model="repositorio.legislacao.legislacao_tags" required label="Tags:" outlined
                    counter="200"></v-text-field>


            </template>
            <template v-if="repositorio.tipo_publicacao == `academico`">
                <v-text-field v-model="repositorio.academico.academico_titulo" required label="Título:" outlined
                    counter="200" :rules="[v => !!v || 'Obrigatorio']"></v-text-field>


                <div class="tipo">
                    <header>Tipo</header>
                    <v-input v-model="repositorio.academico.academico_tipo" :rules="[v => !!v || 'Selecione um nivel']"
                        hide-details="auto">
                        <template #default>
                            <v-btn-toggle v-model="repositorio.academico.academico_tipo">
                                <v-btn v-for="(label, iTipo) in ['Artigo', 'Dissertação', 'Tese', 'Livro']" :key="iTipo"
                                    class="botao"
                                    :color="repositorio.academico.academico_tipo == label ? `roxo` : `preto_noite`"
                                    :outlined="repositorio.academico.academico_tipo != label" :value="label">
                                    <v-icon class="mr-1" color="branco"
                                        v-if="repositorio.academico.academico_tipo == label">
                                        mdi-checkbox-marked-circle
                                    </v-icon>
                                    {{ label }}
                                </v-btn>
                            </v-btn-toggle>
                        </template>
                    </v-input>
                </div>

                <v-text-field v-model="repositorio.academico.academico_referencia" label="Referência:" outlined
                    counter="200"></v-text-field>

                <v-text-field v-model="repositorio.academico.academico_ano" label="Ano:" outlined maxlength="4"
                    counter="4" pattern="[0-9]{4}"
                    :rules="[v => !v || /^[0-9]{4}$/.test(v) || 'Ano deve conter 4 dígitos entre 0000 e 9999']"></v-text-field>

                <div class="autores">
                    <header>
                        Autor
                        <v-btn class="botao" outlined color="roxo" @click.prevent="addAutores()">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                            Adicionar Autor
                        </v-btn>
                    </header>
                    <div v-for="(item, i) in autores" :key="item.id">
                        <v-text-field v-model="autores[i].autor" label="Autor:" outlined counter="200"
                            :rules="[v => !!v || 'Obrigatório']" />
                        <v-text-field v-model="autores[i].vinculo" label="Vínculo institucional:" outlined
                            counter="200" />
                        <v-text-field v-model="autores[i].lattes" label="Lattes:" outlined />
                        <v-btn icon outlined color="roxo" @click.prevent="removerAutores(i)"
                            :disabled="autores.length == 1">
                            <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                    </div>
                </div>

                <v-text-field v-model="repositorio.academico.academico_link" required label="Arquivo/Link/URL:"
                    outlined></v-text-field>

                <v-text-field v-model="repositorio.academico.academico_tags" required label="Tags:" outlined
                    counter="200"></v-text-field>

            </template>
            <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="submitRepositorio">Salvar</v-btn>
        </v-form>
    </Canvas>
</template>




<script>
import { mapGetters, mapActions } from "vuex"

export default {
    data: () => {
        return {
            repositorio: {
                tipo_publicacao: null,
                noticia: {},
                jurisprudencia: {},
                legislacao: {},
                academico: {},
            },
            menu: false,
            isValid: false,
            autores: []
        }
    },
    computed: {
        ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
        formattedDateNoticia() {
            return this.repositorio.noticia.noticia_dt_publicacao ? this.$moment(this.repositorio.noticia.noticia_dt_publicacao).format('DD/MM/YYYY') : ''
        },
        formattedDateLegislacao() {
            return this.repositorio.legislacao.legislacao_dt_publicacao ? this.$moment(this.repositorio.legislacao.legislacao_dt_publicacao).format('DD/MM/YYYY') : ''
        },
        tipo_publicacao() {
            return [
                { key: 'noticia', label: 'Noticía' },
                { key: 'jurisprudencia', label: 'Jurisprudência' },
                { key: 'legislacao', label: 'Legislação' },
                { key: 'academico', label: 'Acadêmico' },
            ]
        },
        objRepositorio() {
            const { tipo_publicacao } = this.repositorio
            const modificar = {}
            modificar.academico_autor = this.autores.length > 0
                ? JSON.stringify(this.autores.map(a => ({ autor: a.autor, vinculo: a.vinculo, lattes: a.lattes})))
                : null
            return {
                Bearer: this.token,
                usuario_id: this.usuarioID,
                tipo_publicacao,
                ...this.repositorio[tipo_publicacao],
                ...modificar
            }
        }
    },
    mounted() {
        const tipo = this.$route.query.tipo;
        if (tipo) {
            const tipoValido = this.tipo_publicacao.find(item => item.key === tipo);
            if (tipoValido) {
                this.repositorio.tipo_publicacao = tipo;
            }
        }
        this.addAutores()
    },
    methods: {
        ...mapActions("notificacao", ["sucesso", "falha"]),
        updateDate(val) {
            this.repositorio.data_publicacao = this.$moment(val).format('YYYY-MM-DD')
            this.menu = false
        },
        addAutores() {
            this.autores.push({ id: Date.now(), autor: null, vinculo: null, lattes: null });
        },
        removerAutores(i) {
            this.autores.splice(i, 1)
        },
        async submitRepositorio() {
            if (!this.isValid) {
                this.$refs.formRepositorio.validate()
                return
            };
            this.isValid = false
            try {
                const response = await this.$axios.post('/api/tb_repositorio', this.objRepositorio);
                let { message } = response.data
                this.sucesso({ titulo: message })
                switch (this.repositorio.tipo_publicacao) {
                    case "noticia":
                        this.$router.push({ name: 'dashboard-noticias' })
                        break;
                    case "jurisprudencia":
                        this.$router.push({ name: 'dashboard-jurisprudencia' })
                        break;
                    case "legislacao":
                        this.$router.push({ name: 'dashboard-legislacao' })
                        break;
                    case "academico":
                        this.$router.push({ name: 'dashboard-academico' })
                        break;
                }
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


<style scoped>
.formRepositorio {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.formRepositorio>*:last-child {
    align-self: flex-start;
}

.tipo {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0px 0px;
}

.tipo>header {
    font-weight: 900;
    color: var(--v-roxo-base);
}

.autores {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    border: 1px solid var(--v-roxo-base);
    box-shadow: 5px 5px 5px #88888880;
    border-radius: 8px;
    margin-bottom: 20px;
}

.autores>header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    color: var(--v-roxo-base);
    font-weight: 900;
}

.autores>div {
    display: grid;
    grid-template: 'autor vinculo lattes bt' / 1fr 1fr 1fr max-content;
    gap: 10px;
    align-items: baseline;
}

.autores>div>*:nth-child(1) {
    grid-area: autor
}

.autores>div>*:nth-child(2) {
    grid-area: vinculo
}

.autores>div>*:nth-child(3) {
    grid-area: lattes
}

.autores>div>*:nth-child(4) {
    grid-area: bt
}

.jurisprudencia_ano {
    display: grid;
    grid-template: '. . .' / 1fr 1fr 1fr;
    gap: 25px;
}
</style>

<style>
.tipo .botao.v-item--active .v-btn__content {
    color: var(--v-branco-base);
}
</style>