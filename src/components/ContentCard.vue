<template>
  <div class="card">
    <div v-if="props.content.title !== ''">
      <div class="header">
        <div class="author_case">
          <h4>
            author:
            <a @click="loadOtherUser(props.content.author_username)">{{
              props.content.author_username
            }}</a>
          </h4>
        </div>
        <h3 class="title">{{ props.content.title }}</h3>
      </div>
      <div class="main_content">
        <div class="inbetween">
          <img
            v-if="props.content.image !== null"
            class="content_image"
            :src="`${props.content.image}`"
          />
          <div class="text_content">
            <p>{{ props.content.text }}</p>
            <div>
              <CommentsBox :content="content" />
            </div>
          </div>
        </div>
      </div>
      <div class="like_or_edit_delete_butttons">
        <div v-if="store.state.user.username === props.content.author_username">
          <button
            class="delete_buttton"
            @click="deleteContent(props.content.id)"
          >
            <span class="material-icons">
              delete_outline
            </span>
          </button>
          <button class="edit_button" @click="showEditionModal(props.content)">
            edit
          </button>
        </div>
        <div class="not_your_post" v-else>
          <button
            class="like_button"
            @click="
              likeContent(props.content.author_username, props.content.id)
            "
          >
            <div>
              <span class="likes_count">{{
                props.content.likes.length + state.realTimeLike
              }}</span>
              <span
                class="material-icons heart_icon"
                :class="{ liked: state.isLiked[props.content.id] }"
              >
                favorite
              </span>
            </div>
          </button>
        </div>
        <Modal v-if="store.state.modalSwitch" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, computed } from "vue";
import store from "../store";
import CommentsBox from "./CommentsBox";
import axios from "axios";
import router from "../router/index.js";

export default {
  name: "ContentCard",
  components: {
    CommentsBox,
  },
  props: {
    content: Object,
  },
  setup(props) {
    const state = reactive({
      isLiked: {},
      realTimeLike: 0,
    });

    const getTimeline = computed(() => store.state.getTimelineHold);

    const config = {
      headers: {
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    async function loadOtherUser(username) {
      await axios
        .get(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/accounts/${username}/`,
          config
        )
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setOther", data);
        });

      router.push("/profile");
    }

    function updateUserLikes() {
      axios
        .get(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/accounts/${store.state.user.username}/`
        )
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserLikes", data.liked_content);
        });
    }

    async function likeContent(target_username, content_id) {
      await axios
        .post(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/contents/like/${content_id}/`,
          {},
          config
        )
        .then((response) => {
          console.log(response.status);
          return response.data;
        })
        .then((data) => data);

      updateUserLikes();

      if (state.isLiked[content_id]) {
        state.realTimeLike = 0;
      } else {
        state.realTimeLike = 1;

        store.dispatch("setLikeNotification", [target_username, content_id]);
      }

      state.isLiked[content_id] = !state.isLiked[content_id];
    }

    function isContentLiked() {
      const idsList = store.state.timeline.map((content) => content.id);
      const likedIds = store.state.user.liked_content.map(
        (content) => content.id
      );

      idsList.forEach((id) => {
        if (likedIds.includes(id)) {
          state.isLiked[id] = true;
        } else {
          state.isLiked[id] = false;
        }
      });
    }

    async function deleteContent(content_id) {
      await axios
        .delete(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/contents/${content_id}/`,
          config
        )
        .then((response) => response.data)
        .then((data) => data);

      getTimeline.value();
    }

    function showEditionModal(content) {
      store.dispatch("setCreationId", content.id);
      store.dispatch("setCreationFields", content);
      store.dispatch("setModalSwitch");
    }

    onMounted(() => {
      isContentLiked();
      state.realTimeLike = 0;
    });

    return {
      props,
      store,
      state,
      deleteContent,
      config,
      loadOtherUser,
      CommentsBox,
      isContentLiked,
      likeContent,
      showEditionModal,
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
        cursor: pointer;

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
      background: #093156;
    }

    .content_image {
      max-width: 40vw;
      height: fit-content;
      align-self: center;
    }

    .inbetween {
      display: flex;
      padding: 0;
      margin: 0;
      background: rgb(25, 29, 32);
      justify-content: center;
      width: 100%;
    }

    .text_content {
      overflow: auto;
      width: 100%;
      background-color: rgb(47, 54, 61);
      color: #d3dce6;
      padding: 10px 30px 10px 30px;
      text-align: start;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      p {
        margin: 16px 30px;
      }

      .comment_field {
        width: 100%;
      }
    }
  }

  .like_or_edit_delete_butttons {
    position: absolute;
    top: 20px;
    right: 20px;

    button {
      font-family: "Fredoka One", cursive;
      font-weight: normal;
      font-size: 1rem;
      background-color: slategrey;
      color: #d3dce6;
      outline: none;
      border: none;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .not_your_post {
      display: flex;

      .like_button {
        background-color: transparent;

        &:hover {
          color: #b08cfa;
          transform: scale(1.1, 1.1);
        }

        &:active {
          transform: scale(0.8, 0.8);
        }

        .likes_count {
          position: relative;
          bottom: 3px;
          right: 3px;
          font-size: 1.6rem;
          font-family: "Nunito";
          color: slategrey;
        }

        .heart_icon {
          position: relative;
          color: slategrey;
          margin-right: 4px;
          font-size: 2rem;
          top: 4px;
        }

        .liked {
          color: #b08cfa;
          text-shadow: 0 0 16px #b08cfa;
        }
      }
    }

    .delete_buttton {
      position: relative;
      top: 6px;
      right: 16px;
      font-size: 1rem;
      padding: 0;
      background-color: transparent;
      color: slategray;
      transform: scale(1.3, 1.3);

      &:hover {
        color: #ff817e;
        transform: scale(1.5, 1.5);
      }

      &:active {
        transform: scale(0.8, 0.8);
      }
    }

    .edit_button {
      margin-right: 8px;

      &:hover {
        color: #4bb6ff;
        transform: scale(1.1, 1.1);
      }

      &:active {
        transform: scale(0.8, 0.8);
      }
    }
  }
}
</style>
