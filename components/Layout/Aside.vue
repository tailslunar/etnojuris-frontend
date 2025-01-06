<template>
  <aside :class="`bg-${bg}`"></aside>
</template>

<script>
export default {
  computed: {
    bg() {
      const { name } = this.$route
      let bg = `01`
      switch(name){
        case 'register': bg = `02`; break; 
        default: bg = `01`; break; 
      }
      return bg
    },
  },
};
</script>

<style scoped>
aside {
  width: 100%;
  min-height: 700px;
  height: 100%;
  background-image: url("@/assets/home/01.png");
  background-size: cover; /* Ajusta a altura para 100% do contêiner e adapta a largura */
  background-position: right center;
  background-repeat: no-repeat;
}
aside.bg-01{
  background-image: url("@/assets/home/01.png");
}
aside.bg-02{
  background-image: url("@/assets/home/02.png");
}
</style>