<template>
  <Canvas header_with_template="Glossário" :short="true">
    <div class="pesquisar">
      <v-text-field label="Pesquisar termo especifico" outlined v-model="pesquisar" clear-icon="mdi-close-circle"
        clearable @click:clear="$router.push({})"></v-text-field>
      <v-btn x-large depressed class=" botao" color="amarelo_mostarda" @click.prevent="submitPesquisar">
        <v-icon>mdi-magnify</v-icon>
        Buscar
      </v-btn>
    </div>

    <div class="porLetra">
      <template>
        <RouterLink :to="{}">#</RouterLink>
      </template>
      <template v-for="({ letra, to, temDados, letraSelecionada }) in letrasEncontradas">
        <RouterLink :to="to" :class="{ disabled: !temDados, selecionado: letraSelecionada }">{{ letra }}</RouterLink>
      </template>
    </div>

    <div class="grupoLetra">
      <section v-for="({ letra, data, mostrar }, i) in letrasEncontradas" :key="i" v-if="mostrar">
        <h1>{{ letra }}</h1>
        <div class="glossarioLetra">
          <div v-for="{ termo, descricao, id } in data" :key="id">
            <header>
              <h1 v-html="termo"></h1>
            </header>
            <div v-html="descricao.replace(/\n/g, '<br>')"></div>
          </div>
        </div>
      </section>
    </div>
  </Canvas>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  layout: 'site',
  data() {
    let letras = [...Array(26)].map((_, i) => {
      const letra = String.fromCharCode(65 + i);
      return {
        letra,
        to: { query: { letra } },
        originalData: [],
      };
    })
    return {
      pesquisar: "",
      letras,
    }
  },
  computed: {
    letrasEncontradas() {
      return this.letras.map(a => {
        a.data = []
        if (this.$route.query.pesquisar !== undefined) {
          a.data = this.filtroGlossario(a.originalData, this.$route.query.pesquisar)
        } else {
          a.data = a.originalData
        }
        a.temDados = a.data.length > 0
        a.letraSelecionada = !!(this.$route.query.letra == a.letra)
        if (this.$route.query.letra === undefined) {
          a.mostrar = a.temDados
        } else {
          a.mostrar = this.$route.query.letra == a.letra
        }
        return a
      })
    },
  },

  mounted() {
    if (this.$route.query.pesquisar !== undefined) {
      this.pesquisar = this.$route.query.pesquisar
    }
    this.iniciarGlossario()
  },
  methods: {
    async iniciarGlossario() {
      try {
        const { data: { data } } = await this.$axios.get('/api/tb_glossario')
        let glossario = data
        this.letras.forEach(item => item.originalData = []);
        glossario.forEach(item => {
          const primeiraLetra = item.termo[0].toUpperCase()
          const itemAlfabeto = this.letras.find(item => item.letra === primeiraLetra)
          itemAlfabeto.originalData.push(item)
        })
      } catch (error) {
        console.error(error)
      }
    },
    filtroGlossario(data, query) {
      const termos = query.trim().toLowerCase().split(/\s+/);
      return data.map(item => {
        const termoOriginal = item.termo;
        const descricaoOriginal = item.descricao;

        const termoDestacado = this.destaquePesquisar(termoOriginal, termos);
        const descricaoDestacada = this.destaquePesquisar(descricaoOriginal, termos);

        // Retorna uma cópia do item com os termos destacados ou null se nenhum termo for encontrado
        if (termoDestacado !== termoOriginal || descricaoDestacada !== descricaoOriginal) {
          return { ...item, termo: termoDestacado, descricao: descricaoDestacada };
        } else {
          return null;
        }
      }).filter(Boolean); // Filtra os itens nulos
    },
    destaquePesquisar(texto, termos) {
      let textoDestacado = texto;
      termos.forEach(termo => {
        const regex = new RegExp(termo, 'gi');
        textoDestacado = textoDestacado.replace(regex, '<span style="background: #FF9632">$&</span>');
      });
      return textoDestacado !== texto ? textoDestacado : texto; // Retorna o texto destacado ou o texto original
    },
    submitPesquisar() {
      if (this.pesquisar === "") return;
      if (this.pesquisar == this.$route.query.pesquisar) return;
      this.$router.push({
        query: { pesquisar: this.pesquisar },
      });

    },
  }
}
</script>