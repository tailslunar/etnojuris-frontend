export const state = () => ({
    objQuilombo: {},
    objProcesso: {},
    objParte:[],
});

export const getters = {
    allprocesso: (state) => state,
    
    quilombo: (state) => state.objQuilombo,
    processo: (state) => state.objProcesso,

    hasQuilombo: (state) => Object.keys(state.objQuilombo).length > 0,
    
    hasQuilomboLocalizacao: (state) => {
        const { latitude, longitude, id } = state.objQuilombo;
        return Object.keys(state.objQuilombo).length > 0 && ( !!id || (latitude !== null && longitude !== null) )
    },
    hasQuilomboEndereco: (state) => {
        const { cep, id } = state.objQuilombo;
        return Object.keys(state.objQuilombo).length > 0 && ( !!id || cep !== null )
    },
    hasProcesso: (state) => Object.keys(state.objProcesso).length > 0,

    hasPartes: (state) => state.objParte.length > 0,

    hasSentenca: (state) => {
        const { data_publicacao, sentenca } = state.objProcesso;
        return Object.keys(state.objProcesso).length > 0 && ( !!data_publicacao || !!sentenca )
    },

    hasPartePapel:(state) => (papel) => state.objParte?.filter( p => p.papel == papel)
}

export const mutations = {
    RESTART(state) {
        state.objQuilombo = {}
        state.objProcesso = {}
        state.objParte = []
    },
    SET_QUILOMBO(state, quilombo) {
        state.objQuilombo = quilombo
    },    
    SET_PROCESSO(state, processo) {
        state.objProcesso = processo
    },        
    SET_PARTE(state, parte) {
        state.objParte.push(parte)
    },
    UPDATE_PARTE_ID(state, parte) {
        let index = state.objParte.findIndex(p => p.id == parte.id);
        if (index !== -1) {
            state.objParte.splice(index, 1, parte);
        }
    },
    REMOVE_PARTE_ID(state, id) {
        let index = state.objParte.findIndex(p => p.id == id);    
        if (index !== -1) {
            state.objParte.splice(index, 1); 
        }
    },
}

export const actions = {
    restartProcesso({ commit }) {
        commit('RESTART')
    },
    whatQuilombo({ commit }, quilombo) {
        commit("SET_QUILOMBO", quilombo)
    },
    whatProcesso({ commit }, processo) {
        commit("SET_PROCESSO", processo)
    },    
    whatParte({ commit }, parte) {
        const id = crypto.randomUUID();
        const parteComID = {id,...parte}
        commit("SET_PARTE", parteComID)
    },
    updateParteId({ commit }, parte) {
        commit("UPDATE_PARTE_ID", parte)
    },
    removeParte({commit}, id){
        commit("REMOVE_PARTE_ID", id)
    }
}