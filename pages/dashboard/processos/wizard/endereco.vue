<template>
    <Wizard>
        <template #footer>
            <v-btn class="botao lexend" color="amarelo_mostarda" outlined :disabled="voltar.disabled"
                v-text="voltar.text" @click.prevent="voltar.action" />
            <v-btn class="botao lexend" color="amarelo_mostarda" depressed :disabled="avancar.disabled"
                v-text="avancar.text" @click.prevent="avancar.action" />
        </template>

        <WizardMain>
            <header>
                <h2> Onde fica o <span>{{ quilombo.nome }}</span></h2>
            </header>
            <l-map class="mapa" :zoom="mapConfig.zoom" :center="centerMap" :options="mapConfig.options">
                <l-tile-layer :url="mapConfig.url"></l-tile-layer>
                <l-marker :lat-lng="centerMap"></l-marker>
            </l-map>

            <v-form v-model="isValid">
                <v-text-field label="Nome do Quilombo:" v-model="field.nome" :rules="rules.nome" outlined
                    clearable></v-text-field>
                <v-text-field label="Associação:" v-model="field.associacao" outlined clearable></v-text-field>
                <v-text-field label="CNPJ:" v-model="field.cnpj" v-mask="'##.###.###/####.##'" outlined
                    clearable></v-text-field>
                <div class="cep">
                    <v-text-field label="CEP:" v-model="field.cep" :rules="rules.cep" v-mask="'#####-###'" outlined
                        clearable></v-text-field>
                    <v-btn x-large depressed class="botao" color="amarelo_mostarda" @click.prevent="buscarCEP"
                        :disabled="!(field.cep.length == 9)">
                        <v-icon>mdi-magnify</v-icon>
                        Buscar
                    </v-btn>
                </div>
                <div class="row_grid">
                    <v-text-field label="Endereco:" v-model="field.endereco" :rules="rules.endereco" outlined
                        clearable></v-text-field>
                    <v-text-field label="Número:" v-model="field.numero" outlined
                        clearable></v-text-field>
                </div>
                <div class="row_grid">
                    <v-select :items="estados" label="Estado" item-text="nome" v-model="field.estado"
                        :rules="rules.estado" outlined clearable item-value="sigla"></v-select>
                    <v-autocomplete :items="cidadesUf" label="Cidade" :filter="acharCidade" v-model="field.cidade"
                        :rules="rules.cidade" outlined clearable item-text="cidade" item-value="id"></v-autocomplete>
                </div>
                <v-divider class="linha"></v-divider>
                <h3>Informações complementares</h3>
                <div class="row_grid">
                    <v-text-field label="Latitude:" v-model="field.latitude" :rules="rules.latitude" outlined clearable
                        disabled></v-text-field>
                    <v-text-field label="Longitude:" v-model="field.longitude" :rules="rules.longitude" outlined
                        clearable disabled></v-text-field>
                </div>
            </v-form>


        </WizardMain>
    </Wizard>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import estados from '~/services/estados';
export default {
    data() {
        const field = {
            nome: "",
            associacao: "",
            cnpj: "",
            cep: "",
            endereco: "",
            numero: "",
            cidade: "",
            estado: "",
            latitude: null,
            longitude: null,
            usuario_id: 0
        }
        const rules = {
            nome: [(v) => !!v || "Nome do Quilombo é obrigatório"],
            cep: [(v) => !!v || "CEP é obrigatório"],
            endereco: [(v) => !!v || "Endereço é obrigatório"],
            cidade: [(v) => !!v || "Cidade é obrigatório"],
            estado: [(v) => !!v || "Estado é obrigatório"],
            latitude: [(v) => !!v || "Latitude é obrigatório"],
            longitude: [(v) => !!v || "Longitude é obrigatório"],
        }
        return {
            field, rules, isValid: false,
            estados,
            cidades: [],
            mapConfig: {
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                zoom: 13,
                options: {
                    dragging: false,             // Desativa o arrastar
                    scrollWheelZoom: false,      // Desativa o zoom pela roda do mouse
                    touchZoom: false,            // Desativa o zoom por toque
                    doubleClickZoom: false,      // Desativa o zoom por duplo clique
                    boxZoom: false,              // Desativa o zoom por seleção de caixa
                }
            },
        }
    },
    computed: {
        ...mapGetters("processo", ["quilombo"]),
        centerMap() {
            let { latitude, longitude } = this.quilombo
            return [latitude !== null && latitude !== undefined ? latitude : 0, longitude !== null && longitude !== undefined ? longitude : 0];
        },
        voltar() {
            return {
                text: "Voltar",
                disabled: false,
                action: () => this.$router.push({ name: `dashboard-processos-wizard-localizacao` })
            }
        },
        avancar() {
            return {
                text: "Avançar",
                disabled: !this.isValid,
                action: () => this.submitQuilombo()
            }
        },
        cidadesUf() {
            let { estado } = this.field
            if (estado == null) {
                return this.cidades
            }
            return this.cidades.filter(cidade => cidade.uf === estado);
        }
    },
    mounted() {
        this.field.nome = this.quilombo.nome || "";
        this.field.associacao = this.quilombo.associacao || "";
        this.field.cnpj = this.quilombo.cnpj || "";
        this.field.cep = this.quilombo.cep || "";
        this.field.endereco = this.quilombo.endereco || "";
        this.field.numero = this.quilombo.numero || "";
        this.field.latitude = this.quilombo.latitude || 0;
        this.field.longitude = this.quilombo.longitude || 0;

        this.iniciarLocalizacao().then(() => {
            if (this.quilombo.localidade_id > 0) {
                this.searchCidade(this.quilombo.localidade_id)
            }
        })
    },
    methods: {
        ...mapActions('processo', ['whatQuilombo']),
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
        searchCidade(localidade) {
            let cidade = this.cidades.find(c => c.id === localidade);
            if (cidade) {
                this.field.estado = cidade.uf
                this.field.cidade = cidade.id
            }
        },
        async buscarCEP() {
            let { cep } = this.field;
            try {
                const { data, status } = await this.$axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (status == 200) {
                    this.field.endereco = data.logradouro;
                    this.field.estado = data.uf;
                    this.field.bairro = data.bairro;
                    this.field.complemento = data.complemento;

                    let cidade = this.cidades.find(c => c.cidade === data.localidade);
                    if (cidade) {
                        this.field.cidade = cidade.id
                    }
                } else {
                    console.error("Erro ao buscar o CEP");
                }
            } catch (error) {
                console.error("Erro ao carregar as localidades:", error);
            }
        },
        submitQuilombo() {
            const quilombo = { ...this.quilombo }
            quilombo.nome = this.field.nome
            quilombo.associacao = this.field.associacao
            quilombo.cnpj = this.field.cnpj
            quilombo.cep = this.field.cep
            quilombo.endereco = this.field.endereco
            quilombo.numero = this.field.numero
            quilombo.localidade_id = this.field.cidade

            this.whatQuilombo(quilombo)
            this.$router.push({ name: `dashboard-processos-wizard-processo` })
        }
    }
}
</script>

<style scoped>
header {
    display: flex;
    flex-direction: column;
}

header h2 {
    color: var(--v-roxo-base);
}

header h2>span {
    text-decoration: underline;
}

header small {
    display: block;
    font-size: 10px;
    color: var(--v-cinza_medio-base);
}

.mapa {
    width: 100%;
    height: 300px;
}

.cep {
    display: grid;
    grid-template: ". ." / 2fr 1fr;
    gap: 20px;
}

.row_grid {
    display: grid;
    grid-template: ". ." / 1fr 1fr;
    gap: 20px;
}

.linha {
    margin: 10px 0px 20px;
}

h3 {
    font-weight: 200;
    color: var(--v-roxo-base);
    padding: 0px 0px 20px;
}
</style>