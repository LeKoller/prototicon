<template>
  <div id="nav">
    <span id="title">pro<span id="tot">tot</span>icon</span>
    <router-link class="link" to="/">Home</router-link> |
    <div v-if="!isLogged">
      <router-link class="link" to="/signup">Join</router-link> |
    </div>
    <router-link class="link" to="/about">About</router-link>
  </div>
  <router-view />
</template>

<script>
import { computed } from "vue";
import store from "./store";

export default {
  name: "App",
  setup() {
    const isLogged = computed(() => store.state.user.token !== "");

    return {
      computed,
      store,
      isLogged,
    };
  },
};
</script>

<style lang="scss">
#title {
  color: #b08cfa;
  font-family: "Fredoka One", cursive;
  font-size: 1.6rem;
  position: absolute;
  right: 0.8rem;
  bottom: 0.8rem;

  #tot {
    color: #73e3e7;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
