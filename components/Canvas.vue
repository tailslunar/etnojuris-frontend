<template>
    <main :class="{ short: short }">
      <div v-if="!!loading" class="loading"><span class="loader"></span></div>
      <header v-if="header" class="header">{{ header }}</header>
      <header v-if="header_with_template" class="header_with_template">
        {{ header_with_template }}
        <slot name="coluna"/>
      </header>
      <Pesquisar v-if="pesquisa === true && false"/>
      <slot />
    </main>
  </template>
  
  <script>
  export default {
    props: ["header", "pesquisa", "header_with_template", "short", "loading"],
  };
  </script>
  
  <style scoped>
  main {
    padding: 30px 25px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  main:is(.short){
    padding: 30px 140px;
  }
  main > .header,
  main > .header_with_template
   {
    font-size: 32px;
    font-weight: 800;
    color: var(--v-roxo-base);
    font-family: var(--font-featured);
  }
  main > .header_with_template{
    display: grid;
    grid-template: ". ." / 1fr 1fr;
    align-items: center;
  }
  main > .header_with_template > div{
    font-size: 16px;
    font-weight: 400;
    color: var(--v-preto_noite-base);
    font-family: var(--font-featured);
  }
  .loading{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #f9f8e1dd;
    z-index: 999999;
    font-size:40px;
    font-weight: 900;
    color: var(--v-roxo-base);
    font-family: var(--font-featured);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
  
  <style>
  .loader {
    width: 60px;
    height: 60px;
    display: block;
    margin: 20px auto;
    position: relative;
    background: radial-gradient(ellipse at center, #ba5a36 69%, rgba(0, 0, 0, 0) 70%), linear-gradient(to right, rgba(0, 0, 0, 0) 47%, #ba5a36 48%, #ba5a36 52%, rgba(0, 0, 0, 0) 53%);
    background-size: 20px 20px , 20px auto;
    background-repeat: repeat-x;
    background-position: center bottom, center -5px;
    box-sizing: border-box;
  }
  .loader::before,
  .loader::after {
    content: '';  
    box-sizing: border-box;
    position: absolute;
    left: -20px;
    top: 0;
    width: 20px;
    height: 60px;
    background: radial-gradient(ellipse at center, #ba5a36 69%, rgba(0, 0, 0, 0) 70%), linear-gradient(to right, rgba(0, 0, 0, 0) 47%, #ba5a36 48%, #ba5a36 52%, rgba(0, 0, 0, 0) 53%);
    background-size: 20px 20px , 20px auto;
    background-repeat: no-repeat;
    background-position: center bottom, center -5px;
    transform: rotate(0deg);
    transform-origin: 50% 0%;
    animation: animPend 1s linear infinite alternate;
  }
  .loader::after {
    animation: animPend2 1s linear infinite alternate;
    left: 100%;
  }
  
  @keyframes animPend {
    0% {
      transform: rotate(22deg);
    }
    50% {
      transform: rotate(0deg);
    }
  }
  
  @keyframes animPend2 {
    0%, 55% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-22deg);
    }
  }
  </style>