<template>
    <main>
      <v-btn text v-if="url != 'login'" class="botao lexend" :to="{ name: 'login' }"> Já tenho conta. Fazer login </v-btn>
      <v-btn text v-if="url != 'register'" class="botao lexend" :to="{ name: 'register' }">Não tenho conta, Criar conta</v-btn>
    </main>
  </template>
  
  <script>
  export default {
    computed: {
      url() {
        const { name } = this.$route;
        return name;
      },
    },
  };
  </script>
  
  <style scoped>
  main{
      padding: 20px;
      display: flex;
      justify-content: center;
  }
  </style>