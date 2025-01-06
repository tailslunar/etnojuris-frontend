<template>
    <footer :class="breakpoint">
        <section>
            <img src="@/assets/dashboard/etnojuris.svg" alt="" />
            <div>Direitos reservados © 2021 - {{ isYear }}</div>
        </section>
        <section>
            <h3>Sobre</h3>
            <router-link :to="{ name: 'dashboard' }">Quem somos</router-link>
            <router-link :to="{ name: 'dashboard' }">Perguntas frequentes</router-link>
            <router-link :to="{ name: 'dashboard' }">Termos e condições</router-link>
            <router-link :to="{ name: 'dashboard' }">Políticas de privacidade</router-link>
        </section>
        <section>
            <h3>Repositório</h3>
            <router-link :to="{ name: 'dashboard-noticias' }">Notícias</router-link>
            <router-link :to="{ name: 'dashboard-legislacao' }">Legislação</router-link>
            <router-link :to="{ name: 'dashboard-jurisprudencia' }">Jurisprudência</router-link>
            <router-link :to="{ name: 'dashboard-academico' }">Acadêmivo</router-link>
            <router-link :to="{ name: 'dashboard-glossario' }">Glossário</router-link>
        </section>
        <section>
            <a href="https://www.linkedin.com/company/etnojuris/" target="_blank">
                <v-icon>mdi-linkedin</v-icon>
            </a>
        </section>
        <section class="apoio">
            <img :src="require('@/assets/home/logos/ufam.png')" />
            <img :src="require('@/assets/home/logos/fapeam.png')" />
            <img :src="require('@/assets/home/logos/cnpq.svg')" />
            <img :src="require('@/assets/home/logos/jusbrasil.png')" />
        </section>
    </footer>
</template>

<script>
export default {
    computed: {
        breakpoint() {
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
    display: grid;
    padding: 20px 30px;
    grid-template: 
        "logo link1 link2 network" 
        "logo link1 link2 apoio" 
        / max-content max-content max-content auto;
    gap: 20px 60px;
}


footer.xs {
    padding: 20px 15px;
    grid-template: "logo" "network" "link1" "link2" "apoio" / 1fr;
}

footer.sm {
    padding: 20px 15px;
    grid-template: "logo network" "link1 link2" "apoio apoio" / 1fr 1fr;
}

/* Estilos para os elementos */
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
}

section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
}

footer:is(.xs, .sm) section.row {
    padding-left: 10px;
    align-self: end;
}

/* Links com hover e foco otimizados */
a,
i {
    color: var(--v-branco-base) !important;
    text-decoration: none;
}

a:hover,
a:focus,
i:hover,
i:focus {
    color: var(--v-amarelo_mostarda-base) !important;
}

.apoio{
    grid-area: apoio;
    display: flex;
    flex-direction: row; 
    flex-wrap: wrap;
    gap: 45px; 
    align-items: center;
    justify-content: start;
}

.apoio>img{
    height: 60px; /* Mantém a proporção das imagens */
    background-color: white;
    padding: 10px;
    border-radius: 8px;
}
</style>
