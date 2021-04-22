<template>
  <img
    v-if="wallpaper !== null"
    class="wallpaper"
    :src="`${wallpaper}`"
    alt="wallpaper"
  />
  <div class="container">
    <transition class="animate__animated animate__fadeInLeft animate__delay-1s">
      <div class="aside">
        <div class="avatar_case">
          <img
            class="profile_picture"
            src="../assets/default_user_avatar.png"
            alt="Profile pricture"
            v-if="store.state.other.image === null"
          />
          <img
            class="profile_picture"
            :src="`${store.state.other.image}`"
            alt="Profile pricture"
            v-else
          />
        </div>

        <div class="follow_case" v-if="!isThisMyProfile">
          <button
            class="follow_button is_following"
            v-if="isFollowing"
            @click="follow"
          >
            following
          </button>
          <button class="follow_button" v-else @click="follow">follow</button>
        </div>

        <div class="user_status">
          <h4>
            <span class="material-icons status_icons">
              volunteer_activism
            </span>
            <a href="">Followers</a>:
            <span class="status_data">{{ followers }}</span>
          </h4>
          <h4>
            <span class="material-icons status_icons">
              follow_the_signs
            </span>
            <a href="">Following</a>:
            <Following class="status_data">{{ following }}</Following>
          </h4>
        </div>
      </div>
    </transition>

    <transition class="animate__animated animate__fadeInRight">
      <div class="creation_area">
        <h3>this is {{ store.state.other.username }}!</h3>
        <div>
          <h3 class="data_fields">name</h3>
          <h4>
            {{ store.state.other.first_name }} {{ store.state.other.last_name }}
          </h4>
        </div>
        <div>
          <h3 class="data_fields">email</h3>
          <h4>
            {{ store.state.other.email }}
          </h4>
        </div>
      </div>
    </transition>

    <transition class="animate__animated animate__fadeInUp">
      <div class="timeline">
        <transition class="animate__animated animate__bounceIn">
          <div>
            <ContentCard
              v-for="content in timeline"
              :key="content.id"
              :content="content"
            />
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed } from "vue";
import store from "../store";
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import ContentCard from "../components/ContentCard";
import axios from "axios";

export default {
  name: "Profile",
  components: {
    ContentCard,
  },
  setup() {
    const isFollowing = computed(() => {
      let output = false;

      store.state.user.following.forEach((user) => {
        if (store.state.other.username === user.username) {
          output = true;
        }
      });

      return output;
    });
    const timeline = computed(() => store.state.timeline);

    const isThisMyProfile = computed(
      () => store.state.other.username === store.state.user.username
    );
    const followers = computed(() => store.state.other.followers.length);
    const following = computed(() => store.state.other.following.length);
    const wallpaper = computed(() => store.state.other.wallpaper);

    const config = {
      headers: {
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    async function follow() {
      await axios
        .post(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/follow/${store.state.other.username}/`,
          {},
          config
        )
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserFollowing", data.following);
        });

      updateOther();
    }

    function loadOtherWallpaper() {
      axios
        .get(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/accounts/${store.state.user.username}/`
        )
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserWallpaper", data.wallpaper);
        });
    }

    function loadUserProfileIfNoOtherSetted() {
      if (store.state.other.username === "") {
        store.dispatch("setOtherCopyingUser");
      }
    }

    async function getOtherFeed() {
      const contents = await axios
        .get(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/contents/?author=${store.state.other.username}`,
          config
        )
        .then((response) => response.data)
        .then((data) => data.results);

      store.dispatch("unsetTimeline");
      store.dispatch("setTimeline", contents);
    }

    async function updateOther() {
      const other = await axios
        .get(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/accounts/${store.state.other.username}/`,
          config
        )
        .then((response) => response.data)
        .then((data) => data);

      store.dispatch("setOther", other);
    }

    onBeforeMount(() => {
      loadUserProfileIfNoOtherSetted();
      getOtherFeed();
    });
    onMounted(loadOtherWallpaper);

    return {
      store,
      isFollowing,
      timeline,
      isThisMyProfile,
      followers,
      following,
      wallpaper,
      follow,
      ContentCard,
    };
  },
};
</script>

<style lang="scss" scoped>
.wallpaper {
  position: fixed;
  left: 0;
  top: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  max-width: 100%;
  min-height: 100vh;
  z-index: 0;
}

.container {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: minmax(min-content, 45px) 1fr 18px; /* this is just magic *-* */
  grid-template-areas: "aside creation" "aside timeline";
  margin: 12px;

  .follow_case {
    margin-top: 10px;
    margin-bottom: 10px;

    .follow_button {
      width: 16vw;
    }

    .is_following {
      background-color: slategrey;
    }
  }

  .error_message {
    color: #ff817e;
  }

  input,
  textarea {
    border-radius: 8px;
    padding: 0.2rem;
    padding-left: 10px;
    padding-right: 10px;
    outline: none;
    color: steelblue;
    margin-bottom: 16px;
  }

  .aside {
    min-height: 86vh;
    max-height: fit-content;
    grid-area: aside;
    backdrop-filter: blur(8px);
    background-color: rgba($color: #043156, $alpha: 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
      width: 14vw;
      margin-top: 0.8rem;
    }
    input::-webkit-file-upload-button {
      outline: none;
      border: none;
      border-radius: 8px;
      padding: 4px;
      background-color: steelblue;
      color: #d3dce6;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        color: #73e3e7;
      }

      &:active {
        transform: scale(0.8, 0.8);
      }
    }

    button {
      outline: none;
      border: none;
      border-radius: 8px;
      padding: 4px;
      background-color: #4bb6ff;
      color: #d3dce6;
      font-family: "Fredoka One", cursive;
      font-weight: normal;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        color: #d3dce6;
        transform: scale(1.05, 1.05);
      }

      &:active {
        transform: scale(0.8, 0.8);
      }
    }

    .profile_picture {
      object-fit: cover;
      object-position: center;
      width: 16vw;
      height: 16vw;
      overflow: hidden;
      margin-top: 20px;
      border: 1px solid #091d2e;
      background-color: #091d2e;
      border-radius: 8px;
    }

    .status_icons {
      position: relative;
      font-size: 1.2rem;
      top: 0.2rem;
      margin-right: 10px;
      color: #b08cfa;
    }

    .user_status {
      margin: 12px;
      backdrop-filter: brightness(70%);
      width: 16vw;
      border-radius: 8px;
      padding-top: 8px;
      padding-bottom: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      h4 {
        color: slategrey;
        margin: 0.2rem;
        font-weight: normal;
        text-align: start;

        a {
          text-decoration: none;
          transition: all 0.25s ease;

          &:hover {
            color: #4bb6ff;
            text-shadow: 0 0 24px #4bb6ff;
          }
        }

        .status_data {
          color: #78f280;
        }
      }
    }
  }

  .creation_area {
    height: fit-content;
    grid-area: creation;
    backdrop-filter: blur(8px);
    background-color: rgba($color: #b08cfa, $alpha: 0.7);
    display: flex;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 48px;

    h3 {
      color: #d3dce6;
      font-family: "Fredoka One", cursive;
      font-weight: normal;
      margin-top: 6px;
    }

    .data_fields {
      color: #043156;
    }

    h4 {
      color: #d3dce6;
    }

    form {
      display: flex;
      flex-direction: column;

      textarea {
        width: 72vw;
        resize: none;
      }

      .image_field {
        width: 62vw;
      }
      .image_field::-webkit-file-upload-button {
        outline: none;
        border: none;
        border-radius: 8px;
        padding: 4px;
        background-color: steelblue;
        color: #d3dce6;
        cursor: pointer;
        transition: all 0.25s ease;

        &:hover {
          color: #73e3e7;
        }

        &:active {
          transform: scale(0.8, 0.8);
        }
      }

      .title_and_buttons {
        display: flex;
        justify-content: space-between;

        input {
          margin-right: 8px;
          width: 62vw;
        }

        .submit_button {
          background-color: #4bb6ff;
          color: #d3dce6;
          font-family: "Fredoka One", cursive;
          font-weight: normal;
          font-size: 1.2rem;

          &:hover {
            color: #d3dce6;
          }
        }

        button {
          outline: none;
          border: none;
          border-radius: 8px;
          background-color: transparent;
          color: #d3dce6;
          padding: 4px 12px 4px 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-bottom: 12px;

          &:hover {
            transform: scale(1.05, 1.05);
            text-shadow: 0 0 24px #73e3e7;
            color: #73e3e7;
          }

          &:active {
            transform: scale(0.8, 0.8);
          }

          &:disabled {
            color: dimgray;
            transform: scale(1, 1);
            cursor: default;
          }
        }
        .private {
          color: #b08cfa;
          text-shadow: 0 0 24px #b08cfa;
        }
      }
    }
  }

  .timeline {
    height: fit-content;
    grid-area: timeline;
    min-height: fit-content;
    padding-bottom: 30px;
    backdrop-filter: blur(8px);
    background-color: rgba($color: slategrey, $alpha: 0.5);
  }
}
</style>
