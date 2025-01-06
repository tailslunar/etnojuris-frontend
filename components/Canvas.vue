<template>
  <main :class="[breakpoint, { short: short}, {full: full}]">
    <header v-if="header" class="header">{{ header }}</header>
    <header v-if="header_with_template" class="header_with_template">
      {{ header_with_template }}
      <slot name="coluna" />
    </header>
    <slot />
  </main>
</template>

<script>
export default {
  props: ["header", "header_with_template", "short", "full"],
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name;
    },
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Estilos para breakpoints específicos */
main.xs,
main.short.xs {
  padding: 30px 25px;
}

main.sm,
main.short.sm {
  padding: 30px 25px;
}

main.md,
main.short.md {
  padding: 30px 25px;
}

main.lg {
  padding: 30px 25px;
}

main.short.lg {
  padding: 30px 140px;
}

main.xl {
  padding: 30px 25px;
}

main.short.xl {
  padding: 30px 140px;
}

main.full{
  padding: 0px;
}


main>.header,
main>.header_with_template {
  font-size: 32px;
  font-weight: 800;
  color: var(--v-roxo-base);
  font-family: var(--font-featured);
}

main>.header_with_template {
  display: grid;
  grid-template: ". ." / 1fr 1fr;
  align-items: center;
}

main:is(.xs, .sm, .md)>.header_with_template {
  grid-template: "." "." / 1fr;
  gap: 20px;
}

main>.header_with_template>div {
  font-size: 16px;
  font-weight: 400;
  color: var(--v-preto_noite-base);
  font-family: var(--font-featured);
}
</style>
