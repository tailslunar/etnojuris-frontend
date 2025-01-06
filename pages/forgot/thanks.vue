<template>
    <LayoutMiddle>
      <h3>Obrigado</h3>
      <h4>
        As instruções foram enviadas para <strong>{{$route.query.email}}</strong>, caso tenha um
        perfil registrado com esse e-mail. Se você não recebeu o e-mail, por favor
        revise a escrita do seu endereço de e-mail(verifique se nao há erros de
        digitação) e solicite o reenvio das instruções.
      </h4>
      <v-btn
        depressed
        block
        x-large
        class="botao lexend"
        color="amarelo_mostarda"
        :to="{name: 'login'}"
      >
        Voltar para a página de login
      </v-btn>
      <v-btn
        text
        depressed
        block
        x-large
        class="botao lexend"
        color="cinza_medio"
        :to="{ name: 'forgot' }"
        >Reenviar as instruções novamente</v-btn
      >
    </LayoutMiddle>
  </template>

<script>
export default {
  layout: 'SiteNoAside',
}
</script>