export const state = () => ({
    mostrar: false,
    titulo: "Titulo",
    mensagem: "Mensagem",
    cor: "",
    confirmar: false,
    confirmarCallback: null,
});

export const getters = {
    mostrar: (state) => state.mostrar,
    titulo: (state) => state.titulo,
    mensagem: (state) => state.mensagem,
    cor: (state) => state.cor,
    confirmar: (state) => state.confirmar,
    confirmarCallback: (state) => state.confirmarCallback,
};

export const mutations = {
    SET_NOTIFICACAO(state, notificacao) {
        state.mostrar = true;
        state.titulo = notificacao.titulo;
        state.mensagem = notificacao.mensagem;
        state.cor = notificacao.cor;
    },
    SET_RESET_NOTIFICACAO(state) {
        state.mostrar = false;
        state.titulo = "";
        state.mensagem = "";
        state.cor = "";
    },
    SET_CONFIRMAR(state, { titulo, mensagem, callback }) {
        state.confirmar = true;
        state.titulo = titulo;
        state.mensagem = mensagem;
        state.confirmarCallback = callback;
    },
    SET_RESET_CONFIRMAR(state) {
        state.confirmar = false;
        state.titulo = "";
        state.mensagem = "";
        state.confirmarCallback = null;
    },
};

export const actions = {
    sucesso({ commit }, notificacao) {
        notificacao.cor = "green";
        commit("SET_NOTIFICACAO", notificacao);
        setTimeout(() => {
            commit("SET_RESET_NOTIFICACAO");
        }, 3000);
    },
    falha({ commit }, notificacao) {
        notificacao.cor = "red";
        commit("SET_NOTIFICACAO", notificacao);
        setTimeout(() => {
            commit("SET_RESET_NOTIFICACAO");
        }, 3000);
    },
    confirmar({ commit }, { titulo, mensagem, callback }) {
        commit("SET_CONFIRMAR", { titulo, mensagem, callback });
    },
    confirmarReset({ commit }) {
        commit("SET_RESET_CONFIRMAR");
    },
};
