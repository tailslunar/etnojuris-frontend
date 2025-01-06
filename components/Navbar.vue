<template>
    <header :class="breakpoint">
        <div class="logo">
            <router-link :to="{ name: 'dashboard' }">
                <img src="@/assets/dashboard/etnojuris.svg" alt="" />
            </router-link>
        </div>
        <div class="grupo-link" :class="breakpoint">
            <router-link v-for="(link, indexUrl) in links" :key="indexUrl" class="link" :to="{ name: link.url }">
                {{ link.title }}
            </router-link>
        </div>
        <div class="grupo-btn" :class="breakpoint">
            <v-btn large depressed class="btn-processo botao lexend" color="amarelo_mostarda"
                :to="{ name: 'dashboard-processos-wizard' }">
                <v-icon> mdi-gavel </v-icon>
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
        <div class="grupo-hamburguer" :class="breakpoint">
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
            { title: "Notícias", url: "dashboard-noticias" },
            { title: "Legislação", url: "dashboard-legislacao" },
            { title: "Jurisprudência", url: "dashboard-jurisprudencia" },
            { title: "Acadêmico", url: "dashboard-academico" },
        ],
    }),
    computed: {
        ...mapGetters('auth', ['getAvatar']),
        breakpoint() {
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
    grid-template: ". . ." / max-content 1fr max-content;
    gap: 20px;
    align-items: center;
}

header.sm,
header.xs{
    padding: 20px 15px;
    padding-right: 20px;
}

.grupo-link {
    display: flex;
    align-items: center;
    gap: 15px;
}

.grupo-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
}


.logo img {
    width: 170px;
}


.link {
    font-family: var(--font-featured);
    color: var(--v-branco-base);
    text-decoration: none;
    padding: 5px;
    font-weight: 500;
    font-size: 0.9rem;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;

}

.link:hover {
    border-top: 3px solid transparent;
    color: var(--v-amarelo_mostarda-base);
    border-bottom: 3px solid var(--v-amarelo_mostarda-base);
}




.grupo-link.sm,
.grupo-link.xs{
    display: none;
}

.grupo-btn.sm .btn-avatar,
.grupo-btn.xs .btn-avatar {
    display: none;
}

.grupo-btn.xs .btn-processo,
.grupo-btn.md .btn-processo {
    min-width: 0px;
    padding: 0px 10px;
}

.grupo-btn.xs .btn-processo-none,
.grupo-btn.md .btn-processo-none {
    display: none;
}

.grupo-hamburguer.md,
.grupo-hamburguer.lg,
.grupo-hamburguer.xl {
    display: none;
}
</style>