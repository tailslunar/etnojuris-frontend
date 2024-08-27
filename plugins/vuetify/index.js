// plugins/vuetify.js
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import pt from 'vuetify/lib/locale/pt';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#007BFF',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        vermelho_telha: "#BA5A36",
        azul_turquesa: "#33CCCC",
        amarelo_mostarda: "#DDBB4B",
        preto_noite: "#151A1E",
        roxo: "#524391",
        bege: "#F9F8E1",
        fundo: "#F9F8E1",
        cinza_leve: "#E7E7E7",
        cinza_medio: "#7C7C8A",
        branco: "#FFFFFF",
        cinza_fraco: "#F3F3F3",
        bege_escuro: "#EEEDCB",
        bege_claro: "#FCFBF2",
        bege_sombrio: "#DDDCBE",
      },
    },
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
});
