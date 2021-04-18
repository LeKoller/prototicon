<template>
  <transition name="model">
    <div class="modal_mask">
      <transition class="animate__animated animate__bounceIn">
        <div class="modal_content">
          <CreationArea />
          <button class="close_modal_button" @click="closeModal">
            never mind...
          </button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import store from "../store";
import CreationArea from "./CreationArea";

export default {
  name: "Modal",
  components: {
    CreationArea,
  },
  setup() {
    function closeModal() {
      store.dispatch("setModalSwitch");
    }

    return {
      closeModal,
      CreationArea,
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
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;

  .close_modal_button {
    font-family: "Fredoka One", cursive;
    font-weight: normal;
    font-size: 1rem;
    background-color: #b08cfa;
    color: #d3dce6;
    outline: none;
    border: none;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    margin-top: 16px;

    &:hover {
      color: #2f383d;
      transform: scale(1.1, 1.1);
    }

    &:active {
      transform: scale(0.8, 0.8);
    }
  }
}
</style>
