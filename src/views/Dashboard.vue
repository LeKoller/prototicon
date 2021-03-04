<template>
  <div class="container">
    <div class="aside">
      <img
        id="profile_picture"
        src="../assets/lekoller_mock.jpeg"
        alt="Profile pricture"
      />
    </div>

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
        ></textarea>
        <div class="title_and_buttons">
          <input
            class="image_field"
            type="file"
            @change="onFileSelected"
            v-if="state.uploadImage"
          />
          <button class="submit_button">
            submit
          </button>
        </div>
      </form>
    </div>
    <div class="timeline"></div>
  </div>
</template>

<script>
import store from "../store";
import { reactive } from "vue";

export default {
  name: "Dashboard",
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
    });

    function enableText() {
      state.uploadText = !state.uploadText;
    }

    function enableImage() {
      state.uploadImage = !state.uploadImage;
    }

    function enablePrivate() {
      state.content.is_private = !state.content.is_private;
    }

    function onFileSelected(event) {
      state.content.image = event.target.files[0];
    }

    return {
      store,
      reactive,
      state,
      enableText,
      enableImage,
      enablePrivate,
      onFileSelected,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 40vh 50vw;
  grid-template-areas: "aside creation" "aside timeline";

  margin: 12px;

  .aside {
    grid-area: aside;
    background-color: #043156;

    #profile_picture {
      object-fit: cover; /* Do not scale the image */
      object-position: center; /* Center the image within the element */
      width: 16vw;
      height: 16vw;
      overflow: hidden;

      margin-top: 20px;
      border: 1px solid black;
      border-radius: 8px;
      /* padding: 10px; */
      background-color: rgba($color: #000000, $alpha: 0.3);
    }
  }

  .creation_area {
    /* height: fit-content; */
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
      }

      color: #d3dce6;
      font-family: "Fredoka One", cursive;
      font-weight: normal;
      margin-top: 6px;
    }

    form {
      display: flex;
      flex-direction: column;

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

      textarea {
        width: 72vw;
        resize: none;
      }

      .image_field {
        width: 62vw;
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
        }
      }
    }
  }

  .timeline {
    grid-area: timeline;
    background-color: slategrey;
    min-height: fit-content;
  }
}
</style>
