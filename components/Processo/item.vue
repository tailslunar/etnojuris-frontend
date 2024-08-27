<template>
    <div class="box">
        <span>{{label}}</span>
        <span>{{value}}</span>
    </div>
</template>

<script>
export default {
    props: ["label","value"]
}
</script>

<style scoped>
.box{
    display: flex;
    flex-direction: column;
    gap: 0px;
}
.box > span:nth-child(1){
    font-size: 12px;
    color: #7C7C8A;
}
.box > span:nth-child(2){
    font-size: 14px;
    color: var(--v-preto_noite-base);
}
</style>