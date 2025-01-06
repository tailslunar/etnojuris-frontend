<template>
    <Canvas :full="true" class="grid-quilombo">
        <l-map :zoom="mapa.zoom" :center="mapa.centro" class="mapa" @ready="onMapReady" @moveend="updateBounds">
            <l-tile-layer :url="mapa.tile"></l-tile-layer>
            <l-marker-cluster>
                <l-marker v-for="(q, id) in visibleQuilombos" :key="id" :lat-lng="[q.lat, q.long]">
                    <l-popup class="item_popUp">
                        {{ q.nome }}
                        <v-btn text class="botao" color="roxo" :disabled="!(q.qtd_processos > 0)" :to="q.qtd_processos > 0
                            ? {
                                name: 'dashboard-quilombos-processos-nr',
                                params: { nr: processos_ids(q) },
                            }
                            : null">
                            <v-icon>mdi-gavel</v-icon>
                            {{ `${q.qtd_processos} processo${q.qtd_processos != 1 ? 's' : ''} ` }}
                        </v-btn>
                    </l-popup>
                </l-marker>
            </l-marker-cluster>
        </l-map>
        <div class="flutuante">
            <v-autocomplete v-model="quilombo" label="Selecione um Quilombo" solo :search-input.sync="consulta"
                :items="filteredQuilombos" item-text="nome" :return-object="true" clearable :filter="() => true"></v-autocomplete>
            <v-btn depressed class="botao" color="branco" :to="{ name: 'dashboard-quilombos-listar' }">
                <v-icon>mdi-menu</v-icon> Lista
            </v-btn>
        </div>
    </Canvas>
</template>

<script>
export default {
    data() {
        return {
            mapa: {
                centro: [-15.7833, -47.9333],
                zoom: 12,
                tile: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            quilombos: [], // Todos os quilombos carregados da API
            quilombo: null, // Quilombo selecionado
            bounds: null, // Limites visíveis do mapa
            consulta: null, // Texto da pesquisa no autocomplete
            mapReady: false, // Flag para garantir que o mapa foi carregado
        };
    },
    computed: {
        // Computa os quilombos que estão dentro dos limites visíveis do mapa
        visibleQuilombos() {
            if (!this.bounds) return this.quilombos; // Se os bounds não estiverem definidos, mostra todos os filtrados
            return this.quilombos.filter(q => this.isInBounds(q.lat, q.long));
        },
        // Filtra os quilombos com base na busca por nome
        filteredQuilombos() {
            if (!this.consulta || this.consulta.length < 3) return [];

            // Normaliza e divide a consulta em termos
            const searchTerms = this.normalizeString(this.consulta).split(/\s+/).filter(term => term); // Divide pelos espaços

            return this.quilombos.filter(q => {
                const normalizedNome = this.normalizeString(q.nome);

                // Verifica se todos os termos de busca estão presentes no nome
                return searchTerms.every(term => normalizedNome.includes(term));
            });
        },
    },
    watch: {
        quilombo(q) {
            if (q == null) return
            let { lat, long } = q
            if (lat == undefined || long == undefined) return
            this.mapa.centro = [lat, long]
            this.mapa.zoom = 18
        }
    },
    mounted() {
        this.iniciarQuilombo();
    },
    methods: {
        async iniciarQuilombo() {
            try {
                const { data } = await this.$axios.get(`/api/quilombos/mapa`);
                this.quilombos = data;
            } catch (error) {
                console.error(error);
            }
        },
        normalizeString(str) {
            // Remove acentos e converte para minúsculas
            return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
        },
        processos_ids(quilombo) {
            let { id_processos } = quilombo;
            if (id_processos.length === 0) return '';
            return id_processos.map(p => p.id).join('|');
        },
        onMapReady(map) {
            this.mapReady = true;
            this.updateBounds({ target: map });
        },
        updateBounds(event) {
            if (this.mapReady && event.target) {
                this.bounds = event.target.getBounds();
            }
        },
        isInBounds(lat, lng) {
            if (!this.bounds) return false;
            const bounds = this.bounds;
            return (
                lat >= bounds.getSouthWest().lat &&
                lat <= bounds.getNorthEast().lat &&
                lng >= bounds.getSouthWest().lng &&
                lng <= bounds.getNorthEast().lng
            );
        },
    },
};
</script>


<style scoped>
.grid-quilombo {
    height: 80vh;
    width: 100%;
    position: relative;
    /* Isso permite que elementos filhos com position: absolute sejam relativos ao contêiner */
}

.mapa {
    z-index: 0;
    /* Assegure-se que o mapa tenha um z-index menor */
}

.flutuante {
    position: absolute;
    z-index: 9999;
    /* Um valor bem alto para garantir que esteja acima de tudo */
    width: 100%;
    display: grid;
    grid-template: "pesquisa . bt" / minmax(min-content, 350px) auto max-content;
    gap: 10px;
    padding: 20px 20px 20px 60px;
    pointer-events: none;
}

.flutuante>* {
    pointer-events: all;
}

.flutuante>*:nth-child(1) {
    grid-area: pesquisa;
}

.flutuante>*:nth-child(2) {
    grid-area: bt;
    height: 48px;
}


.item_popUp {
    font-size: 12px;
    color: var(--v-preto_noite-base);
    font-family: var(--font-featured);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    cursor: pointer;
}


.botao,
i.v-icon {
    font-size: 14px;
}
</style>