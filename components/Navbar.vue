<template>
    <header :class="isHeght">
        <div class="logo">
            <router-link :to="{ name: 'dashboard' }">
                <img src="@/assets/dashboard/etnojuris.png" alt="" />
            </router-link>
        </div>
        <div class="grupo-link">
            <router-link v-for="(link, indexUrl) in links" :key="indexUrl" class="link" :to="{ name: link.url }">
                {{ link.title }}
            </router-link>
        </div>
        <div class="grupo-btn">
            <v-btn large depressed class="btn-processo botao lexend" color="amarelo_mostarda"
                :to="{ name: 'dashboard-processos-wizard' }">
                <v-icon class="mr-2"> mdi-gavel </v-icon>
                <span class="btn-processo-none">Adicionar Processo</span>
            </v-btn>
            <div class="btn-avatar">
                <v-menu min-width="110px" bottom offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn icon x-large v-on="on">
                            <v-avatar color="azul_turquesa">
                                <h2>{{ getAvatar }}</h2>
                            </v-avatar>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-list-item-content>
                            <div>
                                <v-btn block text @click.prevent="sairSistema"> Sair </v-btn>
                            </div>
                        </v-list-item-content>
                    </v-card>
                </v-menu>
            </div>
        </div>
        <div class="grupo-hamburguer">
            <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn dark icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-menu</v-icon>
                    </v-btn>
                </template>
                <v-card class="pa-1">
                    <v-btn block text v-for="(link, indexUrl) in links" :key="indexUrl" :to="{ name: link.url }"
                        class="my-3">
                        {{ link.title }}
                    </v-btn>
                    <v-divider class="my-3"></v-divider>
                    <v-btn block text> Sair </v-btn>
                </v-card>
            </v-menu>
        </div>
    </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    data: () => ({
        links: [
            { title: "Quilombos", url: "dashboard-quilombos" },
            { title: "Processos", url: "dashboard-processos" },
            { title: "Glossário", url: "dashboard-glossario" },
            { title: "Repositório", url: "dashboard-repositorio" },
        ],
    }),
    computed: {
        ...mapGetters('auth', ['getAvatar']),
        isHeght() {
            return this.$vuetify.breakpoint.name;
        },
    },
    methods: {
        ...mapActions('auth', ['deslogarUsuario']),
        sairSistema() {
            this.deslogarUsuario();
            this.$router.push({
                name: "login",
            });
        },
    },
};
</script>

<style scoped>
header {
    background: var(--v-vermelho_telha-base);
    padding: 20px 30px;
    display: grid;
    grid-template: ". . ." / auto 1fr auto;
    gap: 70px;
}

header>div {
    display: flex;
    align-items: center;
    gap: 70px;
}

.logo img {
    width: 200px;
}

.grupo-btn {
    justify-content: flex-end;
    gap: 20px;
}

.link {
    font-family: var(--font-featured);
    color: var(--v-branco-base);
    text-decoration: none;
    padding: 5px;
    font-weight: 500;
}

.link:hover {
    border-top: 3px solid transparent;
    color: var(--v-amarelo_mostarda-base);
    border-bottom: 3px solid var(--v-amarelo_mostarda-base);
}

header:is(.md, .sm, .xs) {
    gap: 30px;
}

header:is(.md, .sm, .xs)>div {
    gap: 30px;
}

header:is(.lg, .md, .xl) .grupo-hamburguer {
    display: none;
}

header:is(.sm, .xs) .grupo-link {
    display: none;
}

header:is(.md, .xs) .btn-processo {
    min-width: 0px;
    padding: 0px 10px;
}

header:is(.md, .xs) .btn-processo .btn-processo-none {
    display: none;
}

header:is(.sm, .xs) .btn-avatar {
    display: none;
}
</style>