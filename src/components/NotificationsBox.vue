<template>
  <h4>Notifications</h4>
  <div class="notifications_container">
    <div v-for="notification in notifications" :key="notification.id">
      <div
        class="message_box"
        :class="{ seen: notification.is_seen }"
        @click="setNotificationSeen(notification.id)"
      >
        <span class="material-icons new_tag" v-if="!notification.is_seen">
          label
        </span>
        <transition class="animate__animated animate__fadeInLeft">
          <span class="material-icons seen_tag" v-if="notification.is_seen">
            done
          </span>
        </transition>
        <span v-if="notification.of_type === 'liked'"
          >{{ notification.message.split(" ")[0] }} liked your
          <a
            class="content_link"
            href="#"
            @click="goToSingleContentPage(notification.content_id)"
          >
            content</a
          >!</span
        >
        <span v-else-if="notification.of_type === 'commented'"
          >{{ notification.message.split(" ")[0] }} commented your
          <a
            class="content_link"
            href="#"
            @click="goToSingleContentPage(notification.content_id)"
          >
            content</a
          >!</span
        >
        <span v-else>{{ notification.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import store from "../store";
import router from "../router";
import axios from "axios";

export default {
  name: "NotificationsBox",
  setup() {
    const notifications = computed(() =>
      store.state.notifications.sort((a, b) => {
        if (a.id < b.id) {
          return 1;
        }
        return -1;
      })
    );

    async function setNotificationSeen(notification_id) {
      await store.dispatch("setNotificationSeen", notification_id);
      store.dispatch("setNotifications");
    }

    async function goToSingleContentPage(content_id) {
      const config = {
        headers: {
          Authorization: `Token ${store.state.user.token}`,
        },
      };

      const content = await axios
        .get(
          `http://ec2-177-71-148-166.sa-east-1.compute.amazonaws.com/api/contents/get_one/${content_id}/`,
          config
        )
        .then((response) => response.data)
        .then((data) => data);

      store.dispatch("setSingleContent", content);
      store.dispatch("unsetAnyModalSwitch");
      router.push("/content");
    }

    return {
      store,
      notifications,
      setNotificationSeen,
      goToSingleContentPage,
    };
  },
};
</script>

<style lang="scss" scoped>
h4 {
  margin-top: 0;
  padding-top: 0;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgb(47, 54, 61);
}

::-webkit-scrollbar-thumb {
  background: rgb(33, 39, 44);
}

::-webkit-scrollbar-thumb:hover {
  background: #093156;
}

.notifications_container {
  overflow: auto;
  max-height: 60vh;

  .message_box {
    background-color: rgb(47, 54, 61);
    color: #d3dce6;
    padding: 8px;
    border-bottom: 1px solid rgb(69, 71, 75);
    cursor: default;
    transition: all 0.25s ease;

    &:hover {
      background-color: #45525f;
    }

    .new_tag,
    .seen_tag {
      color: #b08cfa;
      position: relative;
      top: 6px;
      right: 4px;
    }

    .seen_tag {
      color: #78f280;
    }

    .content_link {
      color: #b08cfa;

      &:hover {
        color: #4bb6ff;
      }
    }
  }

  .seen {
    background-color: rgb(28, 32, 37);
    color: slategray;
  }
}
</style>
