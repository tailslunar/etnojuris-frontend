<template>
  <LayoutMiddle>
    <h3>Criar conta</h3>
    <v-alert v-if="error.active" type="error" dismissible>
      {{ error.message }}
    </v-alert>
    <v-form v-model="formIsValidity" class="wizard" ref="wizard">
      <v-text-field
        v-model="field.nome_completo"
        :rules="validate.nome_completo"
        required
        label="Nome completo:"
        outlined
      ></v-text-field>

      <v-text-field
        v-model="field.email"
        :rules="validate.email"
        label="E-mail:"
        outlined
      ></v-text-field>

      <v-text-field
        v-model="field.senha.value"
        :rules="validate.senha"
        :append-icon="
          field.senha.type == 'password' ? 'mdi-eye' : 'mdi-eye-off'
        "
        :type="field.senha.type"
        label="Senha:"
        outlined
        @click:append="
          field.senha.type =
            field.senha.type == 'password' ? 'text' : 'password'
        "
      ></v-text-field>

      <v-text-field
        v-model="field._senha.value"
        :rules="validate._senha"
        :append-icon="
          field._senha.type == 'password' ? 'mdi-eye' : 'mdi-eye-off'
        "
        :type="field._senha.type"
        label="Repetir senha:"
        outlined
        @click:append="
          field._senha.type =
            field._senha.type == 'password' ? 'text' : 'password'
        "
      ></v-text-field>

      <v-checkbox
        v-model="field.termo"
        :rules="validate.termo"
        label="Eu concordo com os termos e a politica de privacidade da Etnojuris"
        color="amarelo_mostarda"
      ></v-checkbox>

      <v-btn
        depressed
        block
        x-large
        class="botao lexend"
        color="amarelo_mostarda"
        :disabled="!formIsValidity"
        @click.prevent="submit"
      >
        Criar minha conta
      </v-btn>
    </v-form>
  </LayoutMiddle>
</template>

<script>
export default {
  layout: "SiteDefault",
  data() {
    const field = {
      nome_completo: "",
      email: "",
      senha: { type: "password", value: "" },
      _senha: { type: "password", value: "" },
      termo: null,
    };

    const validate = {
      nome_completo: [(v) => !!v || "Nome completo é obrigatório"],
      email: [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail tem que ser valido",
      ],
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
      termo: [(v) => !!v || "Para continuar tem que aceitar os termos"],
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
        name: this.field.nome_completo,
        email: this.field.email.toLocaleLowerCase(),
        password: this.field.senha.value,
      };
      try {
        const { data:{data} } = await this.$axios.post("api/register", scheme);
        console.log(data)
        this.$router.push({
          name: "finish",
          params: {
            email: data.email,
          },
        });
      } catch (error) {
        this.error.active = true;
        this.error.message =
          error.response?.data?.message || "Ocorreu um erro ao fazer login.";
      }
    },
  },
};
</script>
