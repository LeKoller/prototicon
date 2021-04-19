<template>
  <img
    v-if="wallpaper !== null"
    class="wallpaper"
    :src="`${wallpaper}`"
    alt="wallpaper"
  />
  <div class="container">
    <transition class="animate__animated animate__fadeInLeft animate__delay-1s">
      <Aside />
    </transition>

    <transition class="animate__animated animate__fadeInRight">
      <CreationArea :getTimeline="getTimeline" />
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
import { onBeforeMount, onMounted, computed } from "vue";
import axios from "axios";
import ContentCard from "../components/ContentCard";
import CreationArea from "../components/CreationArea";
import GenericModal from "../components/GenericModal";
import Aside from "../components/Aside";

export default {
  name: "Dashboard",
  components: {
    CreationArea,
    ContentCard,
    GenericModal,
    Aside,
  },
  setup() {
    const wallpaper = computed(() => store.state.user.wallpaper);
    const timeline = computed(() => store.state.timeline);

    const config = {
      headers: {
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

    onBeforeMount(getTimeline);
    onMounted(() => {
      store.dispatch("unsetOther");
      store.dispatch("setNotifications");
      store.dispatch("setGetTimelineHold", getTimeline);
    });

    return {
      store,
      wallpaper,
      timeline,
      ContentCard,
      CreationArea,
      GenericModal,
      Aside,
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
