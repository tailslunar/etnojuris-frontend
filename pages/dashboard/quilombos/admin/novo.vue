<template>
  <Canvas header_with_template="Novo quilombo" :short="true" v-if="!!isAdmin">
    <template slot="coluna">
      <div class="rightIsAdmin">
        <v-btn depressed class="botao" color="amarelo_mostarda"
          :to="{ name: 'dashboard-quilombos-listar' }">Voltar</v-btn>
      </div>
    </template>
    <v-form v-model="isValid" autocomplete="false">
      <div class="formQuilombo_info">
        <v-text-field label="Quilombo" outlined v-model="quilombo.nome" :rules="rules.nome"
          counter="200"></v-text-field>
        <v-text-field label="Associação" outlined v-model="quilombo.associacao"></v-text-field>
        <v-text-field label="CNPJ" outlined v-model="quilombo.cnpj" v-mask='"##.###.###/####-##"'></v-text-field>
      </div>

      <div class="formQuilombo_localidade">
        <v-text-field label="CEP" outlined v-model="quilombo.cep" v-mask="'#####-###'"></v-text-field>
        <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="buscarCEP"
          :disabled="!(quilombo.cep.length == 9)">Pesquisar</v-btn>
        <v-text-field label="Endereco" outlined v-model="quilombo.endereco" counter="200"></v-text-field>
        <v-text-field label="Número" outlined v-model="quilombo.numero" counter="20"></v-text-field>
        <v-text-field label="Bairro" outlined v-model="quilombo.bairro" counter="200"></v-text-field>
        <v-text-field label="Complemento" outlined v-model="quilombo.complemento" counter="200"></v-text-field>
        <v-select label="Estado" outlined :items="localidadeEstado" v-model="localidade.uf" :rules="rules.estado"></v-select>
        <v-select label="Cidade" outlined :items="localidadeCidade" v-model="localidade.id" :rules="rules.cidade"></v-select>
        <div>
          <h3>Onde fica o quilombo</h3>
          <l-map :zoom="mapa.zoom" :center="mapa.center">
            <l-tile-layer :url="mapa.url"></l-tile-layer>
            <l-marker v-if="quilombo.latitude && quilombo.longitude"
              :lat-lng="[quilombo.latitude, quilombo.longitude]"></l-marker>
          </l-map>
        </div>
      </div>

      <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="submitQuilombo"
        :disabled="!isValid">Salvar</v-btn>


    </v-form>
  </Canvas>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  data: () => {
    return {
      localidades: [],
      quilombo: {
        nome: "",
        associacao: "",
        cnpj: "",
        cep: "",
        endereco: "",
        numero: "",
        bairro: "",
        complemento: "",
        latitude: 0,
        longitude: 0,
        localidade_id: 0,
      },
      localidade: {
        id: 0,
        uf: '',
        cidade: '',
      },
      mapa: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        zoom: 3,
        center: [-14.235004, -51.92528],
      },
      rules: {
        nome: [
          (v) => !!v || "Quilombo é obrigatório",
          (v) => (v && v.length <= 200) || "Termo não pode exceder 200 caracteres",
        ],
        estado: [
          (v) => !!v || "Estado é obrigatório"
        ],
        cidade: [
          (v) => !!v || "Cidade é obrigatório"
        ],
      },
      isValid: false,
    }
  },
  watch:{
    'localidade.id'(v){
      let loc = this.localidades.find(l => l.id == v)
      if(loc){
        this.quilombo.latitude = loc.latitude;
        this.quilombo.longitude = loc.longitude;
      }      
    },
    'localidade.cidade'(v){
      let { id, uf, cidade } = this.localidade
      let loc = this.localidades.find(l => l.uf == uf && l.cidade == cidade)
      if(loc){
        this.localidade.id = loc.id
      }      
    }
  },
  computed: {
    ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
    localidadeEstado() {
      let ufs = this.localidades.map(loc => loc.uf);
      ufs = [...new Set(ufs)].sort();
      return ufs;
    },
    localidadeCidade() {
      const { uf } = this.localidade;
      let cidades = this.localidades
        .filter(loc => loc.uf === uf)
        .map(loc => ({ text: loc.cidade, value: loc.id }));
      cidades = [...new Set(cidades.map(c => c.text))] 
        .map(nome => cidades.find(c => c.text === nome)) 
        .sort((a, b) => a.text.localeCompare(b.text));
      return cidades;
    },
    objQuilombo(){
      return{
        Bearer: this.token,
        ...this.quilombo,
        localidade_id: this.localidade.id,
        usuario_id: this.usuarioID,
      }
    }
  },
  mounted() {
    this.iniciarLocalidade()
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha"]),
    async iniciarLocalidade() {
      try {
        const { data: { data } } = await this.$axios.get(`/api/tb_localidade`);
        this.localidades = data;
      } catch (error) {
        console.error(error);
      }
    },
    async buscarCEP() {
      let { cep } = this.quilombo;
      let ws = `https://viacep.com.br/ws/${cep}/json/`;
      let resposta = await this.$axios.get(ws);
      if (resposta.status === 200) {
        let { data: { logradouro, complemento, bairro, localidade, uf } } = resposta
        this.cep = resposta.data
        this.quilombo.endereco = logradouro
        this.quilombo.complemento = complemento
        this.quilombo.bairro = bairro
        this.localidade.uf = uf
        this.localidade.cidade = localidade
      }
    },
    async submitQuilombo() {
      try {
        const response = await this.$axios.post('/api/tb_quilombo', this.objQuilombo);
        let { message } = response.data
        this.sucesso({ titulo: message })
        this.$router.push({ name: 'dashboard-quilombos-listar' })
      } catch (error) {
        let { message } = error.response.data
        let { status, statusText } = error.response
        this.falha({ titulo: `${status} ${statusText}`, mensagem: message })
      } finally {
        this.isValid = true
      }
    },
  }
}

</script>

<style scoped>
.formQuilombo_info {
  display: grid;
  grid-template: " nome nome nome " "assoc assoc assoc" " cnpj . . " / 1fr 1fr 1fr;
  gap: 0px 30px;
}

.formQuilombo_info>*:nth-child(1) {
  grid-area: nome;
}

.formQuilombo_info>*:nth-child(2) {
  grid-area: assoc;
}

.formQuilombo_info>*:nth-child(3) {
  grid-area: cnpj;
}


.formQuilombo_localidade {
  display: grid;
  grid-template: " cep btCep btCep . mapa" "end end end num mapa" "bairro compl compl compl mapa" "estado estado cidade cidade mapa" / 1fr 0.5fr 0.5fr 1fr 2fr;
  gap: 0px 30px;
}

.formQuilombo_localidade>*:nth-child(1) {
  grid-area: cep;
}

.formQuilombo_localidade>*:nth-child(2) {
  grid-area: btCep;
  justify-self: start;
  height: 55px;
}

.formQuilombo_localidade>*:nth-child(3) {
  grid-area: end;
}

.formQuilombo_localidade>*:nth-child(4) {
  grid-area: num;
}

.formQuilombo_localidade>*:nth-child(5) {
  grid-area: bairro;
}

.formQuilombo_localidade>*:nth-child(6) {
  grid-area: compl;
}

.formQuilombo_localidade>*:nth-child(7) {
  grid-area: estado;
}

.formQuilombo_localidade>*:nth-child(8) {
  grid-area: cidade;
}

.formQuilombo_localidade>*:nth-child(9) {
  grid-area: mapa;
  display: flex;
  flex-direction: column;
}

h3 {
  color: var(--v-roxo-base);
  padding: 5px;
}
</style>