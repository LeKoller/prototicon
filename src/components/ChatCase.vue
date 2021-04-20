<template>
  <div class="chat_case">
    <div v-if="chat">
      <div
        class="message_case"
        v-for="message in chat.results"
        :key="message.id"
      >
        <span class="message_text">{{ message.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import store from "../store";

export default {
  name: "ChatCase",
  setup() {
    const chat = computed(() => store.state.selectedChat);

    return chat;
  },
};
</script>
