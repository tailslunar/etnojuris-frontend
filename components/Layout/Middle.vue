<template>
    <main :class="{ isMobile: isMobile }">
      <slot />
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
  
  <style scoped>
  main {
    max-width: 500px;
    padding:30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  main.isMobile{
    max-width: 100%;
  }
  h3 {
    font-size: 36px;
    font-family: var(--font-featured);
    color: var(--v-vermelho_telha-base);
    margin-bottom: 28px;
  }
  h4{
    font-size: 1.3rem;
    font-weight: 500;
    font-family: var(--font-featured);
  }
  .wizard{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  </style>