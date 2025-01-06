<template>
    <div class="pesquisar">
        <v-text-field label="Pesquisar termo específico" outlined clear-icon="mdi-close-circle" clearable
            @click:clear="limparPesquisa" @keyup.enter="buscar" v-model="termo"></v-text-field>
        <v-btn x-large depressed class="botao" color="amarelo_mostarda" @click="buscar">
            <v-icon>mdi-magnify</v-icon>
            Buscar
        </v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            termo: ''
        };
    },
    mounted() {
        let { pesquisar } = this.$route.query;
        this.termo = pesquisar ?? "";
    },
    methods: {
        buscar() {
            this.$router.push({ query: { pesquisar: this.termo } });
        },
        limparPesquisa() {
            this.termo = '';
            this.$router.push({ });
        }
    }
};
</script>

<style scoped>
.pesquisar {
    padding: 30px 0px 0px;
    font-family: var(--font-featured);
    display: grid;
    grid-template: ". ." / 1fr minmax(20px, 120px);
    gap: 15px;
}
.pesquisar > .botao{
    height: 56px;
}
</style>