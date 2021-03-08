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
      liked_content: [],
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
    modalSwitch: false,
    creation: {
      uploadText: false,
      uploadImage: false,
      content: {
        id: NaN,
        title: "",
        text: "",
        image: null,
        is_private: false,
      },
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

    SET_USER_FOLLOWING(state, following) {
      state.user.following = following;
    },

    LOGOUT(state) {
      state.user.username = "";
      state.user.followers = [];
      state.user.following = [];
      state.user.friends = [];
      state.user.liked_content = [];
      state.user.token = "";
      state.user.image = null;

      router.push("/");
    },

    SET_OTHER(state, receivedOther) {
      state.other = receivedOther;
    },

    UNSET_OTHER(state) {
      state.other = {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        image: null,
        followers: [],
        following: [],
      };
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

    UNSET_TIMELINE(state) {
      state.timeline = [];
    },

    SET_CONTENT_TITLE_EMPTY(state, content_id) {
      state.timeline.forEach((content) => {
        if (content.id === content_id) {
          content.title = "";
        }
      });
    },

    SET_USER_LIKES(state, likes) {
      state.user.liked_content = likes;
    },

    SET_MODAL_SWITCH(state) {
      state.modalSwitch = !state.modalSwitch;
    },

    SET_MODAL_SWITCH_OFF(state) {
      state.modalSwitch = false;
    },

    SET_UPLOAD_TEXT(state) {
      state.creation.uploadText = !state.creation.uploadText;
    },

    SET_UPLOAD_IMAGE(state) {
      state.creation.uploadImage = !state.creation.uploadImage;
    },

    SET_PRIVATE(state) {
      state.creation.content.is_private = !state.creation.content.is_private;
    },

    SET_CREATION_CONTENT_IMAGE(state, imageFile) {
      state.creation.content.image = imageFile;
    },

    SET_CREATION_ID(state, id) {
      state.creation.content.id = id;
    },

    SET_CREATION_FIELDS(state, content) {
      state.creation.content.title = content.title;
      state.creation.content.text = content.text;
      state.creation.content.image = null;
      state.creation.content.is_private = content.is_private;
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

    setUserFollowing({ commit }, following) {
      commit("SET_USER_FOLLOWING", following);
    },

    logout({ commit }) {
      commit("LOGOUT");
    },

    setOther({ commit }, receivedOther) {
      commit("SET_OTHER", receivedOther);
    },

    unsetOther({ commit }) {
      commit("UNSET_OTHER");
    },

    setTimeline({ commit }, contents) {
      commit("SET_TIMELINE", contents);
    },

    unsetTimeline({ commit }) {
      commit("UNSET_TIMELINE");
    },

    setContentTitleEmpty({ commit }, content_id) {
      commit("SET_CONTENT_TITLE_EMPTY", content_id);
    },

    setUserLikes({ commit }, likes) {
      commit("SET_USER_LIKES", likes);
    },

    setModalSwitch({ commit }) {
      commit("SET_MODAL_SWITCH");
    },

    setModalSwitchOff({ commit }) {
      commit("SET_MODAL_SWITCH_OFF");
    },

    setUploadText({ commit }) {
      commit("SET_UPLOAD_TEXT");
    },

    setUploadImage({ commit }) {
      commit("SET_UPLOAD_IMAGE");
    },

    setPrivate({ commit }) {
      commit("SET_PRIVATE");
    },

    setCreationContentImage({ commit }, imageFile) {
      commit("SET_CREATION_CONTENT_IMAGE", imageFile);
    },

    setCreationId({ commit }, id) {
      commit("SET_CREATION_ID", id);
    },

    setCreationFields({ commit }, content) {
      commit("SET_CREATION_FIELDS", content);
    },
  },

  modules: {},
});
