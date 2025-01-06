<template>
    <div class="partes">
        <h3>Partes</h3>
        <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="novoParticipante()">Nova Parte</v-btn>

        <div class="participante" v-if="showAddEditParte">
            <div class="papel">
                <header>Tipo de Parte</header>
                <v-btn-toggle>
                    <v-btn v-for="({ label, key }) in papeis" :key="key" class="botao"
                        :color="field.papel == key ? `roxo` : `preto_noite`" :outlined="field.papel != key"
                        @click.prevent="field.papel = key">
                        <v-icon class="mr-1" color="branco" v-if="field.papel == key">
                            mdi-checkbox-marked-circle
                        </v-icon> {{ label }}
                    </v-btn>
                </v-btn-toggle>
                <v-text-field label="Nome" outlined v-model="field.nome"></v-text-field>
                <v-text-field label="CFP/CNPJ" outlined v-model="field.cpf_cnpj" v-mask="maskCPFCNPJ"
                    @input="cpf_cnpj_valid"></v-text-field>

            </div>
            <div class="representante" :class="field.categoria">
                <header>Representante legal</header>
                <v-btn-toggle class="grid_four">
                    <v-btn v-for="({ label, key }) in categorias" :key="key" class="botao"
                        :color="field.categoria == key ? `roxo` : `preto_noite`" :outlined="field.categoria != key"
                        @click.prevent="field.categoria = key">
                        <v-icon class="mr-1" color="branco" v-if="field.categoria == key">
                            mdi-checkbox-marked-circle
                        </v-icon> {{ label }}
                    </v-btn>
                </v-btn-toggle>

                <template v-if="field.categoria == `advogado`">
                    <v-text-field label="Nome Completo" outlined v-model="field.advogado.nome"></v-text-field>
                    <v-text-field label="OAB" outlined v-model="field.advogado.oab"></v-text-field>
                    <v-select :items="estados" label="Estado" item-text="nome" outlined clearable item-value="sigla"
                        v-model="field.advogado.uf"></v-select>
                    <v-text-field label="Escritorio ou Instituição" outlined
                        v-model="field.advogado.instituicao"></v-text-field>
                </template>

                <template v-if="field.categoria == `procurador`">
                    <v-select :items="procuradores" label="Instituição" outlined clearable item-text="instituicao"
                        item-value="id" v-model="field.procurador"></v-select>
                </template>

                <template v-if="field.categoria == `defensoria`">
                    <v-select :items="defensorias" label="Instituição" outlined clearable item-text="instituicao"
                        item-value="id" v-model="field.defensoria"></v-select>
                </template>

            </div>
            <v-btn class="botao" text @click.prevent="showAddEditParte = false"> Cancelar </v-btn>
            <v-btn class="botao" color="amarelo_mostarda" depressed @click.prevent="submit" :loading="loading"> Salvar </v-btn>
        </div>

        <v-data-table :headers="headerTable" :items="participantes" item-key="id">
            <template v-slot:item._action="{ item }">
                <v-btn small text color="roxo"
                    @click.prevent="atualizarParticipanteParte(item.id)"><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn small text color="vermelho_telha"
                    @click.prevent="deleteParticipanteParte(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import estados from '~/services/estados';
export default {
    data: () => {
        return {
            loading: false,
            showAddEditParte: false,
            field: {
                nome:null,
                cpf_cnpj: null,
                papel: 'autor',
                categoria: 'advogado',
                advogado: {},
                procurador: null,
                defensoria: null
            },
            estados,
            procuradores: [],
            defensorias: [],
            maskCPFCNPJ: '###.###.###-##',
            dados_processo: {},
            headerTable: [
                { text: "#", value: "id" },
                { text: "Papel", value: "papel" },
                { text: "Parte", value: "parte" },
                { text: "Representante", value: "representante" },
                { text: "Escritorio/Instituição", value: "instituicao" },
                { text: "Ações", value: "_action", width: "150" }
            ],
            action: 'created',
            created: {
                parte_id: null,
                advogado_id: null,
                procurador_id: null,
                defensoria_id: null,
            }
        }
    },
    computed: {
        ...mapGetters("auth", ["token", "usuarioID"]),
        participantes() {
            let { objParte, objParticipante, objAdvogado, objProcurador, objDefensoria } = this.dados_processo;
            if (!objParte || !objParticipante || !objAdvogado || !objProcurador || !objDefensoria) return []

            let partesComRepresentantes = [];

            if (!Array.isArray(objParticipante)) objParticipante = [objParticipante]

            partesComRepresentantes = objParticipante.map(p => {
                const papel = () => {
                    if (p.papel == 'autor') return 'Autor'
                    if (p.papel == 'reu') return 'Réu'
                    if (p.papel == 'assistente') return 'Assistente'
                    if (p.papel == 'interessado') return 'Terceiro interessado'
                    return p.papel
                }

                const concatPapel = (json = false) => {
                    let parte = objParte.flat().find(parte => parte.id == p.parte_id);
                    if (!parte) return ''
                    if (json) return { ...parte }
                    return `${parte.nome} ${parte.cpf_cnpj ?? ''}`
                }
                const categoria = () => {
                    if (p.categoria == 'advogado') return 'Advogado'
                    if (p.categoria == 'procurador') return 'Procurador'
                    if (p.categoria == 'defensoria') return 'Defensoria'
                    return p.categoria
                }
                const concatCategoria = (json = false) => {
                    const concatAdvogado = () => {
                        let advogado = objAdvogado.flat().find(adv => adv.id == p.advogado_id)
                        if (!advogado) return ''
                        if (json) return { ...advogado }
                        return `${advogado.nome || ''} ${advogado.oab || ''} ${advogado.uf || ''} ${advogado.instituicao || ''}`
                    }
                    const concatProcurador = () => {
                        let procurador = objProcurador.flat().find(pro => pro.id == p.procurador_id);
                        if (!procurador) return ''
                        if (json) return { ...procurador }
                        return `${procurador.instituicao || ''}`
                    }
                    const concatDefensoria = () => {
                        let defensoria = objDefensoria.flat().find(dev => dev.id == p.defensoria_id);
                        if (!defensoria) return ''
                        if (json) return { ...defensoria }
                        return `${defensoria.instituicao || ''}`
                    }
                    if (p.categoria == 'advogado') return concatAdvogado()
                    if (p.categoria == 'procurador') return concatProcurador()
                    if (p.categoria == 'defensoria') return concatDefensoria()
                    return '#'
                }

                return {
                    id: p.id,
                    _papel: p.papel,
                    papel: papel(),
                    _categoria: p.categoria,
                    parte: concatPapel(),
                    representante: categoria(),
                    instituicao: concatCategoria(),
                    getParticipante: concatPapel(true),
                    getRepresentante: concatCategoria(true),
                }
            })
            return partesComRepresentantes;
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
        },
        objCreatedParte() {
            let { papel, categoria, nome, cpf_cnpj } = this.field
            let schema = {
                "Bearer": this.token,
                papel,
                categoria,
                nome,
                cpf_cnpj,
            }
            return {
                ...schema
            }
        },
        objCreatedAdvogado() {
            let { advogado: { nome, oab, uf, instituicao } } = this.field
            let schema = {
                "Bearer": this.token,
                nome,
                oab,
                uf,
                instituicao,
            }
            return {
                ...schema
            }
        },
        objCreatedParticipante() {
            let { papel, categoria, procurador, defensoria } = this.field
            let processo_id = this.$route.params.id

            if (categoria == 'procurador') this.created.procurador_id = procurador
            if (categoria == 'defensoria') this.created.defensoria_id = defensoria
            return {
                papel,
                categoria,
                ...this.created,
                processo_id
            }
        },
        objDelete() {
            return {
                Bearer: this.token
            }
        }
    },
    mounted() {
        this.iniciarProcurador()
        this.iniciarDefesoria()
        this.iniciarProcesso()
    },
    methods: {
        ...mapActions("notificacao", ["confirmar", "sucesso", "falha"]),
        async iniciarProcurador() {
            try {
                let { data: { data } } = await this.$axios.get(`/api/tb_procurador`);
                this.procuradores = data;
            } catch (error) {
                console.error("Erro ao carregar:", error);
            }
        },
        async iniciarDefesoria() {
            try {
                let { data: { data } } = await this.$axios.get(`/api/tb_defensoria`);
                this.defensorias = data;
            } catch (error) {
                console.error("Erro ao carregar:", error);
            }
        },
        async iniciarProcesso() {
            try {
                let id = this.$route.params.id;
                const { data } = await this.$axios.get(`/api/dados_processo/${id}`);
                this.dados_processo = data;
            } catch (error) {
                console.error(error);
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
        resetarTudo() {
            this.showAddEditParte = false
            this.created.parte_id = null
            this.created.advogado_id = null
            this.created.procurador_id = null
            this.created.defensoria_id = null
            this.field = {
                nome:null,
                cpf_cnpj: null,
                papel: 'autor',
                categoria: 'advogado',
                advogado: {},
                procurador: null,
                defensoria: null
            }
            this.iniciarProcesso()
        },
        async submit() {
            this.loading = true
            switch (this.action) {
                case 'created':
                    await this.createdParte()
                    await this.createdAdvogado()
                    await this.createdParticipante()
                    break;
                case 'updated':
                    await this.deleteParte(this.field.id)
                    await this.deleteAdvogado(this.field.id)
                    await this.deleteParticipante(this.field.id)
                    await this.createdParte()
                    await this.createdAdvogado()
                    await this.createdParticipante()
                    this.resetarTudo();
                    break;
            }
            this.loading = false
        },
        async createdParte() {
            try {
                const { data: { data } } = await this.$axios.post('/api/tb_parte', this.objCreatedParte);
                this.created.parte_id = data.id
            } catch (error) {
                let { message } = error.response.data
                let { status, statusText } = error.response
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message })
            }
        },
        async createdAdvogado() {
            if (this.field.categoria != 'advogado') return
            try {
                const { data: { data } } = await this.$axios.post('/api/tb_advogado', this.objCreatedAdvogado);
                this.created.advogado_id = data.id
            } catch (error) {
                let { message } = error.response.data
                let { status, statusText } = error.response
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message })
            }
        },
        async createdParticipante() {
            try {
                await this.$axios.post('/api/tb_participante', this.objCreatedParticipante);
                this.resetarTudo()
            } catch (error) {
                let { message } = error.response.data
                let { status, statusText } = error.response
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message })
            }
        },
        async deleteParticipanteParte(id) {
            this.confirmar({
                titulo: 'Confirmar Exclusão',
                callback: async (confirmed) => {
                    if (confirmed) {
                        await this.deleteParte(id)
                        await this.deleteAdvogado(id)
                        await this.deleteParticipante(id)
                        this.resetarTudo();
                    }
                },
            });
        },
        async deleteParte(id) {
            let participante = this.participantes.find(p => p.id == id)
            if (!participante) return
            let parte_id = participante.getParticipante.id
            try {
                await this.$axios.delete(`/api/tb_parte/${parte_id}`, { data: this.objDelete });
            } catch (error) {
                let { message } = error.response.data;
                let { status, statusText } = error.response;
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message });
            }
        },
        async deleteAdvogado(id) {
            let participante = this.participantes.find(p => p.id == id)
            if (!participante || participante._categoria != 'advogado') return
            let advogado_id = participante.getRepresentante.id
            try {
                await this.$axios.delete(`/api/tb_advogado/${advogado_id}`, { data: this.objDelete });
            } catch (error) {
                let { message } = error.response.data;
                let { status, statusText } = error.response;
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message });
            }
        },
        async deleteParticipante(id) {
            try {
                await this.$axios.delete(`/api/tb_participante/${id}`, { data: this.objDelete });
            } catch (error) {
                let { message } = error.response.data;
                let { status, statusText } = error.response;
                this.falha({ titulo: `${status} ${statusText}`, mensagem: message });
            }
        },
        novoParticipante() {
            this.showAddEditParte = true
            this.field = {
                papel: 'autor',
                categoria: 'advogado',
                advogado: {},
                procurador: null,
                defensoria: null
            }
        },
        atualizarParticipanteParte(id) {
            let participante = this.participantes.find(p => p.id == id)
            if (!participante) return
            this.action = 'updated'

            let categoria = participante._categoria

            this.field.id = id
            this.field.papel = participante._papel
            this.field.nome = participante.getParticipante.nome
            this.field.cpf_cnpj = participante.getParticipante.cpf_cnpj

            this.field.categoria = participante._categoria

            switch (categoria) {
                case 'advogado':
                    this.field.advogado = participante.getRepresentante
                    break;
                default:
                    this.field[categoria] = participante.getRepresentante.id
            }

            this.showAddEditParte = true
        }
    }
}
</script>

<style scoped>
h3 {
    color: var(--v-roxo-base);
    padding: 5px;
}

header {
    font-weight: 900;
    color: var(--v-roxo-base);
}

.partes {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 30px;
}

.partes>* {
    grid-column: 1 / -1;
}
.partes>*:nth-child(1) {
    grid-column: 1 / 2;
}
.partes>*:nth-child(2) {
    grid-column: 2 / 3;
}

.v-btn.roxo {
    color: var(--v-branco-base);
}

.participante {
    background: white;
    padding: 20px;
    border: 1px solid #c0c0c0;
    border-radius: 10px;
    box-shadow: 3px 3px 1px #c0c0c0;
}

.participante .papel {
    display: grid;
    grid-template: 'h h' 'bt bt' 'nome doc' / 1fr 1fr;
    gap: 15px 40px;
}

.participante .papel>*:nth-child(1) {
    grid-area: h
}

.participante .papel>*:nth-child(2) {
    grid-area: bt;
    justify-self: start;
}

.participante .papel>*:nth-child(3) {
    grid-area: nome
}

.participante .papel>*:nth-child(4) {
    grid-area: doc
}

.participante .representante {
    display: grid;
    grid-template: 'h h' 'bt bt' 'escritorio escritorio' / 3fr 2fr;
    gap: 15px 40px;
}

.participante .representante.advogado {
    grid-template: 'h h' 'bt bt' 'nome nome' 'oab uf' 'escritorio escritorio' / 3fr 2fr;
}

.participante .representante>*:nth-child(1) {
    grid-area: h
}

.participante .representante>*:nth-child(2) {
    grid-area: bt;
    justify-self: start;
}

.participante .representante>*:nth-child(3) {
    grid-area: nome
}

.participante .representante>*:nth-child(4) {
    grid-area: oab
}

.participante .representante>*:nth-child(5) {
    grid-area: uf
}

.participante .representante>*:last-child {
    grid-area: escritorio
}
</style>