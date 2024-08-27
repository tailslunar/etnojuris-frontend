<template><div></div></template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'SiteDefault',
  computed: {
    ...mapGetters("auth",['hasLogin'])
  },
  mounted(){
    if( this.hasLogin ){
      this.$router.push( {name: 'dashboard'} )
    }else{      
      this.$router.push( {name: 'login'} )
    }
  }
}
</script>