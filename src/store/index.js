import { createStore } from "vuex";

export default createStore({
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
  },

  actions: {
    setUser({ commit }, receivedUser) {
      commit("SET_USER", receivedUser);
    },
  },

  modules: {},
});
