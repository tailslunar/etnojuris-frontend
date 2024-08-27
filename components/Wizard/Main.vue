<template>
    <main>
        <h2 v-if="titulo">{{ titulo }}</h2>
        <slot />
    </main>
</template>

<script>
export default {
    props: ['titulo'],
}
</script>


<style scoped>
main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 5px 40px;
    max-width: 600px;
}

main h2 {
    color: var(--v-roxo-base);
}

</style>