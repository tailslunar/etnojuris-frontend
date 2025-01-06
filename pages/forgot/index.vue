<template>
    <LayoutMiddle>
        <h3>Esqueci minha senha</h3>
        <h4>Informe seu e-mail e solicite para alterar sua senha</h4>
        <v-text-field label="Endereço de email: " outlined hint="Digite um endereço de email válido"
            v-model="email"></v-text-field>
        <v-btn depressed block x-large class="botao lexend" color="amarelo_mostarda"
            @click.prevent="submit">
            Recuperar minha senha
        </v-btn>
    </LayoutMiddle>
</template>

<script>
export default {
    layout: 'SiteNoAside',
    data() {
        return {
            email: null
        }
    },
    methods: {
        async submit() {
            let scheme = {
                email: this.email.toLocaleLowerCase(),
            };
            try {
                const { data: { data } } = await this.$axios.post("api/forgot_password", scheme);
                this.$router.push({
                    name: "forgot-thanks",
                    query: {
                        email: data.email,
                    },
                });
            } catch (error) {
                this.error.active = true;
                this.error.message =
                    error.response?.data?.message || "Ocorreu um erro ao fazer login.";
            }
        },
    },
}
</script>