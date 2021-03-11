<template>
  <img
    v-if="wallpaper !== null"
    class="wallpaper"
    :src="`http://0.0.0.0:8000${wallpaper}/`"
    alt="wallpaper"
  />
  <div class="container">
    <transition class="animate__animated animate__fadeInUp">
      <div class="timeline">
        <transition class="animate__animated animate__bounceIn">
          <div>
            <ContentCard :content="content" />
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed } from "vue";
import store from "../store";
import ContentCard from "../components/ContentCard";

export default {
  name: "SingleContent",
  components: {
    ContentCard,
  },
  setup() {
    const wallpaper = computed(() => store.state.user.wallpaper);
    const content = computed(() => store.state.singleContent);

    return {
      wallpaper,
      content,
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
  margin: 12px;

  .error_message {
    color: #ff817e;
  }

  .timeline {
    height: fit-content;
    min-height: fit-content;
    padding: 40px 100px;
    backdrop-filter: blur(8px);
    background-color: rgba($color: slategrey, $alpha: 0.5);
  }
}
</style>
