<template>
    <Canvas>
        <header>
            <div>Últimos processos cadastrados</div>
        </header>
        <section class="processos">
            <Processo :processo="processo"/>
        </section>
    </Canvas>
</template>

<script>
export default {
    data() {
        return {
            processo: {},
        }
    },
    mounted() {
        this.iniciarProcesso()
    },
    methods: {
        async iniciarProcesso() {
            try {
                let { numero } = this.$route.params
                const { data: { data } } = await this.$axios.get(`/api/tb_processo/${numero}`);
                this.processo = data;
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