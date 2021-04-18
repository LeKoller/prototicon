<template>
  <div class="creation_area">
    <h3>hello {{ store.state.user.username }}!</h3>
    <form @submit.prevent="">
      <div class="title_and_buttons">
        <input
          type="text"
          name="title_field"
          placeholder="your awesome title"
          v-model="store.state.creation.content.title"
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
          :class="{ private: store.state.creation.content.is_private }"
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
        v-if="store.state.creation.uploadText"
        v-model="store.state.creation.content.text"
      ></textarea>
      <div class="title_and_buttons">
        <input
          class="image_field"
          type="file"
          @change="onContentFileSelected"
          v-if="store.state.creation.uploadImage"
        />
        <button
          @click="submitContent"
          class="submit_button"
          v-if="!store.state.modalSwitch"
        >
          submit
        </button>
        <button
          @click="updateContent(store.state.creation.content.id)"
          class="submit_button"
          v-else
        >
          update
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import store from "../store";
import { computed } from "vue";
import axios from "axios";

export default {
  name: "CreationArea",
  setup() {
    const getTimeline = computed(() => store.state.getTimelineHold);

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

    function enableText() {
      store.dispatch("setUploadText");
    }

    function enableImage() {
      store.dispatch("setUploadImage");
    }

    function enablePrivate() {
      store.dispatch("setPrivate");
    }

    function onContentFileSelected(event) {
      store.dispatch("setCreationContentImage", event.target.files[0]);
    }

    function makeRequestObject() {
      if (store.state.creation.content.text !== "") {
        return {
          title: store.state.creation.content.title,
          text: store.state.creation.content.text,
          is_private: store.state.creation.content.is_private,
        };
      } else {
        return {
          title: store.state.creation.content.title,
          is_private: store.state.creation.content.is_private,
        };
      }
    }

    async function submitContent() {
      const fd = new FormData();

      if (store.state.creation.content.title.length > 0) {
        await axios
          .post(
            "http://0.0.0.0:8000/api/contents/",
            makeRequestObject(),
            config
          )
          .then((response) => response.data)
          .then((data) => {
            if (store.state.creation.content.image !== null) {
              fd.append(
                "image",
                store.state.creation.content.image,
                store.state.creation.content.image.name
              );
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
      store.dispatch("unsetCreation");
      getTimeline.value();
    }

    async function updateContent() {
      const fd = new FormData();
      const contentId = store.state.creation.content.id;

      if (store.state.creation.content.title.length > 0) {
        await axios
          .patch(
            `http://0.0.0.0:8000/api/contents/${contentId}/`,
            makeRequestObject(),
            config
          )
          .then((response) => response.data)
          .then((data) => {
            if (store.state.creation.content.image !== null) {
              fd.append(
                "image",
                store.state.creation.content.image,
                store.state.creation.content.image.name
              );
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
      store.dispatch("unsetCreation");
      store.dispatch("setModalSwitchOff");
      getTimeline.value();
    }

    return {
      store,
      enableText,
      enableImage,
      enablePrivate,
      onContentFileSelected,
      submitContent,
      updateContent,
    };
  },
};
</script>

<style lang="scss" scoped>
.creation_area {
  height: fit-content;
  grid-area: creation;
  backdrop-filter: blur(8px);
  background-color: rgba($color: steelblue, $alpha: 0.7);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 20px;
  padding-right: 20px;

  error_message {
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

  h3 {
    #coffe_icon {
      position: relative;
      font-size: 1.2rem;
      top: 0.1rem;
      color: rgba($color: #000000, $alpha: 0.4);
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
</style>
