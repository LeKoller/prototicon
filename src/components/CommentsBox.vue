<template>
  <div
    class="comments_wrapper"
    v-for="comment in state.comments"
    :key="comment.id"
  >
    <transition class="animate__animated animate__bounceIn">
      <div class="comment_case">
        <h5 class="comment_author">{{ comment.author_username }}:</h5>
        <p class="comment_text">{{ comment.text }}</p>
        <button class="delete_button" @click="deleteComment(comment)">
          <span class="material-icons">
            delete_outline
          </span>
        </button>
        <span class="error_message" v-if="state.failedDelete[comment.id]"
          >it's not your comment to delete</span
        >
      </div>
    </transition>
  </div>
  <form @submit.prevent="postComment">
    <div class="field_and_button">
      <textarea
        class="comment_field"
        rows="2"
        v-model="state.text"
        @keydown.enter="postComment"
      ></textarea>
      <button class="send_button">
        <span class="material-icons">
          speaker_notes
        </span>
      </button>
    </div>
  </form>
</template>

<script>
import { reactive, computed } from "@vue/reactivity";
import axios from "axios";
import { onBeforeMount } from "@vue/runtime-core";
import store from "../store";

export default {
  name: "CommentsBox",
  props: {
    content: Object,
  },
  setup(props) {
    const content_author = computed(() => props.content.author_username);
    const content_id = computed(() => props.content.id);

    const state = reactive({
      comments: [],
      text: "",
      failedDelete: {},
    });

    const config = {
      headers: {
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    async function getComments() {
      const comments = await axios
        .get(`http://0.0.0.0:8000/api/comments/${content_id.value}/`, config)
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
              content_id: content_id.value,
            },
            config
          )
          .then((response) => response.data)
          .then((data) => {
            state.comments.push(data);
          });

        state.text = "";
      }

      if (content_author.value !== store.state.user.username) {
        store.dispatch("setCommentNotification", [
          content_author.value,
          content_id.value,
        ]);
      }
    }

    async function deleteComment(comment) {
      await axios
        .delete(
          `http://0.0.0.0:8000/api/comments/delete/${comment.id}/`,
          config
        )
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
        })
        .catch((data) => {
          console.log(data);

          if (state.failedDelete[comment.id]) {
            state.failedDelete[comment.id] = false;
          } else {
            state.failedDelete[comment.id] = true;
          }
        });

      getComments();
    }

    onBeforeMount(() => {
      getComments(content_id.value);
    });

    return {
      props,
      state,
      getComments,
      postComment,
      deleteComment,
    };
  },
};
</script>

<style lang="scss" scoped>
.comments_wrapper {
  .comment_case {
    position: relative;
    display: flex;
    background-color: rgb(28, 32, 37);
    border-radius: 8px;
    padding: 8px;
    padding-right: 30px;
    margin-bottom: 4px;
    flex-wrap: wrap;

    .comment_author {
      margin: 0;
      margin-right: 8px;
      margin-bottom: 2px;
      height: fit-content;
    }

    .comment_text {
      margin: 0;
      position: relative;
      bottom: 2px;
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
</style>
