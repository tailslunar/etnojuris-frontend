<template>
    <Wizard>
        <template #footer>
            <v-btn class="botao lexend" color="amarelo_mostarda" outlined :disabled="voltar.disabled"
                v-text="voltar.text" @click.prevent="voltar.action" />
            <v-btn class="botao lexend" color="amarelo_mostarda" depressed :disabled="avancar.disabled"
                v-text="avancar.text" @click.prevent="avancar.action" />
        </template>

        <WizardCanvas class="canvas">
            <header>
                <h2> Onde fica o <span>{{ quilombo.nome }}</span></h2>
                <small>Use um clique para marcar no mapa</small>
            </header>
            <section class="flutuando">
                <main>
                    <v-autocomplete :items="loading ? [] : cidades" v-model="cidade" :filter="acharCidade"
                        :label="loading ? `Carregando cidades` : `Pesquisar por uma referência geográfica`"
                        item-text="cidade" return-object outlined solo clearable :loading="loading" :disabled="loading"
                        :debounce="300">
                        <template v-slot:item="{ item }">
                            <span>{{ item.cidade }} / {{ item.uf }} </span>
                        </template>
                    </v-autocomplete>
                </main>
            </section>
            <l-map class="mapa" :zoom="mapConfig.zoom" :center="mapConfig.center" @click="addMarcador">
                <l-tile-layer :url="mapConfig.url"></l-tile-layer>
                <l-marker v-if="marker.length > 0" :lat-lng="marker"></l-marker>
            </l-map>
        </WizardCanvas>
    </Wizard>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            cidades: [],
            cidade: null,
            loading: false,
            mapConfig: {
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                zoom: 4,
                center: [-14.235004, -51.92528],
                options: {
                    scrollWheelZoom: false,
                },
            },
            marker: []
        }
    },
    computed: {
        ...mapGetters("processo", ["quilombo"]),
        voltar() {
            return {
                text: "Voltar",
                disabled: false,
                action: () => this.$router.push({ name: `dashboard-processos-wizard` })
            }
        },
        avancar() {
            return {
                text: "Avançar",
                disabled: this.marker.length == 0,
                action: () => this.submitQuilombo()
            }
        },
    },
    watch: {
        cidade(newCity) {
            if (!newCity) return;
            const { latitude, longitude } = newCity;
            this.centerMap([latitude, longitude]);
        },
    },
    mounted() {
        this.iniciarLocalizacao().finally(_ => {
            let { localidade_id, latitude, longitude } = this.quilombo
            if (localidade_id !== undefined) {                
                this.$nextTick(() => {
                    //this.marker = [latitude, longitude]
                    //this.mapConfig.center = [latitude, longitude]
                });
                this.cidade = this.cidades.find(c => c.id == localidade_id)
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
        centerMap(latlng) {
            this.mapConfig.zoom = 12;
            this.$nextTick(() => {
                this.mapConfig.center = latlng;
            });
        },
        addMarcador({ latlng: { lat, lng } }) {
            this.marker = [lat, lng];
        },
        submitQuilombo() {
            const quilombo = { ...this.quilombo }
            quilombo.latitude = this.marker[0]
            quilombo.longitude = this.marker[1]
            this.whatQuilombo(quilombo)
            this.$router.push({ name: 'dashboard-processos-wizard-endereco' })
        }
    },
}
</script>


<style scoped>
.canvas {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
}

header {
    display: flex;
    flex-direction: column;
    padding: 0px 40px;
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
    height: 100%;
    cursor: pointer;
}

.flutuando {
    position: absolute;
}

.flutuando>main {
    width: 400px;
    position: relative;
    margin: 80px 0px 0px 70px;
    z-index: 999;
}
</style>