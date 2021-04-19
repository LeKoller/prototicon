<template>
  <transition name="model">
    <div class="modal_mask">
      <transition class="animate__animated animate__fadeInUp">
        <div class="modal_container">
          <div v-if="props.type === 'FollowersGrid'">
            <FsGrid />
          </div>
          <div v-else-if="props.type === 'NotificationsBox'">
            <NotificationsBox />
          </div>
          <div v-else-if="props.type === 'MessagesBox'">
            <MessagesBox />
          </div>
          <button class="close_modal_button" @click="closeModal">
            <span class="material-icons">
              clear
            </span>
          </button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import store from "../store";
import FsGrid from "./FsGrid";
import NotificationsBox from "./NotificationsBox";
import MessagesBox from "./MessagesBox";

export default {
  name: "Modal",
  components: {
    FsGrid,
    NotificationsBox,
    MessagesBox,
  },
  props: {
    type: String,
  },
  setup(props) {
    function closeModal() {
      store.dispatch("unsetAnyModalSwitch");
    }

    return {
      props,
      store,
      closeModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal_mask {
  position: fixed;
  z-index: 997;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;

  .modal_container {
    width: 60%;
    padding: 40px;
    padding-top: 20px;
    background-color: rgba($color: #fff, $alpha: 0.7);
    position: relative;
    top: 5vh;

    .close_modal_button {
      position: absolute;
      right: 8px;
      top: 8px;
      font-family: "Fredoka One", cursive;
      font-weight: normal;
      font-size: 1rem;
      background-color: transparent;
      color: #abb9c0;
      outline: none;
      border: none;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        color: #2f383d;
        transform: scale(1.1, 1.1);
      }

      &:active {
        transform: scale(0.8, 0.8);
      }
    }
  }
}
</style>
