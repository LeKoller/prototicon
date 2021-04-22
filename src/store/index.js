import { createStore } from "vuex";
import router from "../router";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";

export default createStore({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],

  state: {
    user: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      token: "",
      image: null,
      wallpaper: null,
      followers: [],
      following: [],
      friends: [],
      liked_content: [],
    },
    other: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      image: null,
      wallpaper: null,
      followers: [],
      following: [],
    },
    singleContent: {
      id: NaN,
      title: "",
      text: "",
      image: null,
      is_private: false,
      author_username: "",
      likes: [],
    },
    getTimelineHold: () => {},
    timeline: [],
    notifications: [],
    modalSwitch: false,
    genericModalSwitch: false,
    notificationsModalSwitch: false,
    messagesModalSwitch: false,
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
    chats: {},
    selectedChat: {},
    currentChatFriend: "",
  },

  mutations: {
    SET_USER(state, receivedUser) {
      state.user = receivedUser;
    },

    SET_USER_AVATAR(state, avatar) {
      state.user.image = avatar;
    },

    SET_USER_WALLPAPER(state, wallpaper) {
      state.user.wallpaper = wallpaper;
    },

    SET_OTHER_WALLPAPER(state, wallpaper) {
      state.other.wallpaper = wallpaper;
    },

    SET_USER_FRIENDS(state, friends) {
      state.user.friends = friends;
    },

    SET_USER_FOLLOWING(state, following) {
      state.user.following = following;
    },

    LOGOUT(state) {
      state.user = {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        token: "",
        image: null,
        wallpaper: null,
        followers: [],
        following: [],
        friends: [],
        liked_content: [],
      };

      state.other = {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        image: null,
        wallpaper: null,
        followers: [],
        following: [],
      };

      router.push("/");
    },

    SET_OTHER(state, receivedOther) {
      state.other = receivedOther;
    },

    SET_OTHER_COPYING_USER(state) {
      state.other = {
        username: state.user.username,
        first_name: state.user.first_name,
        last_name: state.user.last_name,
        email: state.user.email,
        image: state.user.image,
        wallpaper: state.user.wallpaper,
        followers: state.user.followers,
        following: state.user.following,
      };
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

    SET_SINGLE_CONTENT(state, content) {
      state.singleContent = {
        id: content.id,
        title: content.title,
        text: content.text,
        image: content.image,
        is_private: content.is_private,
        author_username: content.author_username,
        likes: content.likes,
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

    SET_NOTIFICATIONS(state) {
      const config = {
        headers: {
          Authorization: `Token ${state.user.token}`,
        },
      };

      axios
        .get(
          "http://ec2-18-221-25-255.us-east-2.compute.amazonaws.com/api/notifications/",
          config
        )
        .then((response) => response.data)
        .then((data) => {
          state.notifications = data.notifications;
        });
    },

    SET_LIKE_NOTIFICATION(state, target_username_and_content_id_array) {
      const config = {
        headers: {
          Authorization: `Token ${state.user.token}`,
        },
      };

      const like_data = {
        of_type: "liked",
        message: `${state.user.username} liked your post!`,
        user_username: target_username_and_content_id_array[0],
        content_id: target_username_and_content_id_array[1],
      };

      axios
        .post(
          "http://ec2-18-221-25-255.us-east-2.compute.amazonaws.com/api/notifications/",
          like_data,
          config
        )
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
        });
    },

    SET_COMMENT_NOTIFICATION(state, target_username_and_content_id_array) {
      const config = {
        headers: {
          Authorization: `Token ${state.user.token}`,
        },
      };

      const comment_data = {
        of_type: "commented",
        message: `${state.user.username} commented your post!`,
        user_username: target_username_and_content_id_array[0],
        content_id: target_username_and_content_id_array[1],
      };

      axios
        .post(
          "http://ec2-18-221-25-255.us-east-2.compute.amazonaws.com/api/notifications/",
          comment_data,
          config
        )
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
        });
    },

    SET_NOTIFICATION_SEEN(state, notification_id) {
      const config = {
        headers: {
          Authorization: `Token ${state.user.token}`,
        },
      };

      axios
        .put(
          `http://ec2-18-221-25-255.us-east-2.compute.amazonaws.com/api/notifications/${notification_id}/`,
          {},
          config
        )
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
        });
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

    UNSET_ANY_MODAL_SWITCH(state) {
      state.modalSwitch = false;
      state.genericModalSwitch = false;
      state.notificationsModalSwitch = false;
      state.messagesModalSwitch = false;
    },

    SET_GENERIC_MODAL_SWITCH(state) {
      state.genericModalSwitch = !state.genericModalSwitch;
    },

    SET_NOTIFICATIONS_MODAL_SWITCH(state) {
      state.notificationsModalSwitch = !state.notificationsModalSwitch;
    },

    SET_MESSAGES_MODAL_SWITCH(state) {
      state.messagesModalSwitch = !state.messagesModalSwitch;
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

    UNSET_CREATION(state) {
      state.creation = {
        uploadText: false,
        uploadImage: false,
        content: {
          id: NaN,
          title: "",
          text: "",
          image: null,
          is_private: false,
        },
      };
    },

    SET_GET_TIMELINE_HOLD(state, getTimeline) {
      state.getTimelineHold = getTimeline;
    },

    SET_CHATS(state, chats_messages) {
      state.chats = chats_messages;
    },

    SET_SELECTED_CHAT(state, selected_chat) {
      state.selectedChat = selected_chat;
    },

    SET_CURRENT_CHAT_FRIEND(state, friend_username) {
      state.currentChatFriend = friend_username;
    },

    SET_NEW_MESSAGE(state, new_message) {
      const author = new_message.author_username;
      const target = new_message.target_username;

      if (state.chats[target]) {
        state.chats[target].results.push(new_message);
      } else if (state.chats[author]) {
        state.chats[author].results.push(new_message);
      }
    },
  },

  actions: {
    setUser({ commit }, receivedUser) {
      commit("SET_USER", receivedUser);
    },

    setUserAvatar({ commit }, avatar) {
      commit("SET_USER_AVATAR", avatar);
    },

    setUserWallpaper({ commit }, wallpaper) {
      commit("SET_USER_WALLPAPER", wallpaper);
    },

    setOtherWallpaper({ commit }, wallpaper) {
      commit("SET_OTHER_WALLPAPER", wallpaper);
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

    setOtherCopyingUser({ commit }) {
      commit("SET_OTHER_COPYING_USER");
    },

    unsetOther({ commit }) {
      commit("UNSET_OTHER");
    },

    setSingleContent({ commit }, content) {
      commit("SET_SINGLE_CONTENT", content);
    },

    setTimeline({ commit }, contents) {
      commit("SET_TIMELINE", contents);
    },

    unsetTimeline({ commit }) {
      commit("UNSET_TIMELINE");
    },

    setNotifications({ commit }) {
      commit("SET_NOTIFICATIONS");
    },

    setLikeNotification({ commit }, target_username_and_content_id_array) {
      commit("SET_LIKE_NOTIFICATION", target_username_and_content_id_array);
    },

    setCommentNotification({ commit }, target_username_and_content_id_array) {
      commit("SET_COMMENT_NOTIFICATION", target_username_and_content_id_array);
    },

    setNotificationSeen({ commit }, notification_id) {
      commit("SET_NOTIFICATION_SEEN", notification_id);
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

    unsetAnyModalSwitch({ commit }) {
      commit("UNSET_ANY_MODAL_SWITCH");
    },

    setGenericModalSwitch({ commit }) {
      commit("SET_GENERIC_MODAL_SWITCH");
    },

    setNotificationsModalSwitch({ commit }) {
      commit("SET_NOTIFICATIONS_MODAL_SWITCH");
    },

    setMessagesModalSwitch({ commit }) {
      commit("SET_MESSAGES_MODAL_SWITCH");
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

    unsetCreation({ commit }) {
      commit("UNSET_CREATION");
    },

    setGetTimelineHold({ commit }, getTimeline) {
      commit("SET_GET_TIMELINE_HOLD", getTimeline);
    },

    setChats({ commit }, chatsMessages) {
      commit("SET_CHATS", chatsMessages);
    },

    setSelectedChat({ commit }, selectedChat) {
      commit("SET_SELECTED_CHAT", selectedChat);
    },

    setCurrentChatFriend({ commit }, friendUsername) {
      commit("SET_CURRENT_CHAT_FRIEND", friendUsername);
    },

    setNewMessage({ commit }, newMessage) {
      commit("SET_NEW_MESSAGE", newMessage);
    },
  },

  modules: {},
});
