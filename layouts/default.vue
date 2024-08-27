<template>
  <client-only>
    <Init v-if="hasLogin">
      <div id="gridPainel">
        <div class="header">
          <Navbar />
        </div>
        <div class="main">
          <Nuxt />
        </div>
      </div>
      <Footer />
      <Notificacao />
      <Confirmacao />
    </Init>
  </client-only>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isAdmin: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["hasLogin"]),
  },
  mounted() {
    if (!this.hasLogin) {
      this.resetUsuario
      this.$router.push({ name: "login" });
    }
  },
  methods:{
    ...mapActions("auth", ["resetUsuario"]),
  }
};
</script>
