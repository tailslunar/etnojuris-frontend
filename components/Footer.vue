<template>
    <footer :class="isHeght">
        <section>
            <img src="@/assets/dashboard/etnojuris.png" alt="" />
            <div>Direitos reservados © 2021 - {{ isYear }}</div>
        </section>
        <section>
            <h3>Sobre</h3>
            <router-link :to="{ name: 'dashboard-quilombos' }">Quilombo</router-link>
            <router-link :to="{ name: 'dashboard-processos' }">Processos</router-link>
            <router-link :to="{ name: 'dashboard-repositorio' }">Pesquisas</router-link>
        </section>
        <section>
            <h3>Ajude</h3>
            <router-link :to="{ name: 'dashboard-repositorio' }">Repositório</router-link>
            <router-link :to="{ name: 'dashboard-glossario' }">Glossário</router-link>
            <router-link :to="{ name: 'dashboard' }">Perguntas frequentes</router-link>
            <router-link :to="{ name: 'dashboard' }">Termos e condições</router-link>
            <router-link :to="{ name: 'dashboard' }">Políticas de privacidade</router-link>
        </section>
        <section class="row">
            <a href="https://www.linkedin.com/company/etnojuris/" target="_blank">
                <v-icon> mdi-linkedin </v-icon>
            </a>
        </section>
    </footer>
</template>

<script>
export default {
    computed: {
        isHeght() {
            return this.$vuetify.breakpoint.name;
        },
        isYear() {
            return new Date().getFullYear();
        }
    },
};
</script>

<style scoped>
footer {
    background: var(--v-preto_noite-base);
    color: var(--v-branco-base);
    font-family: var(--font-featured);
    font-size: 12px;
    padding: 20px 30px;
    display: grid;
    grid-template: "logo link1 link2 network" / 300px max-content max-content auto;
    gap: 96px;
}

footer:is(.sm) {
    gap: 25px 96px;
    grid-template: "logo logo logo" max-content "link1 link2 network" / max-content max-content auto;
}

footer:is(.xs) {
    gap: 25px 96px;
    grid-template: "logo logo" max-content "link1 link2" max-content "network network" max-content / max-content auto;
}

section:nth-child(1) {
    grid-area: logo;
}

section:nth-child(2) {
    grid-area: link1;
}

section:nth-child(3) {
    grid-area: link2;
}

section:nth-child(4) {
    grid-area: network;
    padding-top: 10px;
}

section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
}

section.row {
    flex-direction: row;
    gap: 16px;
}

a,
i {
    color: var(--v-branco-base) !important;
    text-decoration: none;
}

a:hover,
i:hover {
    color: var(--v-amarelo_mostarda-base) !important;
}
</style>