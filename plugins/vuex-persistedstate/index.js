// plugins/vuex-persistedstate.js
import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: "MICaUVESLC0cRI5f91rJdkx6VyRctfxhH3",
    paths: ['auth', 'processo']
  })(store)
}
