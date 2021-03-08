<template>
  <transition name="model">
    <div class="modal_mask">
      <transition class="animate__animated animate__bounceIn">
        <div class="modal_content">
          <CreationArea />
          <button @click="closeModal">close modal</button>
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

  .modal_wrapper {
    width: 60%;
    padding: 40px;
    background-color: rgba($color: #fff, $alpha: 0.7);
  }
}
</style>
