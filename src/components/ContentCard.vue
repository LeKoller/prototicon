<template>
  <div
    class="card"
    v-for="content in store.state.timeline"
    :key="content.id"
    :content="content"
  >
    <div v-if="content.title !== ''">
      <div class="header">
        <div class="author_case">
          <h4>
            author:
            <a href="">{{ content.author_username }}</a>
          </h4>
        </div>
        <h3 class="title">{{ content.title }}</h3>
      </div>
      <div class="main_content">
        <img
          v-if="content.image !== null"
          class="content_image"
          :src="`http://0.0.0.0:8000${content.image}/`"
        />
        <div class="text_content">
          <p>{{ content.text }}</p>
          <CommentsBox :content_id="content.id" />
        </div>
      </div>
      <button
        class="delete_buttton"
        v-if="store.state.user.username === content.author_username"
        @click="deleteContent(content.id)"
      >
        delete
      </button>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { deleteContent } from "../helper.js";
import CommentsBox from "./CommentsBox";

export default {
  name: "ContentCard",
  components: {
    CommentsBox,
  },
  props: {
    timelineResetIndex: Number,
  },
  setup(props) {
    const config = {
      headers: {
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    return {
      store,
      deleteContent,
      props,
      config,
      CommentsBox,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  background-color: rgba($color: #fff, $alpha: 0.8);
  margin: 20px 30px 20px 30px;
  border-radius: 8px;
  position: relative;
  padding-bottom: 10px;

  .header {
    display: flex;
    justify-content: center;
    position: relative;

    .author_case {
      position: absolute;
      left: 20px;
      color: rgb(182, 198, 214);

      a {
        color: #b08cfa;
        text-decoration: none;
        transition: all 0.25s ease;

        &:hover {
          color: #4bb6ff;
        }
      }
    }

    .title {
      color: slategrey;
    }
  }

  .main_content {
    display: flex;
    padding: 30px;
    margin: 20px;
    background: slategrey;
    border-radius: 8px;
    justify-content: center;

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
      background: #312942;
    }

    .content_image {
      max-height: 60vh;
    }

    .text_content {
      overflow: auto;
      max-height: 60vh;
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
