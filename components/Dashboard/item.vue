<template>
    <div class="elemento">
        <h4 v-if="!!titulo">{{ titulo }}</h4>
        <template v-if="$slots.default">
            <slot />
        </template>
        <h1 v-else>{{ dado }} <span>{{ complemento }}</span></h1>
    </div>
</template>

<script>
export default {
    props: ['titulo', 'dado', 'complemento']
}
</script>

<style scoped>
div.elemento {
    font-family: var(--font-featured);
    background: var(--v-bege_claro-base);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    border-radius: 8px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

div.elemento h4 {
    font-weight: 600;
    font-size: 12px;
}

div.elemento h1 {
    font-weight: 300;
    font-size: 40px;
    color: var(--v-roxo-base);
}

div.elemento h1>span {
    font-size: 18px;
    color: var(--v-preto_noite-base);
}
</style>