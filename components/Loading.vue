<template>
    <div v-if="loading" class="loading">
        <div class="spinner"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        };
    },
    mounted() {
        // Escuta os eventos de carregamento do Nuxt
        this.$nuxt.$on('loading:start', this.onLoadingStart);
        this.$nuxt.$on('loading:finish', this.onLoadingFinish);
    },
    beforeDestroy() {
        // Remove os listeners quando o componente é destruído
        this.$nuxt.$off('loading:start', this.onLoadingStart);
        this.$nuxt.$off('loading:finish', this.onLoadingFinish);
    },
    methods: {
        onLoadingStart() {
            this.loading = true;
        },
        onLoadingFinish() {
            this.loading = false;
        }
    }
};
</script>

<style scoped>
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

.spinner {
    border: 16px solid var(--v-bege_sombrio-base);
    border-top: 16px solid var(--v-amarelo_mostarda-base);
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>