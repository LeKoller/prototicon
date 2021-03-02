import { createStore } from "vuex";

export default createStore({
  state: {
    token: "",
  },

  mutations: {
    SET_TOKEN(state, receivedToken) {
      state.token = receivedToken;
    },
  },

  actions: {
    setToken({ commit }, receivedToken) {
      commit("SET_TOKEN", receivedToken);
    },
  },

  modules: {},
});
