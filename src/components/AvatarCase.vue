<template>
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
</template>

<script>
import { onBeforeMount, reactive } from "vue";
import store from "../store";
import axios from "axios";

export default {
  name: "AvatarCase",
  setup() {
    const state = reactive({
      uploadAvatarInputShow: false,
      avatarFile: null,
    });

    const imageConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    function switchUploadAvatar() {
      state.uploadAvatarInputShow = !state.uploadAvatarInputShow;
    }

    function onAvatarFileSelected(event) {
      state.avatarFile = event.target.files[0];
    }

    async function uploadAvatar() {
      console.log(state.avatarFile);
      if (state.avatarFile !== null) {
        const fd = new FormData();
        fd.append("image", state.avatarFile, state.avatarFile.name);

        await axios
          .post(
            "http://ec2-177-71-148-166.sa-east-1.compute.amazonaws.com/api/accounts/avatar/",
            fd,
            imageConfig
          )
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
          });

        switchUploadAvatar();
        loadUserAvatar();
        state.avatarFile = null;
      }
    }

    function loadUserAvatar() {
      axios
        .get(
          `http://ec2-177-71-148-166.sa-east-1.compute.amazonaws.com/api/accounts/${store.state.user.username}/`
        )
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUserAvatar", data.image);
        });
    }

    onBeforeMount(loadUserAvatar);

    return {
      store,
      state,
      switchUploadAvatar,
      onAvatarFileSelected,
      uploadAvatar,
    };
  },
};
</script>
