<template>
    <div class="box">
        <span>{{ papel }}</span>
        <span>{{ categoria }}</span>
        <span>{{ partePapel }}</span>
        <span>{{ parteCategoria }}</span>
    </div>
</template>

<script>
export default {
    props: ["parte"],
    computed: {
        papel() {
            let { tipo } = this.parte.papel
            switch (tipo) {
                case 'autor': return 'Autor(a)'
                case 'reu': return 'Réu/Ré'
                case 'interessado': return 'Terceiro Interessado'
                case 'assistente': return 'Assistente'
            }
        },
        categoria() {
            let { tipo } = this.parte.categoria
            switch (tipo) {
                case 'advogado': return 'Advogado(a)'
                case 'defensoria': return 'Defensoria'
                case 'procurador': return 'Procurador(a)'
            }
        },
        partePapel(){
            let { nome, documento } = this.parte.papel
            return `${nome} ${documento}`
        },        
        parteCategoria(){
            let { tipo, nome, oab, uf, instituicao } = this.parte.categoria
            if(tipo == 'advogado') return `${nome}(${oab||'NR OAB NÃO INFORMADO'}) - ${instituicao || 'INSTITUIÇÃO NÃO INFORMADA'}/${uf||'ESTADO NÃO INFORMADO'}`
            return `${instituicao}`
        }
    },
}
</script>

<style scoped>
.box {
    display: grid;
    grid-template: '. .' '. .' / 1fr 1fr;
    gap: 3px 15px;
    padding: 15px 0px;
    border-bottom: 1px solid var(--v-amarelo_mostarda-base);
}

.box>span:nth-child(1),
.box>span:nth-child(2) {
    font-size: 12px;
    color: #7C7C8A;
}

.box>span {
    font-size: 14px;
    color: var(--v-preto_noite-base);
}
.box:last-child{
    border-bottom: none;
}
</style>