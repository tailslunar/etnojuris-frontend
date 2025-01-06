<template>
    <div class="grid-row">
        <div class="grid-column firstOrder">
            <img :src="require('@/assets/img/maps.png')" />
        </div>
        <div class="grid-column">
            <h2 class="lexand">Mapa dos quilombos</h2>
            <p>Localize quilombos e confira se possui processos judicializados. Muitos enfrentam desafios relacionados à
                titulação de suas terras, e em vários casos, há processos judicializados que questionam ou defendem seus
                direitos.</p>
        </div>
    </div>
</template>

<style scoped>
.grid-row {
    background-color: #f9f8e1;
    padding: 5rem 1rem;
    display: grid;
    grid-template: '. .' / 1fr 1fr;
    gap: 25px;
    margin-left: auto;
    margin-right: auto;
    padding: 50px;
}

h2 {
    grid-area: h2;
    color: #524391;
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

p{
    font-size: 1rem;
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
