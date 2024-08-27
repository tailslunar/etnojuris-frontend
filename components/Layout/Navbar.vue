<template>
    <main :class="{ isMobile: isMobile }">
        <router-link :to="{ name: 'login' }">
            <img src="@/assets/home/logo-etnojuris.png" alt="" />
        </router-link>
        <div>
            <v-btn text x-large class="botao lexend" :to="{ name: 'login' }">
                <v-icon dark left>mdi-login</v-icon>
                Fazer login
            </v-btn>
            <v-btn depressed x-large class="botao lexend" color="amarelo_mostarda" :to="{ name: 'register' }">Criar
                conta</v-btn>
        </div>
    </main>
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

<style>
.botao {
  text-transform: none;
  letter-spacing: 0;
  text-indent: 0;
  font-weight: 600;
}

.botao.v-btn--active:before {
  opacity: 0;
}

.botao.v-btn--active:hover:before {
  opacity: 0.08;
}
</style>

<style scoped>
main {
    padding: 45px 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

div {
    margin-right: 20px;
    display: flex;
    gap: 20px;
}

main.isMobile {
    padding: 5%;
}

main.isMobile img {
    max-width: 70%;
}

main.isMobile div {
    display: none;
}
</style>