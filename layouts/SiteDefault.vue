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
        " footer" min-content
        / 1fr;
}

#gridHome.isMobile>.footer {
    display: block;
}
</style>