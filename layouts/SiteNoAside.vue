<template>
    <Init>
        <div id="gridHome">
            <div class="header">
                <LayoutNavbar />
            </div>
            <div class="main">
                <Nuxt />
            </div>

            <div class="apoio">
                <img :src="require('@/assets/home/logos/ufam.png')" />
                <img :src="require('@/assets/home/logos/fapeam.png')" />
                <img :src="require('@/assets/home/logos/cnpq.svg')" />
            </div>
        </div>
    </Init>
</template>

<style scoped>
#gridHome {
    background: var(--v-fundo-base);
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template:
        " header" min-content
        " main" 1fr
        " apoio " max-content
        / 1fr;
}

#gridHome>.header {
    grid-area: header;
}

#gridHome>.main {
    grid-area: main;
}

#gridHome>.main>* {
    margin: auto;
}

.apoio{
    grid-area: apoio;
    display: grid;
    grid-template-columns: max-content max-content max-content; 
    gap: 45px; 
    padding:15px;
    align-items: center;
    justify-content: center;
}

.apoio>img{
    height: 60px; /* Mantém a proporção das imagens */
}
</style>