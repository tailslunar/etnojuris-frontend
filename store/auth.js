export const state = () => ({
    hasLogin: false,
    usuarioID: 0,
    admin: false,
    token: "",
    avatar: "##",
    objUsuario: {}
});


export const getters = {
    auth: (state) => state,
    usuarioID: (state) => state.usuarioID,
    isAdmin: (state) => !!state.admin,
    hasLogin: (state) => (state.hasLogin),
    token: (state) => state.token,
    getAvatar: (state) => state.avatar
}

export const mutations = {
    SET_USER(state, user) {
        state.usuarioID = user.id || 0
        state.admin = !!(user.admin == 1)
        state.token = user.api_token || ""

        let initials = "##"
        if( user && user.name ){
            if (user.name.includes(' ')) {
                const words = user.name.split(' ');
                const initialsArray = words.map(word => word[0]);
                const filteredInitials = initialsArray.filter((_, i, arr) => i === 0 || i === arr.length - 1);
                initials = filteredInitials.join('');
            } else {
                initials = user.name.slice(0, 2);
            }
        }
        state.avatar = initials
        state.objUsuario = user
    },
    SET_USER_LOGADO(state, status) {
        state.hasLogin = status
    },

    SET_AUTH_RESET(state){
        state = {
            hasLogin: false,
            usuarioID: 0,
            admin: false,
            token: "",
            avatar: "##",
            objUsuario: {}
        }
    }
}

export const actions = {
    logarUsuario({ commit }, { data }) {
        commit("SET_USER", data)
        commit("SET_USER_LOGADO", true)
    },
    deslogarUsuario({ commit }) {
        //commit("SET_USER", {})
        //commit("SET_USER_LOGADO", false)
        commit("SET_AUTH_RESET")
    },
    resetUsuario({commit}){
        commit("SET_AUTH_RESET")
    }
}