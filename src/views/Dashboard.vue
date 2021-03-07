<template>
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
            :src="`http://0.0.0.0:8000${store.state.user.image}/`"
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
            <a href="">Followers</a>:
            <span class="status_data">{{
              store.state.user.followers.length
            }}</span>
          </h4>
          <h4>
            <span class="material-icons status_icons">
              follow_the_signs
            </span>
            <a href="">Following</a>:
            <Following class="status_data">{{
              store.state.user.following.length
            }}</Following>
          </h4>
          <h4>
            <span class="material-icons status_icons">
              mood
            </span>
            <a href="">Friends</a>:
            <span class="status_data">{{
              store.state.user.friends.length
            }}</span>
          </h4>
        </div>

        <div class="user_search">
          <input
            type="search"
            placeholder="search for an user"
            v-model="state.search"
          />
          <button class="search_button" @click="searchForUser">
            <span id="search_users_icon" class="material-icons">
              person_search
            </span>
          </button>
        </div>
        <span class="error_message" v-show="state.searchFailed"
          >user not found</span
        >
      </div>
    </transition>

    <transition class="animate__animated animate__fadeInRight">
      <div class="creation_area">
        <h3>
          hello {{ store.state.user.username }}!
          <span id="coffe_icon" class="material-icons">
            coffee
          </span>
        </h3>
        <form @submit.prevent="">
          <div class="title_and_buttons">
            <input
              type="text"
              name="title_field"
              placeholder="your awesome title"
              v-model="state.content.title"
            />
            <button @click="enableText">
              <span class="material-icons">
                text_fields
              </span>
            </button>
            <button @click="enableImage">
              <span class="material-icons">
                image
              </span>
            </button>
            <button
              @click="enablePrivate"
              :class="{ private: state.content.is_private }"
            >
              <span class="material-icons">
                block
              </span>
            </button>
          </div>
          <textarea
            name="text_field"
            id="text_field"
            cols="30"
            rows="8"
            v-if="state.uploadText"
            v-model="state.content.text"
          ></textarea>
          <div class="title_and_buttons">
            <input
              class="image_field"
              type="file"
              @change="onContentFileSelected"
              v-if="state.uploadImage"
            />
            <button @click="submitContent" class="submit_button">
              submit
            </button>
          </div>
        </form>
      </div>
    </transition>

    <transition class="animate__animated animate__fadeInUp">
      <div class="timeline">
        <transition class="animate__animated animate__bounceIn">
          <ContentCard :timelineResetIndex="timelineResetIndex" />
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import store from "../store";
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import axios from "axios";
import ContentCard from "../components/ContentCard";
import { getTimeline, deleteContent } from "../helper.js";

export default {
  name: "Dashboard",
  components: {
    ContentCard,
  },
  setup() {
    const state = reactive({
      uploadText: false,
      uploadImage: false,
      content: {
        title: "",
        text: "",
        image: null,
        user: store.state.user.username,
        is_private: false,
      },
      uploadAvatarInputShow: false,
      avatarFile: null,
      search: "",
      searchFailed: false,
    });

    const asideResetIndex = ref(0);
    // const timelineResetIndex = ref(0);

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

    function switchUploadAvatar() {
      state.uploadAvatarInputShow = !state.uploadAvatarInputShow;
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

    function enableText() {
      state.uploadText = !state.uploadText;
    }

    function enableImage() {
      state.uploadImage = !state.uploadImage;
    }

    function enablePrivate() {
      state.content.is_private = !state.content.is_private;
    }

    function onAvatarFileSelected(event) {
      state.avatarFile = event.target.files[0];
    }

    function onContentFileSelected(event) {
      state.content.image = event.target.files[0];
    }

    function makeRequestObject() {
      if (state.content.text !== "") {
        return {
          title: state.content.title,
          text: state.content.text,
          is_private: state.content.is_private,
        };
      } else {
        return {
          title: state.content.title,
          is_private: state.content.is_private,
        };
      }
    }

    function loadUserAvatar() {
      axios
        .get(`http://0.0.0.0:8000/api/accounts/${store.state.user.username}/`)
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserAvatar", data.image);
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

    async function submitContent() {
      const fd = new FormData();

      if (state.content.title.length > 0) {
        await axios
          .post(
            "http://0.0.0.0:8000/api/contents/",
            makeRequestObject(),
            config
          )
          .then((response) => response.data)
          .then((data) => {
            if (state.content.image !== null) {
              fd.append("image", state.content.image, state.content.image.name);
              fd.append("content_id", data.id);
              axios
                .post(
                  "http://0.0.0.0:8000/api/contents/image/",
                  fd,
                  imageConfig
                )
                .then((response) => response.data)
                .then((data) => {
                  console.log(data);
                });
            }
          });
      }
      getTimeline();
    }

    async function searchForUser() {
      await axios
        .get(`http://0.0.0.0:8000/api/accounts/${state.search}/`, config)
        .then((response) => response.data)
        .then((data) => {
          state.searchFailed = false;
          store.dispatch("setOther", data);
          console.log(store.state.other);
        })
        .catch(() => {
          state.searchFailed = true;
          asideResetIndex.value++;
        });
    }

    onBeforeMount(getTimeline);
    onMounted(loadUserAvatar);
    onMounted(loadUserFriends);

    return {
      store,
      reactive,
      state,
      asideResetIndex,
      switchUploadAvatar,
      uploadAvatar,
      enableText,
      enableImage,
      enablePrivate,
      onAvatarFileSelected,
      onContentFileSelected,
      deleteContent,
      submitContent,
      searchForUser,
      ContentCard,
    };
  },
};
</script>

<style lang="scss" scoped>
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
    background-color: #043156;
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
    .user_search {
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

  .creation_area {
    height: fit-content;
    grid-area: creation;
    background-color: steelblue;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 16px;
    padding-right: 16px;

    h3 {
      #coffe_icon {
        position: relative;
        font-size: 1.2rem;
        top: 0.1rem;
        color: #78f280;
      }

      color: #d3dce6;
      font-family: "Fredoka One", cursive;
      font-weight: normal;
      margin-top: 6px;
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
    background-color: slategrey;
    min-height: fit-content;
    padding-bottom: 30px;
  }
}
</style>
