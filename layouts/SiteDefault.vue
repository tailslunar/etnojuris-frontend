<template>
    <Init>
        <div id="gridHome" :class="{ isMobile: isMobile }">
            <div class="header">
                <LayoutNavbar />
            </div>
            <div class="aside">
                <LayoutAside />
            </div>
            <div class="main">
                <Nuxt />
            </div>
            <div class="apoio">
                <img :src="require('@/assets/home/logos/ufam.png')" />
                <img :src="require('@/assets/home/logos/fapeam.png')" />
                <img :src="require('@/assets/home/logos/cnpq.svg')" />
            </div>
            <div class="footer">
                <LayoutFooter />
            </div>
        </div>
    </Init>
</template>

<script>

export default {
    computed: {
        isMobile() {
            let bp = this.$vuetify.breakpoint.name;
            if (bp == "xs" || bp == "sm") {
                return true;
            }
            return false;
        },
    },
};
</script>

<style scoped>
#gridHome {
    background: var(--v-fundo-base);
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template:
        " header  header " min-content
        " aside   main " 1fr
        " apoio   main " min-content
        / 1fr 1fr;
}

#gridHome>.header {
    grid-area: header;
}

#gridHome>.aside {
    grid-area: aside;
}

#gridHome>.main {
    grid-area: main;
}

#gridHome>.footer {
    grid-area: footer;
    display: none;
}

#gridHome.isMobile {
    grid-template:
        " header " min-content
        " main " 1fr
        " apoio " max-content
        " footer" min-content
        / 1fr;
}

#gridHome.isMobile>.footer {
    display: block;
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