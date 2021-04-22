<template>
  <div class="container">
    <transition class="animate__animated animate__fadeInUp">
      <div class="sign_up">
        <h2>Introduce <span class="yourself">yourself</span>!</h2>
        <div class="form_container">
          <form @submit.prevent="performSignUp">
            <input
              type="text"
              name="firstName"
              placeholder="first name"
              v-model="state.signInObject.first_name"
            />
            <input
              type="text"
              name="lastName"
              placeholder="last name"
              v-model="state.signInObject.last_name"
            />
            <input
              type="text"
              name="username"
              placeholder="nickname"
              v-model="state.signInObject.username"
            />
            <input
              type="email"
              name="email"
              placeholder="email"
              v-model="state.signInObject.email"
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              v-model="state.signInObject.password"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="confirm password"
              v-model="state.confirmPassword"
            />
            <span
              class="confirmation_message"
              v-bind:class="{ message_confirmed: passwordChecked }"
              >{{ confirmationMessage() }}</span
            >
            <div class="anchor_and_button">
              <button :disable="!enableButton.value" id="signup_button">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import axios from "axios";
import router from "../router";

export default {
  name: "SignUp",
  setup() {
    const state = reactive({
      signInObject: {
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        email: "",
      },
      confirmPassword: "",
    });

    const passwordChecked = computed(
      () =>
        state.signInObject.password.length >= 8 &&
        state.signInObject.password === state.confirmPassword
    );

    const fieldsFilled = computed(
      () =>
        state.signInObject.username.length >= 6 &&
        state.signInObject.first_name !== "" &&
        state.signInObject.last_name.length >= 2 &&
        state.signInObject.email.length >= 6
    );

    const enableButton = computed(
      () => passwordChecked.value && fieldsFilled.value
    );

    function confirmationMessage() {
      if (passwordChecked.value) {
        return "confirmed!";
      }

      return "not confirmed";
    }

    function performSignUp() {
      if (enableButton.value) {
        axios
          .post(
            "http://ec2-18-221-25-255.us-east-2.compute.amazonaws.com/api/accounts/",
            state.signInObject
          )
          .then((response) => console.log(response.status));
      }

      router.push("/");
    }

    return {
      state,
      passwordChecked,
      fieldsFilled,
      enableButton,
      confirmationMessage,
      performSignUp,
    };
  },
};
</script>

<style lang="scss" scoped>
h2 {
  font-family: "Fredoka One", cursive;
  font-size: 3rem;
  font-weight: normal;
  color: #fff;
}

.yourself {
  color: #b08cfa;
}

.container {
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/5/5e/Joy_Oil_gas_station_blueprints.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  max-width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
}

@supports (backdrop-filter: blur()) {
  .sign_up {
    width: 40%;
    height: fit-content;
    backdrop-filter: blur(8px);
    background-color: rgba($color: #fff, $alpha: 0.1);
    border-radius: 8px;
    padding: 30px;
    color: #b08cfa;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 60px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    bottom: 6vh;

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
    width: 80%;
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

    .confirmation_message {
      color: rgb(168, 168, 168);
      transition: all 0.25s ease;
    }

    .message_confirmed {
      color: #73e3e7;
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

        &:disabled {
          color: dimgray;
          transform: scale(1, 1);
          cursor: default;
        }
      }
    }
  }
}
</style>
