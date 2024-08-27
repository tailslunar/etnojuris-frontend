<template>
    <LayoutMiddle>
        <h3>Sucesso!</h3>
        <h4>Sua senha foi redefinida</h4>
        <v-btn depressed block x-large class="botao lexend" color="amarelo_mostarda" :to="{ name: 'login' }">
            Fazer login
        </v-btn>
    </LayoutMiddle>
</template>


<script>
export default {
    layout: 'SiteNoAside',
}
</script>