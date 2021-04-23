<template>
  <div class="home">
    <div class="container">
      <transition
        class="animate__animated animate__fadeInLeft animate__delay-1s"
      >
        <div class="welcome">
          <h1>Welcome to</h1>
          <p>... the social media of projects, prototypes and fun!</p>
        </div>
      </transition>
      <transition class="animate__animated animate__bounceIn">
        <img id="logo" alt="Prototicon logo" src="../assets/logo.png" />
      </transition>
      <transition class="animate__animated animate__fadeInUp animate__delay-2s">
        <div class="login">
          <h2>Login</h2>
          <div class="form_container">
            <form @submit.prevent="performLogin">
              <input
                type="text"
                name="username"
                placeholder="username"
                v-model="state.user.username"
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                v-model="state.user.password"
              />
              <div class="anchor_and_button">
                <a href="/signup">Sign up</a>
                <button>Login</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import LoginForm from "../components/LoginForm";
import axios from "axios";
import store from "../store";
import router from "../router";

export default {
  name: "Home",
  setup() {
    const state = reactive({
      user: {
        username: "",
        password: "",
      },
      failedLogin: false,
    });

    function performLogin() {
      axios
        .post(
          "http://ec2-177-71-148-166.sa-east-1.compute.amazonaws.com/api/login/",
          state.user
        )
        .then((response) => response.data)
        .then((data) => {
          store.dispatch("setUser", {
            username: data.user.username,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            email: data.user.email,
            followers: data.user.followers,
            following: data.user.following,
            liked_content: data.user.liked_content,
            friends: data.friends,
            token: data.token,
            // image: data.user.image,
            // wallpaper: data.user.wallpaper,
          });

          router.push("/dashboard");
        })
        .catch(() => {
          state.failedLogin = true;
          console.log("login failed = " + state.failedLogin);
        });
    }

    return { LoginForm, state, performLogin, store };
  },
};
</script>

<style lang="scss" scoped>
#logo {
  margin: 2rem;
  z-index: 0;
  width: fit-content;
  margin: auto;
  position: relative;
  bottom: 5vh;
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
  width: 100%;
  height: 100vh;
  position: relative;
  margin: 0;

  @supports (backdrop-filter: blur()) {
    .welcome {
      position: absolute;
      left: 8vw;
      top: 22vh;
      max-width: 26vw;
      padding: 10px;
      border-radius: 8px;
      backdrop-filter: blur(8px);
      z-index: 1;
    }

    .login {
      backdrop-filter: blur(8px);
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

.form_container {
  width: 100%;
  height: fit-content;
  font-family: "Roboto";
  font-weight: 100;

  form {
    display: flex;
    flex-direction: column;

    input {
      margin: 8px;
      border-radius: 8px;
      padding: 0.2rem;
      padding-left: 10px;
      outline: none;
      background-color: white;
      color: #4bb6ff;
    }

    .anchor_and_button {
      display: flex;
      justify-content: space-between;
      padding: 8px;

      a {
        color: #73e3e7;
      }

      button {
        outline: none;
        border: none;
        border-radius: 8px;
        background-color: white;
        color: #b08cfa;
        padding: 4px 12px 4px 12px;
        cursor: pointer;
        transition: all 0.25s ease;

        &:hover {
          transform: scale(1.05, 1.05);
          color: #73e3e7;
        }

        &:active {
          transform: scale(0.8, 0.8);
        }
      }
    }
  }
}
</style>
