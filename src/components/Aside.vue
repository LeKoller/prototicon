<template>
  <div class="aside">
    <AvatarCase />

    <div class="user_status">
      <h4>
        <span class="material-icons status_icons">
          volunteer_activism
        </span>
        <a href="#" @click="showFollowersGrid">Followers</a>:
        <span class="status_data">{{ store.state.user.followers.length }}</span>
      </h4>
      <h4>
        <span class="material-icons status_icons">
          follow_the_signs
        </span>
        <a href="#">Following</a>:
        <Following class="status_data">{{
          store.state.user.following.length
        }}</Following>
      </h4>
      <div>
        <h4>
          <span class="material-icons status_icons">
            mood
          </span>
          <a href="#" @click="showFriendsGrid">Friends</a>:
          <span class="status_data">{{ store.state.user.friends.length }}</span>
        </h4>
      </div>
    </div>

    <div class="user_search">
      <input
        type="search"
        placeholder="search user"
        v-model="state.search"
        @keydown.enter="searchForUser"
      />
      <button class="search_button" @click="searchForUser">
        <span id="search_users_icon" class="material-icons">
          person_search
        </span>
      </button>
    </div>

    <div class="wallpaper_button_case">
      <button class="wallpaper_button" @click="switchUploadWallpaper">
        change wallpaper
      </button>
      <div v-if="state.wallpaperInputOpened">
        <input type="file" @change="onWallpaperFileSelected" />
        <button class="submit_wallpaper_button" @click="uploadWallpaper">
          submit!
        </button>
      </div>
    </div>
    <span class="error_message" v-show="state.searchFailed"
      >user not found</span
    >
  </div>
</template>

<script>
import { reactive, onBeforeMount } from "vue";
import store from "../store";
import router from "../router";
import axios from "axios";

import AvatarCase from "./AvatarCase";

export default {
  name: "Aside",
  components: {
    AvatarCase,
  },
  setup() {
    const state = reactive({
      wallpaperFile: null,
      search: "",
      searchFailed: false,
      wallpaperInputOpened: false,
      showFollowers: false,
      showFollowing: false,
      showFriends: false,
    });

    const config = {
      headers: {
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    const imageConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    function switchUploadWallpaper() {
      state.wallpaperInputOpened = !state.wallpaperInputOpened;
    }

    async function uploadWallpaper() {
      if (state.wallpaperFile !== null) {
        const fd = new FormData();
        fd.append("image", state.wallpaperFile, state.wallpaperFile.name);

        await axios
          .post(
            "http://ec2-177-71-148-166.sa-east-1.compute.amazonaws.com/api/accounts/wallpaper/",
            fd,
            imageConfig
          )
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
          });

        switchUploadWallpaper();
        loadUserWallpaper();
        state.wallpaperFile = null;
      }
    }

    function onWallpaperFileSelected(event) {
      state.wallpaperFile = event.target.files[0];
    }

    function loadUserWallpaper() {
      axios
        .get(
          `http://ec2-177-71-148-166.sa-east-1.compute.amazonaws.com/api/accounts/${store.state.user.username}/`
        )
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserWallpaper", data.wallpaper);
        });
    }

    async function loadUserFriends() {
      await axios
        .get(
          "http://ec2-177-71-148-166.sa-east-1.compute.amazonaws.com/api/follow/",
          config
        )
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserFriends", data.friends);
        });
    }

    async function searchForUser() {
      await axios
        .get(
          `http://ec2-177-71-148-166.sa-east-1.compute.amazonaws.com/api/accounts/${state.search}/`,
          config
        )
        .then((response) => response.data)
        .then((data) => {
          state.searchFailed = false;
          store.dispatch("setOther", data);
          router.push("/profile");
        })
        .catch(() => {
          state.searchFailed = true;
        });
    }

    function showFollowersGrid() {
      store.dispatch("setGenericModalSwitch");
    }

    function showFriendsGrid() {
      state.showFriends = !state.showFriends;
    }

    onBeforeMount(() => {
      loadUserWallpaper();
      loadUserFriends();
    });

    return {
      store,
      state,
      switchUploadWallpaper,
      uploadWallpaper,
      onWallpaperFileSelected,
      loadUserFriends,
      searchForUser,
      showFollowersGrid,
      showFriendsGrid,
    };
  },
};
</script>

<style lang="scss">
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
    cursor: pointer;
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

  .user_status,
  .user_search,
  .wallpaper_button_case {
    margin: 12px;
    backdrop-filter: brightness(80%);
    width: 16vw;
    border-radius: 8px;
    padding-top: 8px;
    padding-bottom: 8px;

    h4 {
      color: slategrey;
      margin: 0.2rem;
      font-weight: normal;
      text-align: start;
      margin-left: 20px;

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

  .user_search {
    display: flex;
    padding-top: 20px;

    .search_button {
      margin-left: 16px;
      outline: none;
      border: none;
      border-radius: 8px;
      padding: 4px;
      background-color: transparent;
      color: slategrey;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
      right: 8px;
      top: 4px;

      &:hover {
        transform: scale(1.05, 1.05);
        text-shadow: 0 0 24px #4bb6ff;
        color: #4bb6ff;
      }

      &:active {
        transform: scale(0.8, 0.8);
      }

      #search_users_icon {
        position: relative;
        bottom: 0.4rem;
        right: 0.2rem;
      }
    }

    input {
      margin-left: 20px;
      width: 11vw;
    }
  }
}
</style>
