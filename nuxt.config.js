import pt from 'vuetify/lib/locale/pt';

const vuetifyTheme = {
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
  bege_sombrio: "#DDDCBE"
}

export default {
  server: {
    host: '0.0.0.0', // Isso faz com que o servidor esteja acessível em toda a rede local
    port: 3000        // Você pode alterar a porta se necessário
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'Etnojuris :: %s',
    title: 'Cartografia de conflitos etno-quilombola judicializados',
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@100,200,300,400;500;600;700&family=Roboto:wght@400;500;700&display=swap' }
    ]
  },

  loading: '~/components/Loading.vue',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'vuetify/dist/vuetify.min.css',
    '~/assets/global.css',
    '~/assets/glossario/index.css',
    '~/assets/repositorio/index.css',
    'leaflet/dist/leaflet.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/svg-map',
    { src: '~/plugins/graficos', mode: 'client' },
    { src: '~/plugins/mapa', mode: 'client' },
    '~/plugins/v-mask',
    { src: '~/plugins/vuex-persistedstate', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],

  moment: {
    defaultLocale: 'pt-br',
    locales: ['pt-br'],
    defaultTimezone: 'America/Sao_Paulo',
    timezone: true,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      options: {
        customProperties: true,
      },
      dark: false, // Mude para false se você quiser usar o tema claro
      themes: {
        light: vuetifyTheme
      }
    },
    lang: {
      locales: { pt },
      current: 'pt',
    },
  },

  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.API,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-svg-map', '@svg-maps/brazil', 'vue-chartjs', 'chart.js'],
  },
  env: {
    vuetifyTheme
  }
}
