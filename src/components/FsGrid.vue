<template>
  <div class="users_wrapper">
    <img
      class="user_avatar_miniature"
      v-for="user in store.state.user.followers"
      :key="user.id"
      :src="`http://0.0.0.0:8000${user.image}/`"
      :alt="`${user.username}`"
      @click="goToUsersProfile(user.username)"
    />
  </div>
</template>

<script>
import router from "../router";
import store from "../store";
import axios from "axios";

export default {
  name: "FsGrid",
  // props: {
  //   usersList: Array,
  // },
  setup() {
    const config = {
      headers: {
        Authorization: `Token ${store.state.user.token}`,
      },
    };

    async function goToUsersProfile(username) {
      const other = await axios
        .get(
          `http://ec2-15-228-101-219.sa-east-1.compute.amazonaws.com/api/accounts/${username}/`,
          config
        )
        .then((response) => response.data)
        .then((data) => data);

      store.dispatch("setOther", other);
      router.push("/profile");
    }

    return {
      // props,
      // users,
      goToUsersProfile,
      store,
    };
  },
};
</script>

<style lang="scss" scoped>
.users_wrapper {
  position: relative;
  top: 6px;
  margin: 2vw;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  .user_avatar_miniature {
    width: 4vw;
    cursor: pointer;
    margin: 0;
  }
}
</style>
