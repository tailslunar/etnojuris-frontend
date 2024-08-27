<template>
    <router-link :to="{ name: url }" class="box-link" :class="{ indent: sub }" exact exact-active-class="ativo">
        <v-icon color="azul_turquesa" v-if="condicao">mdi-checkbox-marked-circle</v-icon>
        <v-icon color="azul_turquesa" v-else>mdi-menu-right</v-icon>
        {{ nome }}
    </router-link>
</template>
<script>
export default {
    props: {
        nome: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        condicao: {
            type: Boolean,
            default: false
        },
        sub: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
.box-link {
    display: flex;
    gap: 10px;
    text-decoration: none;
    font-weight: 600;
    font-size: 18px;
    color: var(--v-roxo-base);
    padding: 15px 35px;
}

.box-link.indent {
    padding-left: 70px;
    font-weight: 500;
}

.box-link:hover.disabled {
    cursor: not-allowed;
}

.v-icon {
    grid-area: icon;
}

.box-link:hover {
    background-color: #ffffff80;
}

.box-link.ativo {
    background-color: var(--v-bege_escuro-base);
}
</style>