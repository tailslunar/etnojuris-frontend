<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="acknowledgement">
                <h1 class="lexand">Agradecimento</h1>
                <p>
                    O projeto <strong>Etnojuris</strong> só foi possível graças às empresas que financiaram,
                    desenvolveram e
                    apoiaram essa iniciativa.
                </p>
                <p>
                    Nosso agradecimento especial a todos que contribuíram para tornar isso uma realidade!
                </p>
            </div>

            <div class="section">
                <h3>Financiado por:</h3>
                <div class="logo-container">
                    <a v-for="(financiador, idF) in financiadores" :key="idF" :href="financiador.url" target="_blank"
                        rel="noopener noreferrer">
                        <img :src="financiador.img" :alt="financiador.nome" :width="financiador.width || 100"/>
                    </a>
                </div>
            </div>

            <div class="section">
                <h3>Desenvolvido por:</h3>
                <div class="logo-container">
                    <a v-for="(dev, idD) in desenvolvedores" :key="idD" :href="dev.url" target="_blank"
                        rel="noopener noreferrer">
                        <img :src="dev.img" :alt="dev.nome" :width="dev.width || 100"/>
                    </a>
                </div>
            </div>

            <div class="section">
                <h3>Com o apoio de:</h3>
                <div class="logo-container">
                    <a v-for="(apoio, idA) in apoiadores" :key="idA" :href="apoio.url" target="_blank"
                        rel="noopener noreferrer">
                        <img :src="apoio.img" :alt="apoio.nome" :width="apoio.width || 100"/>
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>


<script>
export default {
    computed: {
        financiadores() {
            return [
                {
                    url: 'https://www.ufam.edu.br',
                    nome: 'Universidade Federal do Amazonas',
                    img: require('@/assets/agradecimento/financiadores/ufam.png'),
                },
                {
                    url: 'https://www.fapeam.am.gov.br/',
                    nome: 'Fundação de Amparo à Pesquisa do Estado do Amazonas',
                    img: require('@/assets/agradecimento/financiadores/fapeam.png'),
                },                
                {
                    url: 'https://www.gov.br/cnpq/pt-br',
                    nome: 'CNPq',
                    img: require('@/assets/agradecimento/financiadores/cnpq.png'),
                    width: 200
                },
            ];
        },
        desenvolvedores() {
            return [
                {
                    url: 'http://studiocaudas.com/',
                    nome: 'Studio Caudas',
                    img: require('@/assets/agradecimento/desenvolvedores/studiocaudas.png'),
                },
                {
                    url: 'http://smile.dev.br/',
                    nome: 'Sm;)e Digital Solution',
                    img: require('@/assets/agradecimento/desenvolvedores/smile.png'),
                    width: 150
                },
                {
                    url: 'https://pedrobiz.com/',
                    nome: 'Pedro Biz',
                    img: require('@/assets/agradecimento/desenvolvedores/pedro-biz.png'),
                    width: 150
                },
            ];            
        },
        apoiadores() {
            return [
                {
                    url: 'https://www.jusbrasil.com.br/',
                    nome: 'Jusbrasil',
                    img: require('@/assets/agradecimento/apoiadores/jusbrasil.png'),
                },
            ]; 
        }
    }
}
</script>

<style scoped>
/* Estilo do rodapé */
.footer {
    background-color: #f9f8e1;
    /* Cor de fundo bege */
    padding: 3rem 1rem;
    /* Espaçamento interno */
    font-family: "Lexend", sans-serif;
    /* Fonte padrão */
    color: #151a1e;
    /* Cor do texto */
    text-align: center;
}

/* Contêiner principal */
.footer-container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Seção de agradecimento */
.acknowledgement {
    text-align: center;
}

.acknowledgement h1 {
    color: #ba5a36;
    /* Cor do título */
    font-weight: 200;
    font-size: 3.5rem;
    line-height: 1.2;
    margin-bottom: 3.2rem;
}

.acknowledgement p {
    line-height: 1.6;
    font-weight: 400;
    margin-bottom: 1rem;
}

/* Seções */
.section h3 {
    color: #ba5a36;
    /* Cor do título */
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
}

.logo-container {
    display: flex;
    /* Exibe as imagens verticalmente */
    align-items: center;
    justify-content: center;
    /* Centraliza as imagens */
    gap: 5rem;
    /* Espaçamento entre as imagens */
}

/* Links das imagens */
.logo-container a {
    display: inline-block;
    text-decoration: none;
}

.logo-container img {
    /* Limita o tamanho máximo da imagem */
    width: 100%;
    height: 120px;
    transition: transform 0.3s ease-in-out;
    /* Animação ao passar o mouse */
}

.logo-container img:hover {
    transform: scale(1.1);
    /* Aumenta a imagem ao passar o mouse */
}

/* Responsividade */
@media screen and (max-width: 768px) {
    .acknowledgement h1 {
        font-size: 1.5rem;
    }

    .acknowledgement p {
        font-size: 1.1rem;
    }

    .logo-container img {
        max-width: 120px;
    }
}
</style>