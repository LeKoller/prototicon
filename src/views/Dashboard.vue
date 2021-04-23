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
import { onBeforeMount, onMounted, computed, ref } from "vue";
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

    const ws = ref({});

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
          .get(
            `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/contents/?author=${username}`,
            config
          )
          .then((response) => response.data)
          .then((data) => {
            contents = [...contents, ...data.results];
          });

        store.dispatch("setTimeline", contents);
      }
    }

    function getMessagesOnCache() {
      try {
        for (let friend of store.state.user.friends) {
          axios
            .get(
              `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/messages/?username=${friend.username}`,
              config
            )
            .then((res) => {
              console.log(res.data);
            });
        }
      } catch {
        console.log("ok");
      }
    }

    onBeforeMount(getTimeline);
    onBeforeMount(getMessagesOnCache);

    onMounted(() => {
      ws.value.current = new WebSocket(
        `ws://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/ws/messages/?token=${store.state.user.token}`
      );
      ws.value.current.headers = config.headers;
      ws.value.current.onopen = () => console.log("ws openned");
      ws.value.current.onclose = () => console.log("ws closed");

      ws.value.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.messages) {
          store.dispatch("setChats", data.messages);
        }
        if (data.message) {
          store.dispatch("setNewMessage", data.message);
        }
      };

      return () => {
        ws.value.current.close();
      };
    });

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
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  z-index: 0;
}

.container {
  display: grid;
  grid-gap: 16px;
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
