<template>
    <v-snackbar :timeout="-1" :value="mostrar" top right :color="cor">
        <h3>{{ titulo }}</h3>
        {{ mensagem }}
    </v-snackbar>
</template>

<script>
import { mapGetters } from "vuex"
export default {
    computed: {
        ...mapGetters("notificacao", ["mostrar", "titulo", "mensagem", "cor"]),
    }
}
</script>