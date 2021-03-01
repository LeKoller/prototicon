<template>
  <div class="home">
    <div class="container">
      <transition
        class="animate__animated animate__fadeInLeft animate__delay-1s"
      >
        <div class="welcome">
          <h1>Welcome to</h1>
          <p>... the social midia of projects, prototypes and fun!</p>
        </div>
      </transition>
      <transition class="animate__animated animate__bounceIn">
        <img id="logo" alt="Prototicon logo" src="../assets/logo.png" />
      </transition>
      <transition
        class="animate__animated animate__fadeInRight animate__delay-2s"
      >
        <div class="login">
          <h2>Login</h2>
          <LoginForm />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import LoginForm from "../components/LoginForm";

export default {
  name: "Home",
  setup() {
    const state = reactive({
      loaded: false,
    });

    return state, LoginForm;
  },
};
</script>

<style lang="scss" scoped>
#logo {
  margin: 2rem;
  z-index: 0;
}

h1,
h2 {
  font-family: "Fredoka One", cursive;
  font-size: 3rem;
  font-weight: normal;
}

.container {
  color: white;
  background-color: #b08cfa;
  height: 100vh;
  position: relative;

  @supports (backdrop-filter: blur()) {
    .welcome {
      position: absolute;
      left: 8vw;
      top: 22vh;
      max-width: 26vw;
      backdrop-filter: blur(8px);
      z-index: 1;
    }

    .login {
      backdrop-filter: blur(8px);
      backdrop-filter: grayscale(20%);
      backdrop-filter: brightness(80%);
      position: absolute;
      border-radius: 8px;
      right: 8vw;
      top: 14vh;
      max-width: 26vw;
      padding: 20px;

      h2 {
        font-size: 2.4rem;
        margin-top: 0;
      }
    }
  }
}
</style>
