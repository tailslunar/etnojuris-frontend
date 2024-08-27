<template>
  <Canvas header_with_template="Novo quilombo" :short="true" v-if="!!isAdmin">
    <template slot="coluna">
      <div class="rightIsAdmin">
        <v-btn depressed class="botao" color="amarelo_mostarda"
          :to="{ name: 'dashboard-quilombos-listar' }">Voltar</v-btn>
      </div>
    </template>
    <v-form v-model="isValid">
      <div class="formQuilombo_info">
        <v-text-field label="Quilombo" outlined v-model="quilombo.nome" :rules="rules.nome"
          counter="200"></v-text-field>
        <v-text-field label="Associação" outlined v-model="quilombo.associacao"></v-text-field>
        <v-text-field label="CNPJ" outlined v-model="quilombo.cnpj" :rules="rules.cnpj"
          v-mask='"##.###.###/####-##"'></v-text-field>
      </div>

      <div class="formQuilombo_localidade">
        <v-text-field label="CEP" outlined v-model="quilombo.cep" :rules="rules.cep"
          v-mask="'#####-###'"></v-text-field>
        <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="buscarCEP"
          :disabled="!(quilombo.cep.length == 9)">Pesquisar</v-btn>
        <v-text-field label="Endereco" outlined v-model="quilombo.endereco" :rules="rules.endereco"
          counter="200"></v-text-field>
        <v-text-field label="Número" outlined v-model="quilombo.numero" :rules="rules.numero"
          counter="20"></v-text-field>
        <v-text-field label="Bairro" outlined v-model="quilombo.bairro" counter="200"></v-text-field>
        <v-text-field label="Complemento" outlined v-model="quilombo.complemento" counter="200"></v-text-field>
        <v-text-field label="Estado" outlined v-model="localidade.uf" disabled></v-text-field>
        <v-text-field label="Cidade" outlined v-model="localidade.cidade" disabled></v-text-field>
        <div>
          <h3>Onde fica o quilombo</h3>
          <l-map :zoom="mapa.zoom" :center="mapa.center" @click="setMarker">
            <l-tile-layer :url="mapa.url"></l-tile-layer>
            <l-marker v-if="quilombo.latitude && quilombo.longitude"
              :lat-lng="[quilombo.latitude, quilombo.longitude]"></l-marker>
          </l-map>
        </div>
      </div>

      <v-btn depressed class="botao" color="amarelo_mostarda" @click.prevent="submitLocalidadeQuilombo"
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
        longitude: 0
      },
      localidade: {
        id: 0,
        uf: "",
        cidade: "",
      },
      cep: null,
      rules: {
        nome: [
          (v) => !!v || "Quilombo é obrigatório",
          (v) => (v && v.length <= 200) || "Termo não pode exceder 200 caracteres",
        ],
        cnpj: [
          (v) => !!v || "CNPJ é obrigatório",
        ],
        cep: [
          (v) => !!v || "CEP é obrigatório",
        ],
        endereco: [
          (v) => !!v || "Endereço é obrigatório",
        ],
        numero: [
          (v) => !!v || "Número é obrigatório",
        ],
        latitude: [
          (v) => v !== 0 || "Latitude é obrigatória",
        ],
        longitude: [
          (v) => v !== 0 || "Longitude é obrigatória",
        ],
      },
      isValid: false,
      mapa: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        zoom: 4,
        center: [-14.235004, -51.92528],
      },
    }
  },
  computed: {
    ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
    objQuilombo() {
      return {
        Bearer: this.token,
        ...this.quilombo,
        localidade_id: this.localidade.id,
        usuario_id: this.usuarioID,
      }
    },
    objLocalidade() {
      let { id, ...localidade } = this.localidade;
      return {
        Bearer: this.token,
        ...localidade,
      }
    }
  },
  mounted() {
    this.iniciarQuilombo();
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha"]),
    async iniciarQuilombo() {
      try {
        const {
          data: { data },
        } = await this.$axios.get(`/api/tb_localidade`);
        this.localidades = data;
      } catch (error) {
        console.error(error);
      }
    },
    async submitLocalidadeQuilombo() {
      if (this.quilombo.latitude === 0 || this.quilombo.longitude === 0) {
        this.falha({ titulo: "Erro", mensagem: "A posição no mapa é obrigatória." });
        this.isValid = true;
        return;
      }
      if (!this.isValid) return;
      this.isValid = false;

      try {
        const localidadeExistente = this.localidades.find(
          loc => loc.uf === this.localidade.uf && loc.cidade === this.localidade.cidade
        );
        if (localidadeExistente) {
          // Se existir, usa o id da localidade existente
          this.localidade.id = localidadeExistente.id;
        } else {
          // Se não existir, cria uma nova localidade
          const novaLocalidade = await this.submitLocalidade();
          this.localidade.id = novaLocalidade.id; // Pega o id da nova localidade
        }
        await this.submitQuilombo();
      } catch (error) {
        console.error(error);
        this.falha({ titulo: "Erro", mensagem: "Não foi possível salvar o Quilombo" });
      } finally {
        this.isValid = true;
      }
    },
    async submitLocalidade() {
      try {
        const response = await this.$axios.post('/api/tb_localidade', this.objLocalidade);
        return response.data.data; // Retorna o objeto localidade criado com o novo ID
      } catch (error) {
        console.error(error);
        this.falha({ titulo: "Erro", mensagem: "Não foi possível salvar a Localidade" });
        throw error; // Lança o erro para ser capturado em submitLocalidadeQuilombo
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
    setMarker(e) {
      this.quilombo.latitude = e.latlng.lat;
      this.quilombo.longitude = e.latlng.lng;
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
  grid-template: " cep btCep . mapa" "end end num mapa" "bairro compl compl mapa" "estado cidade . mapa" / 1fr 1fr 1fr 2fr;
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