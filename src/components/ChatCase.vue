<template>
  <div class="chat_case">
    <div v-if="chat" class="scrollable">
      <div
        class="message_case"
        v-for="message in chat"
        :key="message.id"
        :class="{ your_message: isYourMessage(message) }"
      >
        <span class="message_text">{{ message.text }}</span>
      </div>
    </div>
    <div class="send_box_case">
      <textarea
        class="send_box"
        name="send_box"
        rows="1"
        v-model="state.message"
      ></textarea>
      <button class="send_button" @click="sendMessage">
        <span class="material-icons" id="send_icon">
          send
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import store from "../store";
import axios from "axios";

export default {
  name: "ChatCase",
  setup() {
    const chat = computed(() => {
      if (store.state.selectedChat.results) {
        return store.state.selectedChat.results.sort((a, b) => {
          if (a.id > b.id) {
            return 1;
          }
          return -1;
        });
      }

      return [];
    });

    const user = computed(() => store.state.user.username);
    const friendUsername = computed(() => store.state.currentChatFriend);

    const state = reactive({
      message: "",
    });

    const config = {
      headers: {
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    function isYourMessage(message) {
      return message.author_username === user.value;
    }

    async function sendMessage() {
      if (state.message) {
        await axios.post(
          "http://ec2-18-221-25-255.us-east-2.compute.amazonaws.com/api/messages/",
          {
            target_username: friendUsername.value,
            text: state.message,
          },
          config
        );

        state.message = "";
      }
    }

    return {
      chat,
      user,
      state,
      isYourMessage,
      sendMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.scrollable {
  overflow: auto;
  padding: 20px;

  ::-webkit-scrollbar {
    width: 16px;
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
}

.send_box_case {
  display: flex;
  justify-content: space-between;
  padding: 0 20px 20px 20px;

  .send_box {
    width: 100%;
    padding: 8px;
    resize: none;
    color: #7842e8;
  }

  .send_button {
    position: relative;
    margin-left: 16px;
    outline: none;
    border: none;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.25s ease;
    color: slategray;

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

.message_case {
  position: relative;
  display: flex;
  background-color: rgb(28, 32, 37);
  border-radius: 8px;
  padding: 8px;
  padding-right: 30px;
  margin-bottom: 4px;
  flex-wrap: wrap;
  width: fit-content;

  /* .comment_author {
        margin: 0;
        margin-right: 8px;
        margin-top: 2px;
        height: fit-content;
      } */

  .message_text {
    margin: 0;
    position: relative;
    color: #d3dce6;
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

.your_message {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  background-color: #7842e8;
}
</style>
