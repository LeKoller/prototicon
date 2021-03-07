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
    timeline: [],
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

    SET_TIMELINE(state, contents) {
      contents.sort((a, b) => {
        if (a.id < b.id) {
          return 1;
        }

        return -1;
      });
      state.timeline = contents;
    },

    SET_CONTENT_TITLE_EMPTY(state, content_id) {
      state.timeline.forEach((content) => {
        if (content.id === content_id) {
          content.title = "";
        }
      });
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

    setTimeline({ commit }, contents) {
      commit("SET_TIMELINE", contents);
    },

    setContentTitleEmpty({ commit }, content_id) {
      commit("SET_CONTENT_TITLE_EMPTY", content_id);
    },
  },

  modules: {},
});
