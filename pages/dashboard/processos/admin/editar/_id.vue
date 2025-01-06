<template>
    <Canvas header_with_template="Editar Processo" :short="true" v-if="!!isAdmin">
        <template slot="coluna">
            <div class="rightIsAdmin">
                <v-btn depressed class="botao" color="amarelo_mostarda"
                    :to="{ name: 'dashboard-processos' }">Voltar</v-btn>
            </div>
        </template>

        <v-tabs v-model="aba" center-active background-color="fundo" color="amarelo_mostarda"
            style="margin-bottom: 10px;">
            <v-tab>Processo</v-tab>
            <v-tab>Quilombo</v-tab>
            <v-tab>Partes</v-tab>
            <v-tab>Sentença</v-tab>
        </v-tabs>

        <ProcessoEditar v-if="aba == 0" />
        <ProcessoEditarQuilombo v-if="aba == 1" />
        <ProcessoEditarPartes v-if="aba == 2" />
        <ProcessoEditarSentenca v-if="aba == 3" />

    </Canvas>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    data: () => {
        return {
            aba: null,
        }
    },
    computed: {
        ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
    }
}
</script>