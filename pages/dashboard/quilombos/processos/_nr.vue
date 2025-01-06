<template>
    <Canvas>
        <section class="processos">
            <Processo v-for="(processo, index) in processos" :key="index" :processo="processo"/>
        </section>
    </Canvas>
</template>

<script>
export default {
    data() {
        return {
            ids:[],
            processos: [],
        }
    },
    mounted() {
        const ids = this.$route.params.nr
        this.ids = String(ids).split('|').map(Number)
        this.ids.forEach( id => this.iniciarProcesso(id))
    },
    methods: {
        async iniciarProcesso(id) {
            try {
                const { data } = await this.$axios.get(`/api/dados_processo/${id}`);
                this.processos.push(data);
            } catch (error) {
                console.error(error)
            }
        },
    }

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

header>div:nth-child(2) {
    display: flex;
    gap: 25px;
}

.processos {
    padding: 0px 140px;
    display: flex;
    flex-direction: column;
    gap: 25px;
}
</style>