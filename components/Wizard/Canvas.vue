<template>
    <main>
        <slot />
    </main>
</template>


<style scoped>
main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 5px 0px 0px;
}

main h2 {
    color: var(--v-roxo-base);
}

</style>