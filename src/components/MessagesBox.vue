<template>
  <div class="container">
    <div class="chat_selection_case">
      <img
        class="user_avatar_miniature"
        :class="{ selected: isSelected(friend.username) }"
        v-for="friend in friends"
        :key="friend.id"
        :src="
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com${friend.image}/`
        "
        :alt="`${friend.username}`"
        @click="openFriendsChat(friend.username)"
      />
    </div>
    <ChatCase />
  </div>
</template>

<script>
import { computed, onBeforeMount } from "vue";
import store from "../store";
import ChatCase from "./ChatCase";

export default {
  name: "MessagesBox",
  components: {
    ChatCase,
  },
  setup() {
    const chats = computed(() => store.state.chats);
    const friends = computed(() =>
      store.state.user.friends.filter((friend) => {
        return friend.image;
      })
    );

    function openFriendsChat(friendUsername) {
      store.dispatch("setSelectedChat", chats.value[friendUsername]);
      store.dispatch("setCurrentChatFriend", friendUsername);
      store.dispatch("setSendBox", true);

      setTimeout(() => {
        store.dispatch("setScrollDown");
      }, 100);
    }

    function isSelected(username) {
      if (store.state.currentChatFriend === username) {
        return true;
      }

      return false;
    }

    onBeforeMount(() => {
      store.dispatch("setSelectedChat", {});
      store.dispatch("setCurrentChatFriend", "");
      store.dispatch("setSendBox", false);
    });

    return {
      chats,
      friends,
      openFriendsChat,
      ChatCase,
      isSelected,
    };
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .chat_selection_case {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 20px;

    .user_avatar_miniature {
      width: 4vw;
      cursor: pointer;
      margin-right: 8px;
      border-radius: 4px;
      transition: all 0.25s ease;
    }

    .selected {
      transform: scale(1.2, 1.2);
      box-shadow: 5px 5px 5px rgba($color: #000000, $alpha: 0.5);
    }
  }

  .chat_case {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    height: 64vh;
    background-color: rgb(47, 54, 61);
    overflow: auto;
    box-sizing: border-box;
    position: relative;
  }

  .field_and_button {
    display: flex;
    justify-content: space-around;
    padding: 4px;
    background-color: rgb(28, 32, 37);

    .comment_field {
      margin-right: 4px;
      border-radius: 8px;
      padding: 0.2rem;
      padding-left: 10px;
      padding-right: 10px;
      outline: none;
      color: steelblue;
      background-color: #d3dce6;
      resize: none;
      width: 100%;
      height: 2rem;
      margin: 4px;
    }

    .send_button {
      position: relative;
      top: 2px;
      background-color: transparent;
      color: slategrey;
      outline: none;
      border: none;
      border-radius: 8px;
      padding: 8px;
      font-family: "Fredoka One", cursive;
      font-weight: normal;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        color: #73e3e7;
        transform: scale(1.1, 1.1);
        text-shadow: 0 0 16px #73e3e7;
      }

      &:active {
        transform: scale(0.8, 0.8);
      }
    }
  }
}
</style>
