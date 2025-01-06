<template>
  <Canvas header_with_template="Novo processo" :short="true" v-if="!!isAdmin">
    <template slot="coluna">
      <div class="rightIsAdmin">
        <v-btn depressed class="botao" color="amarelo_mostarda" :to="{ name: 'dashboard-processos' }">Voltar</v-btn>
      </div>
    </template>
    <v-form v-model="isValid">
      <h3>Processo</h3>
      <div class="formProcesso">
        <v-text-field label="Número do processo:" v-mask="'#######-##.####.#.##.####'" v-model="field.numero"
          :rules="rules.numero" outlined clearable></v-text-field>
        <v-select label="Competência" outlined :items="competencias" v-model="field.competencia"
          :rules="rules.competencia"></v-select>
        <v-text-field label="Jurisdição" v-model="field.jurisdicao" outlined clearable></v-text-field>
        <v-text-field label="Comarca" v-model="field.comarca" outlined clearable></v-text-field>
        <v-text-field label="Foro" v-model="field.foro" outlined clearable></v-text-field>
        <v-text-field label="Vara" v-model="field.vara" outlined clearable></v-text-field>
        <v-select label="Estado" outlined :items="estados" v-model="field.estado" :rules="rules.estado"></v-select>
        <v-select label="Cidade" outlined :items="cidades" v-model="field.cidade" :rules="rules.cidade"></v-select>
      </div>
      <h3>Quilombo</h3>
      <div class="formQuilombo">
        <v-select label="Quilombo" outlined :items="quilombos" v-model="field.quilombo_id"
          :rules="rules.quilombo"></v-select>
      </div>
      <h3>Partes</h3>
      <div class="formPartes">
        <section class="formPartes_papel">
          <v-select label="Papel" outlined :items="papel" v-model="field.papel" :rules="rules.papel"></v-select>
          <v-text-field label="Nome" v-model="field.papel_nome" outlined clearable></v-text-field>
          <v-text-field label="Documento" v-model="field.papel_doc" outlined clearable></v-text-field>
        </section>
        <section class="formPartes_categoria" :class="field.categoria">
          <v-select label="Categoria" outlined :items="categoria" v-model="field.categoria" :rules="rules.papel"></v-select>
        </section>
      </div>
      <h3>Informações Complementares</h3>
      <div class="formInfo">
        <v-text-field label="Data da publicação:" v-model="field.data_publicacao" outlined clearable
          v-mask="'##/##/####'"></v-text-field>
        <v-select :items="sentencas" label="Sentenca" item-text="nome" v-model="field.sentenca_id" outlined clearable
          item-value="id"></v-select>
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
      competencias: ['Estadual', 'Federal'],
      quilombos: [],
      sentencas: [],
      papel:['autor','reu', 'assistente', 'interessado'],
      categoria:['advogado','defensoria', 'procurador'],
      field: {},
      rules: {}
    }

  },
  computed: {
    ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
    estados(){
      return [];
    },
    cidades(){
      return [];
    }
  },
  mounted() {
    //this.iniciarQuilombo();
  },
  methods: {
    ...mapActions("notificacao", ["sucesso", "falha"]),
  }
}

</script>


<style scoped>
.formProcesso {
  display: grid;
  grid-template:
    " num_processo num_processo num_processo num_processo competencia competencia competencia"
    " jurisdicao comarca comarca foro foro vara vara"
    " estado estado cidade cidade cidade cidade cidade"
    / 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0px 30px;
}

.formProcesso>*:nth-child(1) {
  grid-area: num_processo;
}

.formProcesso>*:nth-child(2) {
  grid-area: competencia;
}

.formProcesso>*:nth-child(3) {
  grid-area: jurisdicao;
}

.formProcesso>*:nth-child(4) {
  grid-area: comarca;
}

.formProcesso>*:nth-child(5) {
  grid-area: foro;
}

.formProcesso>*:nth-child(6) {
  grid-area: vara;
}
.formProcesso>*:nth-child(7) {
  grid-area: estado;
}
.formProcesso>*:nth-child(8) {
  grid-area: cidade;
}


.formQuilombo {
  display: grid;
  grid-template: " . " / 1fr;
  gap: 0px 30px;
}

.formPartes{
  display: flex;
  flex-direction: column;
  gap:0px;
}
.formPartes > section{
  display: grid;
  gap: 0px 30px;
}
.formPartes > section:nth-child(1){
  grid-template: ". . ." / 1fr 3fr 2fr;
}

.formInfo {
  display: grid;
  grid-template: " . . " / 1fr 1fr;
  gap: 0px 30px;
}
h3 {
  color: var(--v-roxo-base);
  padding: 5px;
}
</style>