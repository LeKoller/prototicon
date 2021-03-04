import { createStore } from "vuex";
import router from "../router";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],

  state: {
    user: {
      username: "",
      token: "",
    },
  },

  mutations: {
    SET_USER(state, receivedUser) {
      state.user = receivedUser;
    },
    LOGOUT(state) {
      state.user.token = "";
      state.user.username = "";

      router.push("/");
    },
  },

  actions: {
    setUser({ commit }, receivedUser) {
      commit("SET_USER", receivedUser);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },

  modules: {},
});
