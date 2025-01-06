<template>
    <div class="painel">
        <div data-grid="border"></div>
        <div data-grid="header">Adicionar processo</div>
        <div data-grid="h_bt">
            <v-btn text class="botao lexend" @click.prevent="salvarESair">Salvar e sair <v-icon class="ml-2"> mdi-close </v-icon></v-btn>
        </div>
        <div data-grid="link" >
            <WizardMenu nome="Quilombo" url="dashboard-processos-wizard" :condicao="hasQuilombo"/>
            <WizardMenu nome="Localização" url="dashboard-processos-wizard-localizacao" :condicao="hasQuilomboLocalizacao" sub/>
            <WizardMenu nome="Endereço" url="dashboard-processos-wizard-endereco" :condicao="hasQuilomboEndereco" sub/>
            <WizardMenu nome="Dados do processo" url="dashboard-processos-wizard-processo" :condicao="hasProcesso"/>
            <WizardMenu nome="Identificação das partes" url="dashboard-processos-wizard-partes" :condicao="hasPartes"/>
            <WizardMenu nome="Sentença" url="dashboard-processos-wizard-sentenca" :condicao="hasSentenca"/>
        </div>
        <div data-grid="conteudo"><slot /></div>
        <div data-grid="footer"><slot name="footer" /></div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters("processo", ["hasQuilombo", "hasQuilomboLocalizacao", "hasQuilomboEndereco", "hasProcesso", "hasPartes", "hasSentenca", "allprocesso"]),
    },
    methods:{
        ...mapActions("processo", ["restartProcesso"]),
        salvarESair(){
            this.$router.push({ name: `dashboard` })
        }
    }
}
</script>
<style scoped>
.painel {
    width: 100%;
    min-height: calc(100vh - 92px);
    display: grid;
    grid-template:
        "header border h_bt" min-content 
        "link   border conteudo" 1fr
        "link   border footer" min-content / max-content min-content 1fr;
    font-family: var(--font-featured);
}

[data-grid=header] {
    grid-area: header;
    font-size: 24px;
    font-weight: 800;
    color: var(--v-roxo-base);
    font-family: var(--font-featured);
    padding: 25px 35px 45px;
}

[data-grid=h_bt] {
    grid-area: h_bt;
    padding: 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

[data-grid=link] {
    grid-area: link;
}

[data-grid=border] {
    grid-area: border;
    background: var(--v-amarelo_mostarda-base);
    width: 1px;
    height: 100%;
}

[data-grid=conteudo] {
    grid-area: conteudo;
}

[data-grid=footer] {
    grid-area: footer;
    display: flex;
    justify-content: space-between;
    padding: 15px 40px 15px 15px;
}
</style>