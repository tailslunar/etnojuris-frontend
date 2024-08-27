<template>
    <Wizard>
        <template #footer>
            <v-btn class="botao lexend" color="amarelo_mostarda" outlined :disabled="voltar.disabled"
                v-text="voltar.text" @click.prevent="voltar.action" />
            <v-btn class="botao lexend" color="amarelo_mostarda" depressed :disabled="avancar.disabled"
                v-text="avancar.text" @click.prevent="avancar.action" />
        </template>

        <WizardCanvas class="canvas">
            <header>
                <h2> Partes </h2>
                <WizardParteCreated />
            </header>
            <template v-if="hasPartes">
                <WizardParte titulo="Autor" :partes="hasPartePapel('autor')"/>
                <WizardParte titulo="Réu" :partes="hasPartePapel('reu')"/>
                <WizardParte titulo="Assistente" :partes="hasPartePapel('assistente')"/>
                <WizardParte titulo="Terceiro Interessado" :partes="hasPartePapel('interessado')"/>
            </template>        
            <section v-else class="semParte">
                Nenhuma parte interessada foi cadastrada. Cadastre uma parte.
            </section>            
        </WizardCanvas>
    </Wizard>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters("processo", ["hasPartes", "hasPartePapel"]),
        voltar() {
            return {
                text: "Voltar",
                disabled: false,
                action: () => this.$router.push({ name: `dashboard-processos-wizard-endereco` })
            }
        },
        avancar() {
            return {
                text: this.hasPartes ? "Avançar" : "Pular",
                disabled: false,
                action: () => this.$router.push({ name: `dashboard-processos-wizard-sentenca` })
            }
        },
    },
};
</script>

<style scoped>
.canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap:0px;
}

.canvas>header {
    display: flex;
    justify-content: space-between;
    padding: 0px 40px;
}

header h2 {
    color: var(--v-roxo-base);
}

section>header {
    padding: 15px 40px;
    font-size: 16px;
    font-weight: 900;
    color: var(--v-roxo-base);
}

.semParte {
    padding: 50px 40px;
    font-size: 16px;
    color: var(--v-cinza_medio-base);
}
</style>
