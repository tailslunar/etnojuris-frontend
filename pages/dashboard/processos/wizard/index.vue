<template>
    <Wizard>
        <template #footer>
            <v-btn class="botao lexend" color="amarelo_mostarda" outlined :disabled="voltar.disabled"
                v-text="voltar.text" />
            <v-btn class="botao lexend" color="amarelo_mostarda" depressed :disabled="avancar.disabled"
                v-text="avancar.text" @click.prevent="avancar.action" />
        </template>

        <WizardMain titulo="A qual quilombo o processo está vinculado?">
            <div>
                Digite o nome do quilombo procurar na lista. Caso o quilombo não esteja
                cadastrado, selecione a última opção para fazer o cadastrado.
            </div>
            <v-autocomplete v-model="id" :items="quilombos" :loading="loading" clearable item-text="nome"
                item-value="id" label="Selecione um Quilombo" outlined :search-input.sync="consulta"
                :menu-props="{ closeOnContentClick: true }" :filter="acharQuilombo">
                <template v-slot:no-data>
                    <div class="nodata-quilombo" @click.prevent="avancar.action">
                        <div>+</div>
                        <div>Cadastrar novo quilombo</div>
                        <div>{{ consulta }}</div>
                    </div>
                </template>
                <template v-slot:item="{ item }">
                    <div class="item-quilombo">
                        <div>{{ item.nome }}</div>
                        <div>{{ item.endereco }} {{ item.numero }}</div>
                    </div>
                </template>
            </v-autocomplete>
        </WizardMain>
    </Wizard>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    data: () => ({
        quilombos: [],
        id: null,
        loading: false,
        consulta: null,
    }),
    computed: {
        ...mapGetters("auth", ["usuarioID"]),
        ...mapGetters("processo", ["quilombo"]),
        objQuilombo() {
            if (!this.quilombos || this.quilombos.length < 1 || !this.quilombos[0]) return {};
            const objQuilombo = {};
            Object.keys(this.quilombos[0]).forEach(key => objQuilombo[key] = null);

            if (this.id > 0) {
                const quilomboSelecionado = this.quilombos.find(quilombo => quilombo.id === this.id);
                return { ...objQuilombo, ...quilomboSelecionado }
            }

            if (!!this.consulta) {
                return { ...objQuilombo, nome: this.consulta, usuario_id: this.usuarioID }
            }

            return objQuilombo
        },
        voltar() {
            return {
                text: "Voltar",
                disabled: true,
            }
        },
        avancar() {
            return {
                text: "Avançar",
                disabled: !(this.id > 0 && this.consulta && this.consulta.length > 0),
                action: () => this.submitQuilombo(this.id > 0 ? 'processo' : 'localizacao')
            }
        },
    },
    mounted() {
        this.iniciarQuilombo().finally(_ => {
            let { id, nome } = this.quilombo
            if (id !== undefined && nome !== undefined && id == null) {
                this.quilombos.push({ id, nome })
            }
            if(id !== undefined){
                this.id = id
            }
        })
    },
    methods: {
        ...mapActions('processo', ['whatQuilombo']),
        async iniciarQuilombo() {
            try {
                const { data: { data } } = await this.$axios.get(`/api/tb_quilombo`);
                this.quilombos = data;
            } catch (error) {
                console.error(error);
            }
        },
        acharQuilombo(item, queryText, itemText) {
            const searchTerms = queryText.toLowerCase().split(' ');
            return searchTerms.every(term => itemText.toLowerCase().includes(term));
        },
        submitQuilombo(endpoint) {
            this.whatQuilombo(this.objQuilombo)
            this.$router.push({ name: `dashboard-processos-wizard-${endpoint}` })
        },
    }
}
</script>

<style scoped>
.nodata-quilombo {
    display: grid;
    grid-template: "plus title" "plus sub" / 50px 1fr;
    background: var(--v-amarelo_mostarda-base);
    color: var(--v-preto_noite-base);
    cursor: pointer;
}

.nodata-quilombo>div:nth-child(1) {
    grid-area: plus;
    font-size: 40px;
    font-weight: 200;
    justify-self: center;
    align-self: center;
}

.nodata-quilombo>div:nth-child(2) {
    grid-area: title;
    font-size: 12px;
    line-height: 12px;
    font-weight: 800;
    justify-self: start;
    align-self: end;
}

.nodata-quilombo>div:nth-child(3) {
    grid-area: sub;
    font-size: 16px;
    font-weight: 400;
    font-family: var(--lexend);
    justify-self: start;
    align-self: start;
}

.item-quilombo {
    display: grid;
    grid-template: "title" "sub" / 1fr;
    color: var(--v-preto_noite-base);
}

.item-quilombo>div:nth-child(1) {
    grid-area: title;
    font-size: 16px;
}

.item-quilombo>div:nth-child(2) {
    grid-area: sub;
    font-size: 12px;
    color: var(--v-cinza_medio-base);
}
</style>
