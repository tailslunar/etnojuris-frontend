<template>
    <LayoutMiddle>
        <h3>Esqueci minha senha</h3>
        <h4>Informe seu e-mail e solicite para alterar sua senha</h4>
        <v-text-field label="Endereço de email: " outlined hint="Digite um endereço de email válido"></v-text-field>
        <v-btn depressed block x-large class="botao lexend" color="amarelo_mostarda" :to="{ name: 'forgot-thanks' }">
            Recuperar minha senha
        </v-btn>
    </LayoutMiddle>
</template>

<script>
export default {
    layout: 'SiteNoAside',
}
</script>