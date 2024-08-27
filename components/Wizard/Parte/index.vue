<template>
    <main class="parte" v-if="partes.length > 0">
        <header>{{ titulo || `Falta Informação` }}</header>
        <section v-for="parte in partes" :key='parte.id' :class="{
            advogado: parte.categoria == 'advogado',
            procurador: parte.categoria == 'procurador',
            defensoria: parte.categoria == 'defensoria',
        }">
            <div grid-area="nome">Nome <span>{{ parte.nome }}</span></div>
            <div grid-area="cpf_cnpj">CPF/CNPJ <span>{{ parte.cpf_cnpj }}</span></div>
            <template v-if="parte.categoria == 'advogado'">
                <div grid-area="adv_nome">Advogado <span>{{ parte.advogado.nome }}</span></div>
                <div grid-area="adv_oab">OAB <span>{{ parte.advogado.oab }}</span></div>
                <div grid-area="adv_uf">Estado <span>{{ parte.advogado.uf }}</span></div>
                <div grid-area="adv_inst">Escritorio <span> {{ parte.advogado.instituicao }} </span></div>
            </template>
            <template v-if="parte.categoria == 'procurador'">
                <div grid-area="proc_inst">Procurador <span> {{ parte.procurador.instituicao.instituicao }} </span>
                </div>
            </template>
            <template v-if="parte.categoria == 'defensoria'">
                <div grid-area="def_inst">Defensoria <span> {{ parte.defensoria.instituicao.instituicao }} </span></div>
            </template>
            <nav>
                <WizardParteUpdate :parte="parte" />
                <v-btn text color="vermelho_telha"
                    @click.prevent="deleteParte(parte)"><v-icon>mdi-delete</v-icon></v-btn>
            </nav>
        </section>
    </main>
</template>


<script>
import { mapActions } from "vuex";
export default {
    props: ['titulo', 'partes'],
    methods: {
        ...mapActions("notificacao", ["confirmar"]),
        ...mapActions("processo", ["removeParte"]),
        async deleteParte({ id }) {
            this.confirmar({
                titulo: 'Confirmar Exclusão',
                callback: async (confirmed) => {
                    if (confirmed) {                        
                        this.removeParte(id)
                    }
                },
            });
        },
    }
}
</script>

<style scoped>
.parte {
    gap: 0px
}

.parte>header {
    padding: 10px 40px;
    font-size: 16px;
    font-weight: 900;
    color: var(--v-roxo-base);
}

section {
    background-color: var(--v-bege_claro-base);
}

section:last-child {
    border-bottom: 2px solid var(--v-amarelo_mostarda-base);
}

section:nth-of-type(odd) {
    background-color: var(--v-bege_escuro-base);
}

section {
    display: grid;
    padding: 5px 40px;
    gap: 10px;
}

section>div {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    color: #7C7C8A;
}

section>div span {
    font-size: 16px;
    color: var(--v-preto_noite-base);
}

section>nav {
    grid-area: acao;
    justify-self: end;
}

section.advogado {
    grid-template:
        " nome nome nome nome nome cpf_cnpj cpf_cnpj cpf_cnpj cpf_cnpj cpf_cnpj acao acao "
        " adv_nome adv_nome adv_nome adv_nome adv_nome adv_oab adv_uf escritorio escritorio escritorio escritorio escritorio "
        / 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    ;
}

section.procurador,
section.defensoria {
    grid-template:
        " nome nome nome nome nome cpf_cnpj cpf_cnpj cpf_cnpj cpf_cnpj cpf_cnpj acao acao "
        " escritorio escritorio escritorio escritorio escritorio escritorio escritorio escritorio escritorio escritorio escritorio escritorio "
        / 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    ;
}

section>*[grid-area="nome"] {
    grid-area: nome;
}

section>*[grid-area="cpf_cnpj"] {
    grid-area: cpf_cnpj;
}

section>*[grid-area="adv_nome"] {
    grid-area: adv_nome;
}

section>*[grid-area="adv_oab"] {
    grid-area: adv_oab;
}

section>*[grid-area="adv_uf"] {
    grid-area: adv_uf;
}

section>*[grid-area="adv_inst"],
section>*[grid-area="proc_inst"],
section>*[grid-area="def_inst"] {
    grid-area: escritorio;
}
</style>