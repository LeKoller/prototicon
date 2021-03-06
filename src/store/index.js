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
      followers: [],
      following: [],
      friends: [],
      token: "",
      image: null,
    },
    other: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      image: null,
      followers: [],
      following: [],
    },
  },

  mutations: {
    SET_USER(state, receivedUser) {
      state.user = receivedUser;
    },
    SET_USER_AVATAR(state, avatar) {
      state.user.image = avatar;
    },
    SET_USER_FRIENDS(state, friends) {
      state.user.friends = friends;
    },
    LOGOUT(state) {
      state.user.username = "";
      state.user.followers = [];
      state.user.following = [];
      state.user.friends = [];
      state.user.token = "";
      state.user.image = null;

      router.push("/");
    },
    SET_OTHER(state, receivedOther) {
      state.other = receivedOther;
    },
  },

  actions: {
    setUser({ commit }, receivedUser) {
      commit("SET_USER", receivedUser);
    },
    setUserAvatar({ commit }, avatar) {
      commit("SET_USER_AVATAR", avatar);
    },
    setUserFriends({ commit }, friends) {
      commit("SET_USER_FRIENDS", friends);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    setOther({ commit }, receivedOther) {
      commit("SET_OTHER", receivedOther);
    },
  },

  modules: {},
});
