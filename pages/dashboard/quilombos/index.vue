<template>
    <Canvas :pesquisa="true" :loading="loading">
        <header>
            <div>{{ quilombos.length }} Quilombos</div>
            <div>
                <v-btn depressed class="botao" color="bege_sombrio"
                    :to="{ name: 'dashboard-quilombos-listar' }"><v-icon>mdi-menu</v-icon> Lista </v-btn>
            </div>
        </header>

        <section class="grid_mapa">
            <div class="lista">
                <section>
                    <div class="item" v-for="{id, quilombo,lat_lng, processos } in quilombos" :key="id" @click="openAndCenter(lat_lng)">
                        {{quilombo}}
                        <v-btn text class="botao" color="roxo"><v-icon>mdi-gavel</v-icon> {{processos}} Processos</v-btn>
                    </div>
                </section>
            </div>
            <l-map :zoom="mapa.zoom" :center="mapa.center">
                <l-tile-layer :url="mapa.url"></l-tile-layer>
                <l-marker v-for="{id, lat_lng } in quilombos" :key="id" :lat-lng="lat_lng" v-if="lat_lng[0] != 0 && lat_lng[1] != 0"></l-marker>
            </l-map>
        </section>
    </Canvas>
</template>


<script>
export default {
    data() {
        return {
            loading: false,
            mapa: {
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                zoom: 4,
                center: [-14.235004, -51.92528],
                options: {
                    scrollWheelZoom: false,
                },
            },
            quilombosData: [],
        };
    },
    computed: {
        quilombos() {
            let quilombo = this.quilombosData.map( q => ({
                id:q.id,
                quilombo: q.nome,
                lat_lng: [q.latitude, q.longitude],
                processos: 0,
            }))
            quilombo.sort((a, b) => b.id - a.id)
            return quilombo
        },
        quilombosMapa() {
            let quilombo = this.quilombosData.filter(q => q.latitude !== 0 && q.longitude !== 0).map( q => ({
                id:q.id,
                lat_lng: [q.latitude, q.longitude],
            }))
            quilombo.sort((a, b) => b.id - a.id)
            return quilombo
        }
    },
    mounted() {
        this.iniciarQuilombo();
    },
    methods: {
        async iniciarQuilombo() {
            try {
                const {
                    data: { data },
                } = await this.$axios.get(`/api/tb_quilombo`);
                this.quilombosData = data;
            } catch (error) {
                console.error(error);
            }
        },
        openAndCenter(marker) {
            this.mapa.center = marker;
            this.mapa.zoom = 18;
        },
    },
};
</script>



<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header>div:nth-child(1) {
    font-size: 16px;
    color: var(--v-roxo-base);
    font-family: var(--font-featured);
}

.grid_mapa {
    display: grid;
    grid-template: ". ." 80vh / 400px 1fr;
    background: white;
    width: calc(100% + 50px);
    margin-left: -25px;
    margin-bottom: -30px;
}

.lista {
    display: grid;
    grid-template: "." min-content "." 1fr / 1fr;
}

.lista header,
.item {
    padding: 15px 25px;
    border-bottom: 1px solid var(--v-amarelo_mostarda-base);
}

.lista header {
    font-size: 16px;
    font-weight: 900;
    color: var(--v-roxo-base);
    font-family: var(--font-featured);
}

.item {
    font-size: 14px;
    color: var(--v-preto_noite-base);
    font-family: var(--font-featured);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;

    cursor: pointer;
}

.item:hover {
    background: var(--v-bege_escuro-base);
}

.lista {
    overflow-x: auto;
}

.infoPopUp {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
}

.infoPopUp h3 {
    font-size: 14px;
    color: var(--v-preto_noite-base);
    font-family: var(--font-featured);
}
</style>