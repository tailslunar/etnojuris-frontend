<template>
  <LayoutMiddle>
    <h3>Obrigado</h3>
    <h4>
      As instruções foram enviadas para o e-mail {{ $route.params.email }}.
    </h4>
  </LayoutMiddle>
</template>

<script>
export default {
  layout: "SiteNoAside",
  mounted(){
    if(typeof this.$route.params.email == 'undefined'){
      this.$router.push({
          name: "index"
        });
    }
  }
}
</script>
