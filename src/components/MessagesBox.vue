<template>
  <div class="container">
    <div class="chat_selection_case">
      <img
        class="user_avatar_miniature"
        v-for="friend in friends"
        :key="friend.id"
        :src="`http://0.0.0.0:8000${friend.image}/`"
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
      console.log(store.state.selectedChat.results);
    }

    onBeforeMount(() => {
      friends.value.forEach((friend) => {
        if (!friend.image) {
          store.dispatch("setFriendDefaultAvatar", friend.username);
        }
      });
    });

    return {
      chats,
      friends,
      openFriendsChat,
      ChatCase,
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
    }
  }

  .chat_case {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 64vh;
    background-color: rgb(47, 54, 61);
    overflow: auto;

    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-track {
      background: rgb(47, 54, 61);
    }

    ::-webkit-scrollbar-thumb {
      background: rgb(33, 39, 44);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #093156;
    }

    .message_case {
      position: relative;
      display: flex;
      background-color: rgb(28, 32, 37);
      border-radius: 8px;
      padding: 8px;
      padding-right: 30px;
      margin-bottom: 4px;
      flex-wrap: wrap;

      /* .comment_author {
        margin: 0;
        margin-right: 8px;
        margin-top: 2px;
        height: fit-content;
      } */

      .message_text {
        margin: 0;
        position: relative;
      }

      .delete_button {
        position: absolute;
        right: 4px;
        top: 6px;
        outline: none;
        border: none;
        padding: 0;
        background-color: transparent;
        color: slategray;
        opacity: 0;
        cursor: pointer;
        transition: all 0.25s ease;

        &:hover {
          opacity: 1;
        }
      }

      .error_message {
        font-size: 0.6rem;
        color: #ff817e;
        width: 100%;
      }
    }
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
