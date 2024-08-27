<template>
  <LayoutMiddle>
    <h3>Entrar</h3>
    <v-alert v-if="error.active" type="error" dismissible>
      {{ error.message }}
    </v-alert>
    <v-form v-model="formIsValidity" class="wizard" ref="wizard">
      <v-text-field v-model="field.email" :rules="validate.email" label="Endereço de email:" outlined></v-text-field>

      <v-text-field v-model="field.password.value" :rules="validate.password" :append-icon="field.password.type == 'password' ? 'mdi-eye' : 'mdi-eye-off'
        " :type="field.password.type" label="Senha:" outlined @click:append="
          field.password.type =
          field.password.type == 'password' ? 'text' : 'password'
          "></v-text-field>

      <v-btn depressed block x-large class="botao lexend" color="amarelo_mostarda" :disabled="!formIsValidity"
        @click="makeLogin">
        Acessar minha conta
      </v-btn>
    </v-form>
    <v-btn text depressed block x-large class="botao lexend" color="cinza_medio" :to="{ name: 'forgot' }">Esqueci minha
      senha</v-btn>

  </LayoutMiddle>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  layout: 'SiteDefault',
  data() {
    const field = {
      email: "",
      password: { value: "", type: "password" },
    };

    const validate = {
      email: [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail tem que ser valido",
      ],
      password: [(v) => !!v || "Senha é obrigatório"],
    };
    return {
      field,
      validate,
      formIsValidity: false,
      error: {
        active: false,
        message: ''
      }
    };
  },
  methods: {
    ...mapActions('auth', ['logarUsuario']),
    async makeLogin() {
      let auth = {
        "email": this.field.email,
        "password": this.field.password.value,
      }
      try {
        const { data } = await this.$axios.post('api/login', auth)
        await this.logarUsuario(data)
        this.$router.push({ name: 'dashboard' })
      } catch (error) {
        this.error.active = true
        this.error.message = error.response?.data?.message || 'Ocorreu um erro ao fazer login.'
      }
    }
  }
}
</script>