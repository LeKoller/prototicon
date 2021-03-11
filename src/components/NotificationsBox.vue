<template>
  <div v-for="notification in notifications" :key="notification.id">
    <div
      class="message_box"
      :class="{ seen: notification.is_seen }"
      @click="setNotificationSeen(notification.id)"
    >
      <transition class="animate__animated animate__fadeInLeft">
        <span class="material-icons new_tag" v-if="!notification.is_seen">
          label
        </span>
        <span class="material-icons seen_tag" v-else>
          done
        </span>
      </transition>
      <span>{{ notification.message }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
// import { onBeforeMount } from "@vue/runtime-core";
import store from "../store";

export default {
  name: "NotificationsBox",
  setup() {
    const notifications = computed(() => store.state.notifications);

    async function setNotificationSeen(notification_id) {
      await store.dispatch("setNotificationSeen", notification_id);
      store.dispatch("setNotifications");
    }

    // onBeforeMount(() => store.dispatch("setNotifications"));

    return {
      store,
      notifications,
      setNotificationSeen,
    };
  },
};
</script>

<style lang="scss" scoped>
.message_box {
  background-color: rgb(47, 54, 61);
  color: #d3dce6;
  padding: 8px;
  border-bottom: 1px solid rgb(69, 71, 75);
  /* cursor: pointer; */
  transition: all 0.25s ease;

  &:hover {
    background-color: slategray;
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
}

.seen {
  background-color: rgb(28, 32, 37);
  color: slategray;
}
</style>
