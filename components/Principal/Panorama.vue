<template>
    <div class="grid-row">
        <div class="grid-column">
            <h2 class="lexand">Um panorama dos processos judiciais de quilombo em uma tela</h2>
            <ul>
                <li>
                    <img :src="require('@/assets/img/check-icon.svg')" alt="Check icon" />
                    Visualização por Estado
                </li>
                <li>
                    <img :src="require('@/assets/img/check-icon.svg')" alt="Check icon" />
                    Tempo médio dos processos
                </li>
                <li>
                    <img :src="require('@/assets/img/check-icon.svg')" alt="Check icon" />
                    Taxa de sucesso
                </li>
            </ul>
        </div>
        <div class="grid-column firstOrder">
            <img :src="require('@/assets/img/dashboard.png')" />
        </div>
    </div>
</template>

<style scoped>
.grid-row{
    background-color: #fff;
    padding: 5rem 1rem;
    display: grid;
    grid-template: '. .'/ 1fr 1fr;
    gap: 25px;
    margin-left: auto;
    margin-right: auto;
    padding: 50px;
}

h2 {
    grid-area: h2;
    color: #ba5a36;
    font-size: 2.618rem;
    font-weight: 300;
    line-height: 1;
    margin-top: 0;
    margin-bottom: 0.8rem;
    margin-top: 3.2rem;
}

img {
    max-width: 100%;

    height: auto;
}

/* Lista */
ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 2rem;
}

li {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
    font-size: 1.125rem;
    color: #151a1e;
}


li img {
    width: 24px;
    height: 24px;
}

@media screen and (max-width: 768px) {
    .grid-row {
        grid-template: '.'/ 1fr;
    }
    .firstOrder{
        order: -1;
    }
}
</style>
