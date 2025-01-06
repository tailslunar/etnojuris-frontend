<template>
    <div>
        <h1 class="lexend">Cartografia de conflitos <br />
            etno-quilombola judicializados</h1>
        <p>Análise de dados de processos judiciais de quilombos no Brasil.</p>
        <v-btn large depressed class="botao lexend" color="amarelo_mostarda" :to="{ name: 'quantitativo' }">
            Quero conhecer
        </v-btn>
    </div>
</template>

<style scoped>
div {
    background-color: #f9f8e1;
    padding: 5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

div>* {
    text-align: center;
}

h1 {
    font-size: 3.5rem;
    color: #524391;
    line-height: 1.2;
    margin-bottom: 1rem;
}

p {
    font-size: 1.25rem;
    color: #151a1e;
    margin-bottom: 2rem;
}
</style>