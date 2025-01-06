export const state = () => ({
    quilombos: [],
    processos: [],
    localidades: [],
});

export const getters = {
    getQuilombos: (state) => state.quilombos,
    getProcessos: (state) => state.processos,
    getLocalidades: (state) => state.localidades,
}

export const actions = {
    setQuilombo({ commit }, quilombos) {
        commit('UPDATE_QUILOMBO', quilombos)
    },
    setProcesso({ commit }, processos) {
        commit('UPDATE_PROCESSO', processos)
    },    
    setLocalidade({ commit }, localidades) {
        commit('UPDATE_LOCALIDADE', localidades)
    },
};

export const mutations = {
    UPDATE_QUILOMBO(state, quilombos) {
        state.quilombos = quilombos;
    },
    UPDATE_PROCESSO(state, processos) {
        state.processos = processos;
    },    
    UPDATE_LOCALIDADE(state, localidades) {
        state.localidades = localidades;
    },
};