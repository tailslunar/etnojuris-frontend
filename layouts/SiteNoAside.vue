<template>
    <Init>
        <div id="gridHome">
            <div class="header">
                <LayoutNavbar />
            </div>
            <div class="main">
                <Nuxt />
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
</style>