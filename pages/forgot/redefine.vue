<template>
  <LayoutMiddle>
    <h3>Redefinir Senha</h3>
    <h4>Digite uma nova senha</h4>
    <v-alert v-if="error.active" type="error" dismissible>
      {{ error.message }}
    </v-alert>
    <v-form v-model="formIsValidity" class="wizard" ref="wizard">
      <v-text-field v-model="field.senha.value" :rules="validate.senha" :append-icon="field.senha.type == 'password' ? 'mdi-eye' : 'mdi-eye-off'
        " :type="field.senha.type" label="Nova senha:" outlined @click:append="
          field.senha.type =
          field.senha.type == 'password' ? 'text' : 'password'
          "></v-text-field>

      <v-text-field v-model="field._senha.value" :rules="validate._senha" :append-icon="field._senha.type == 'password' ? 'mdi-eye' : 'mdi-eye-off'
        " :type="field._senha.type" label="Repetir nova senha:" outlined @click:append="
          field._senha.type =
          field._senha.type == 'password' ? 'text' : 'password'
          "></v-text-field>
      <v-btn depressed block x-large class="botao lexend" color="amarelo_mostarda" :disabled="!formIsValidity"
        @click.prevent="submit">
        Redefinir senha
      </v-btn>
    </v-form>

  </LayoutMiddle>
</template>


<script>
export default {
  layout: 'SiteNoAside',
  data() {
    const field = {
      senha: { type: "password", value: "" },
      _senha: { type: "password", value: "" },
    };

    const validate = {
      senha: [
        (v) => !!v || "Senha é obrigatório",
        (v) => v.length >= 8 || "A senha deve ter pelo menos 8 caracteres",
        (v) =>
          /[a-z]/.test(v) ||
          "A senha deve conter pelo menos uma letra minúscula",
        (v) =>
          /[A-Z]/.test(v) ||
          "A senha deve conter pelo menos uma letra maiúscula",
        (v) => /\d/.test(v) || "A senha deve conter pelo menos um número",
        (v) =>
          /[^a-zA-Z\d\s]/.test(v) ||
          "A senha deve conter pelo menos um caracter especial.",
      ],
      _senha: [
        (v) => !!v || "Senha é obrigatório",
        (v) => v === field.senha.value || "Senhas não são iguais",
      ],
    };

    return {
      field,
      validate,
      formIsValidity: false,
      error: {
        active: false,
        message: "",
      },
    };
  },
  methods: {
    async submit() {
      let scheme = {
        password: this.field.senha.value,
        id: parseInt(this.$route.query.userId, 10),
        token: this.$route.query.token,
      };
      try {
        const { data: { data } } = await this.$axios.post("password_recovery_post", scheme);
        console.log(data)
        this.$router.push({
          name: "forgot-finish",
        });
      } catch (error) {
        this.error.active = true;
        this.error.message =
          error.response?.data?.message || "Ocorreu um erro ao recuperar a senha.";
      }
    },
  },
  created() {
    const userId = this.$route.query.userId;
    const token = this.$route.query.token;

    if (!userId || !token) {
      this.$router.push({ name: 'index' });
    }
  }
}
</script>