<template>
  <img
    v-if="wallpaper !== null"
    class="wallpaper"
    :src="`${wallpaper}`"
    alt="wallpaper"
  />
  <div class="container">
    <transition class="animate__animated animate__fadeInLeft animate__delay-1s">
      <div class="aside" :key="asideResetIndex">
        <div class="avatar_case">
          <img
            class="profile_picture"
            src="../assets/default_user_avatar.png"
            alt="Profile pricture"
            v-if="store.state.user.image === null"
            @click="switchUploadAvatar"
          />
          <img
            class="profile_picture"
            :src="`${store.state.user.image}`"
            alt="Profile pricture"
            v-else
            @click="switchUploadAvatar"
          />
        </div>

        <div class="upload_avatar_case" v-show="state.uploadAvatarInputShow">
          <input type="file" @change="onAvatarFileSelected" />
          <button @click="uploadAvatar">change picture</button>
        </div>

        <div class="user_status">
          <h4>
            <span class="material-icons status_icons">
              volunteer_activism
            </span>
            <a href="#" @click="showFollowersGrid">Followers</a>:
            <span class="status_data">{{
              store.state.user.followers.length
            }}</span>
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
              <span class="status_data">{{
                store.state.user.friends.length
              }}</span>
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
    </transition>

    <transition class="animate__animated animate__fadeInRight">
      <CreationArea />
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
  <GenericModal type="FollowersGrid" v-if="store.state.genericModalSwitch" />
</template>

<script>
import store from "../store";
import { onBeforeMount, onMounted, reactive, ref, computed } from "vue";
import axios from "axios";
import ContentCard from "../components/ContentCard";
import CreationArea from "../components/CreationArea";
import GenericModal from "../components/GenericModal";
import router from "../router";

export default {
  name: "Dashboard",
  components: {
    CreationArea,
    ContentCard,
    GenericModal,
  },
  setup() {
    const state = reactive({
      uploadAvatarInputShow: false,
      avatarFile: null,
      wallpaperFile: null,
      search: "",
      searchFailed: false,
      wallpaperInputOpened: false,
      showFollowers: false,
      showFollowing: false,
      showFriends: false,
    });

    const wallpaper = computed(() => store.state.user.wallpaper);
    const timeline = computed(() => store.state.timeline);

    const asideResetIndex = ref(0);

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

    function getFollowingUsernames() {
      return store.state.user.following.map((user) => user.username);
    }

    async function getTimeline() {
      const usernames = getFollowingUsernames();
      let contents = [];

      usernames.push(store.state.user.username);

      for (let username of usernames) {
        await axios
          .get(`http://0.0.0.0:8000/api/contents/?author=${username}`, config)
          .then((response) => response.data)
          .then((data) => {
            contents = [...contents, ...data.results];
          });

        store.dispatch("unsetTimeline");
        store.dispatch("setTimeline", contents);
      }
    }

    function switchUploadAvatar() {
      state.uploadAvatarInputShow = !state.uploadAvatarInputShow;
    }

    function switchUploadWallpaper() {
      state.wallpaperInputOpened = !state.wallpaperInputOpened;
    }

    async function uploadAvatar() {
      if (state.avatarFile !== null) {
        const fd = new FormData();
        fd.append("image", state.avatarFile, state.avatarFile.name);

        await axios
          .post("http://0.0.0.0:8000/api/accounts/avatar/", fd, imageConfig)
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
          });

        switchUploadAvatar();
        loadUserAvatar();
        asideResetIndex.value++;
        state.avatarFile = null;
      }
    }

    async function uploadWallpaper() {
      if (state.wallpaperFile !== null) {
        const fd = new FormData();
        fd.append("image", state.wallpaperFile, state.wallpaperFile.name);

        await axios
          .post("http://0.0.0.0:8000/api/accounts/wallpaper/", fd, imageConfig)
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
          });

        switchUploadWallpaper();
        loadUserWallpaper();
        state.wallpaperFile = null;
      }
    }

    function onAvatarFileSelected(event) {
      state.avatarFile = event.target.files[0];
    }

    function onWallpaperFileSelected(event) {
      state.wallpaperFile = event.target.files[0];
    }

    function loadUserAvatar() {
      axios
        .get(`http://0.0.0.0:8000/api/accounts/${store.state.user.username}/`)
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserAvatar", data.image);
        });
    }

    function loadUserWallpaper() {
      axios
        .get(`http://0.0.0.0:8000/api/accounts/${store.state.user.username}/`)
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserWallpaper", data.wallpaper);
        });
    }

    async function loadUserFriends() {
      await axios
        .get("http://0.0.0.0:8000/api/follow/", config)
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserFriends", data.friends);
        });
    }

    async function searchForUser() {
      await axios
        .get(`http://0.0.0.0:8000/api/accounts/${state.search}/`, config)
        .then((response) => response.data)
        .then((data) => {
          state.searchFailed = false;
          store.dispatch("setOther", data);
          router.push("/profile");
        })
        .catch(() => {
          state.searchFailed = true;
          asideResetIndex.value++;
        });
    }

    function showFollowersGrid() {
      store.dispatch("setGenericModalSwitch");
    }

    function showFriendsGrid() {
      state.showFriends = !state.showFriends;
    }

    onBeforeMount(getTimeline);
    onMounted(() => {
      loadUserAvatar();
      loadUserWallpaper();
      loadUserFriends();
      store.dispatch("unsetOther");
      store.dispatch("setNotifications");
    });

    return {
      store,
      reactive,
      state,
      wallpaper,
      timeline,
      asideResetIndex,
      switchUploadAvatar,
      switchUploadWallpaper,
      uploadAvatar,
      uploadWallpaper,
      onAvatarFileSelected,
      onWallpaperFileSelected,
      searchForUser,
      showFollowersGrid,
      showFriendsGrid,
      ContentCard,
      CreationArea,
      // FsGrid,
      GenericModal,
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

  .timeline {
    height: fit-content;
    grid-area: timeline;
    backdrop-filter: blur(8px);
    background-color: rgba($color: slategrey, $alpha: 0.5);
    min-height: fit-content;
    padding-bottom: 30px;
  }
}
</style>
