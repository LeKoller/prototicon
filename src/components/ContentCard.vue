<template>
  <div
    class="card"
    v-for="content in store.state.timeline"
    :key="content.id"
    :content="content"
  >
    <div v-if="content.title !== ''">
      <h3 class="title">{{ content.title }}</h3>
      <div class="main_content">
        <img
          v-if="content.image !== null"
          class="content_image"
          :src="`http://0.0.0.0:8000${content.image}/`"
        />
        <div class="text_content">
          <p>{{ content.text }}</p>
          <div class="comments">
            <div
              class="recorded_comments"
              v-for="comment in getComments(content.id)"
              :key="comment.id"
            >
              <p>{{ getComments(content.id).author_username }}</p>
            </div>
            <form @submit.prevent="">
              <textarea
                class="comment_field"
                name=""
                id=""
                cols="30"
                rows="2"
              ></textarea>
            </form>
          </div>
        </div>
      </div>
      <button
        class="delete_buttton"
        v-if="store.state.user.username === content.author_username"
        @click="deleteContent(content.id, timelineResetIndex)"
      >
        delete
      </button>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";
import store from "@/store";
import { deleteContent, config } from "../helper.js";
import axios from "axios";

export default {
  name: "ContentCard",
  setup(props) {
    const { timelineResetIndex } = toRefs(props);
    const state = reactive({
      comments: [],
    });

    async function getComments(content_id) {
      return await axios
        .get(`http://0.0.0.0:8000/api/comments/${content_id}/`, config)
        .then((response) => response.data)
        .then((data) => data);
    }

    // onBeforeMount(() => {
    //   getComments();
    // });

    return {
      store,
      state,
      deleteContent,
      timelineResetIndex,
      getComments,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  background-color: #d3dce6;
  margin: 20px 30px 20px 30px;
  border-radius: 8px;
  position: relative;
  padding-bottom: 10px;

  .title {
    padding-top: 30px;
    color: slategrey;
  }

  .main_content {
    display: flex;
    padding: 30px;
    margin: 20px;
    background: slategrey;
    border-radius: 8px;
    justify-content: center;

    .content_image {
      max-width: 30vw;
    }

    .text_content {
      background-color: rgb(47, 54, 61);
      color: #d3dce6;
      padding: 10px 60px 10px 60px;
      text-align: start;

      .comment_field {
        width: 100%;
      }
    }
  }

  .delete_buttton {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: slategrey;
    color: #d3dce6;
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
      color: #ff817e;
      transform: scale(1.1, 1.1);
    }

    &:active {
      transform: scale(0.8, 0.8);
    }
  }
}
</style>
