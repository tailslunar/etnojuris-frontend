<template>
    <div class="dashboard" :class="breakpoint">
        <DashboardItem>
            <DashboardGraficoMapaInterativo />
        </DashboardItem>
        <DashboardItem titulo="Processos" :dado="quantidadeProcessos" />
        <DashboardItem titulo="Quilombos" :dado="quantidadeQuilombos" />
        <DashboardItem titulo="Processos(Tempo/Médio)" :dado="tempoMedioPorProcesso?.valor || 0"
            :complemento="tempoMedioPorProcesso?.complemento || ``" />
        <DashboardItem titulo="Processos com Sentenças" :dado="processosComSentenca" />
        <DashboardItem>
            <DashboardGraficoMicroRegiao />
        </DashboardItem>
        <DashboardItem titulo="Pólo do quilombo">
            <DashboardGraficoQuilombo />
        </DashboardItem>
        <DashboardItem titulo="Taxa de sucesso dos quilombos no processo">
            <DashboardGraficoVitoriaDerrota />
        </DashboardItem>
        <DashboardItem titulo="Por Estados">
            <DashboardGraficoPorEstado />
        </DashboardItem>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    computed: {
        ...mapGetters("dashboard", ["dashboard"]),
        breakpoint() {
            return this.$vuetify.breakpoint.name;
        },
        quantidadeProcessos() {
            const estadosSelecionados = this.dashboard.estadosSelecionados;
            const estadosData = this.dashboard.estados;
            const estadosFiltrados = estadosData.filter((estado) =>
                estadosSelecionados.includes(estado.estado)
            );
            const totalProcesso = estadosFiltrados.reduce((acc, estado) => {
                return acc + (estado.total.processo || 0);
            }, 0);
            return totalProcesso;
        },
        quantidadeQuilombos() {
            const estadosSelecionados = this.dashboard.estadosSelecionados;
            const estadosData = this.dashboard.estados;

            const estadosFiltrados = estadosData.filter((estado) =>
                estadosSelecionados.includes(estado.estado)
            );

            const totalQuilombo = estadosFiltrados.reduce((acc, estado) => {
                return acc + (estado.total.quilombo || 0);
            }, 0);
            return totalQuilombo;
        },
        tempoMedioPorProcesso() {
            const estadosSelecionados = this.dashboard.estadosSelecionados;
            const estadosData = this.dashboard.estados;
            const estadosFiltrados = estadosData.filter((estado) =>
                estadosSelecionados.includes(estado.estado)
            );
            const { totalProcessos, totalTempo } = estadosFiltrados.reduce(
                (acc, estado) => {
                    const processos = estado.total.processo || 0;
                    const tempoTotal = estado.total.tempo_total || 0;

                    acc.totalProcessos += processos;
                    acc.totalTempo += tempoTotal;

                    return acc;
                },
                { totalProcessos: 0, totalTempo: 0 }
            );
            if (totalProcessos === 0) {
                return { valor: 0, complemento: "" };
            }
            const mediaTempoPorProcesso = totalTempo / totalProcessos;
            return { valor: Math.round(mediaTempoPorProcesso), complemento: "dias" };
        },
        processosComSentenca() {
            const estadosSelecionados = this.dashboard.estadosSelecionados;
            const estadosData = this.dashboard.estados;
            const estadosFiltrados = estadosData.filter((estado) =>
                estadosSelecionados.includes(estado.estado)
            );
            const totalSentenca = estadosFiltrados.reduce((acc, estado) => {
                const sentenca = estado.sentenca;
                const somaSentenca = Object.values(sentenca).reduce(
                    (sum, valor) => sum + (valor || 0),
                    0
                );
                return acc + somaSentenca;
            }, 0);
            return totalSentenca;
        },
    }
}
</script>


<style scoped>
.dashboard {
    display: grid;
    grid-template:
        "mapa hProcesso hquilombo hTempo hProcessoSentenca" max-content
        "mapa qProcesoQuilombo qProcesoQuilombo qPorEstado qPorEstado" max-content
        "mapa qPoloQuilombo qPoloQuilombo qPorEstado qPorEstado" max-content
        "mapa qSentenca qSentenca qPorEstado qPorEstado" 1fr
        / 1fr 0.5fr 0.5fr 0.5fr 0.5fr;
    gap: 15px;
    align-items: start;
}

.dashboard.xs,
.dashboard.sm{
    grid-template:
    "mapa"
    "hProcesso"
    "hquilombo"
    "hTempo"
    "hProcessoSentenca"
    "qProcesoQuilombo"
    "qPorEstado"
    "qPoloQuilombo"
    "qSentenca"
     / 1fr;
}

.dashboard>*:nth-child(1) {
    grid-area: mapa
}

.dashboard>*:nth-child(2) {
    grid-area: hProcesso
}

.dashboard>*:nth-child(3) {
    grid-area: hquilombo
}

.dashboard>*:nth-child(4) {
    grid-area: hTempo
}

.dashboard>*:nth-child(5) {
    grid-area: hProcessoSentenca
}

.dashboard>*:nth-child(6) {
    grid-area: qProcesoQuilombo
}

.dashboard>*:nth-child(7) {
    grid-area: qPoloQuilombo
}

.dashboard>*:nth-child(8) {
    grid-area: qSentenca
}

.dashboard>*:nth-child(9) {
    grid-area: qPorEstado
}
</style>