<template>
    <LayoutMiddle>
      <h3>Redefinir Senha</h3>
      <h4>Digite uma nova senha</h4>
      <v-text-field
        label="Nova senha: "
        outlined
      ></v-text-field>
      <v-text-field
        label="Repetir nova senha: "
        outlined
      ></v-text-field>
      <v-btn
        depressed
        block
        x-large
        class="botao lexend"
        color="amarelo_mostarda"
        :to="{name: 'forgot-finish'}"
      >
        Redefinir senha
      </v-btn>
    </LayoutMiddle>
  </template>


<script>
export default {
  layout: 'SiteNoAside',
}
</script>