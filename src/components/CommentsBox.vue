<template>
  <div
    class="comments_wrapper"
    v-for="comment in state.comments"
    :key="comment.id"
  >
    <transition class="animate__animated animate__bounceIn">
      <div class="comment_case" :key="resetIndex">
        <h5 class="comment_author">{{ comment.author_username }}:</h5>
        <p class="comment_text">{{ comment.text }}</p>
      </div>
    </transition>
  </div>
  <form @submit.prevent="postComment">
    <div class="field_and_button">
      <textarea class="comment_field" rows="2" v-model="state.text"></textarea>
      <button class="send_button">
        <span class="material-icons">
          speaker_notes
        </span>
      </button>
    </div>
  </form>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import axios from "axios";
import { onBeforeMount } from "@vue/runtime-core";
import store from "@/store";

export default {
  name: "CommentsBox",
  props: {
    content_id: Number,
  },
  setup(props) {
    const state = reactive({
      comments: [],
      text: "",
    });

    const resetIndex = ref(0);
    const config = {
      headers: {
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    async function getComments() {
      const comments = await axios
        .get(`http://0.0.0.0:8000/api/comments/${props.content_id}/`, config)
        .then((response) => response.data)
        .then((data) => data.comments);

      state.comments = comments;
    }

    async function postComment() {
      if (state.text !== "") {
        await axios
          .post(
            "http://0.0.0.0:8000/api/comments/",
            {
              text: state.text,
              content_id: props.content_id,
            },
            config
          )
          .then((response) => response.data)
          .then((data) => {
            state.comments.push(data);
          });
      }
    }

    onBeforeMount(() => {
      getComments(props.content_id);
    });

    return {
      props,
      state,
      resetIndex,
      getComments,
      postComment,
    };
  },
};
</script>

<style lang="scss" scoped>
.comments_wrapper {
  .comment_case {
    display: flex;
    background-color: rgb(28, 32, 37);
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 4px;

    .comment_author {
      margin: 0;
      margin-right: 8px;
    }

    .comment_text {
      margin: 0;
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
</style>
