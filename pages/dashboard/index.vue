<template>
  <Canvas>
    <v-alert v-if="error.active" type="error" dismissible>
      {{ error.message }}
    </v-alert>
    <HomeHeader />
    <HomeMain />
    <HomePesquisa /> 
  </Canvas>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      error: {
        active: false,
        message: "",
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["token"]),
    ...mapGetters("dashboard", ["dashboard", "dashboardEstado"]),
    objDashboard() {
      return {
        Bearer: this.token,
      };
    },
  },
  mounted() {
    this.main();
  },
  methods: {
    ...mapActions("dashboard", ["setDashboard", "setDashboardEstado", "setDashboardEstadoRegiao"]),
    async main() {
      try {
        const { data } = await this.$axios.post(
          "/api/dashboard",
          this.objDashboard
        );
        this.setDashboard(data);
      } catch (error) {
        this.error.active = true;
        this.error.message = error.response?.data?.message || "Erro";
      }
    },
  },
};
</script>
