<template>
  <client-only>
    <Canvas>
      <Dashboard />
    </Canvas>
  </client-only>
</template>

<script>
import { mapActions } from "vuex";
export default {
  layout: 'site',
  data() {
    return {
      error: {
        active: false,
        message: "",
      },
    };
  },
  computed: {
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
    ...mapActions("dashboard", ["setDashboard"]),
    async main() {
      try {
        const { data } = await this.$axios.post(
          "/api/dashboard",
          this.objDashboard
        );
        this.setDashboard(data);
      } catch (error) {

      }
    },
  },
};
</script>