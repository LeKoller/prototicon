<template>
  <transition class="animate__animated animate__fadeInUp">
    <div class="login">
      <h2>Login</h2>
      <div class="form_container">
        <form @submit.prevent="">
          <input
            type="text"
            name="username"
            placeholder="username"
            v-model="state.username"
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            v-model="state.password"
          />
          <div class="anchor_and_button">
            <button>Sign up</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { reactive } from "vue";

export default {
  name: "SignUp",
  setup() {
    const state = reactive({
      username: "",
      password: "",
    });

    function performSignUp() {}

    return { state, performSignUp };
  },
};
</script>

<style lang="scss" scoped>
h1,
h2 {
  font-family: "Fredoka One", cursive;
  font-size: 3rem;
  font-weight: normal;
}

@supports (backdrop-filter: blur()) {
  .login {
    backdrop-filter: blur(8px);
    border-radius: 8px;
    padding: 20px;
    color: #b08cfa;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h2 {
      font-size: 2.4rem;
      margin-top: 0;
    }
  }
}

.form_container {
  width: 100%;
  height: fit-content;
  font-family: "Roboto";
  font-weight: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  form {
    display: flex;
    flex-direction: column;
    width: 60%;
    justify-content: center;
    align-items: center;

    input {
      width: 100%;
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
