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
  height: 100%;
  background: url("@/assets/home/01.png") top right no-repeat;
  background-size: cover;
}
aside.bg-01{
  background-image: url("@/assets/home/01.png");
}
aside.bg-02{
  background-image: url("@/assets/home/02.png");
}
</style>