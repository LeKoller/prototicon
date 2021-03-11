<template>
  <div id="nav">
    <div id="logout_and_title">
      <div class="logout_button_case" v-if="isLogged">
        <button @click="performLogout">
          <span class="material-icons">
            logout
          </span>
        </button>
      </div>
      <span id="title">pro<span id="tot">tot</span>icon</span>
    </div>
    <div v-if="isLogged">
      <router-link class="link" to="/profile">Profile</router-link> |
    </div>
    <div v-else><router-link class="link" to="/">Home</router-link> |</div>
    <div v-if="isLogged">
      <router-link class="link" to="/dashboard">Dashboard</router-link> |
    </div>
    <div v-else>
      <router-link class="link" to="/signup">Join</router-link> |
    </div>
    <router-link class="link" to="/about">About</router-link>
    <div v-if="isLogged" class="notifications_case">
      <a href="#" @click="openNotificationModal" class="link"
        ><span class="material-icons notifications_icon">
          announcement
        </span></a
      ><span class="unseen_count" v-if="unseenNotificationsCount !== 0"
        >{{ unseenNotificationsCount }}
      </span>
    </div>
  </div>
  <router-view />
  <Modal v-if="store.state.modalSwitch" />
  <GenericModal
    type="NotificationsBox"
    v-if="store.state.notificationsModalSwitch"
  />
</template>

<script>
import { computed } from "vue";
import store from "./store";
import Modal from "./components/Modal";
import GenericModal from "./components/GenericModal";

export default {
  name: "App",
  components: {
    Modal,
    GenericModal,
  },
  setup() {
    const isLogged = computed(() => store.state.user.token !== "");
    const unseenNotificationsCount = computed(() => {
      let count = 0;

      store.state.notifications.forEach((notification) => {
        if (!notification.is_seen) {
          count++;
        }
      });

      return count;
    });

    function performLogout() {
      store.dispatch("unsetTimeline");
      store.dispatch("logout");
    }

    function openNotificationModal() {
      store.dispatch("setNotificationsModalSwitch");
    }

    return {
      computed,
      store,
      isLogged,
      unseenNotificationsCount,
      performLogout,
      openNotificationModal,
    };
  },
};
</script>

<style lang="scss">
.notifications_case {
  position: absolute;
  right: 220px;
  bottom: 0.8rem;

  .notifications_icon {
    color: #687785;
    transition: all 0.25s ease;

    &:hover {
      color: #b08cfa;
    }
  }

  .unseen_count {
    position: relative;
    right: 8px;
    bottom: 8px;
    color: #b08cfa;
  }
}

#logout_and_title {
  color: #b08cfa;
  font-family: "Fredoka One", cursive;
  font-size: 1.6rem;
  position: absolute;
  right: 0.8rem;
  bottom: 0.8rem;
  display: flex;

  .logout_button_case {
    margin-right: 16px;

    button {
      outline: none;
      border: none;
      background-color: transparent;
      color: #d3dce6;
      cursor: pointer;
      transition: all 0.25s ease-in-out;

      &:hover {
        color: #73e3e7;
      }
    }
  }

  #tot {
    color: #73e3e7;
  }
}

#app {
  font-family: "Nunito", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 26px;
  background-color: white;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 998;

  .link {
    margin: 0 1rem 0 1rem;
  }
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  transition: all 0.25s ease;

  &:hover {
    color: #687785;
  }
}

#nav a.router-link-exact-active {
  color: #4bb6ff;
}
</style>
