import axios from "axios";
import store from "./store";
import config from "./views/Dashboard";

function getFollowingUsernames() {
  return store.state.user.following.map((user) => user.username);
}

export async function getTimeline() {
  const usernames = getFollowingUsernames();
  let contents = [];

  usernames.push(store.state.user.username);

  for (let username of usernames) {
    await axios
      .get(`http://0.0.0.0:8000/api/contents/${username}/`, config)
      .then((response) => response.data)
      .then((data) => {
        contents = [...contents, ...data.contents];
      });

    store.dispatch("unsetTimeline");
    store.dispatch("setTimeline", contents);
  }
}

export async function getOtherFeed() {
  const contents = await axios
    .get(
      `http://0.0.0.0:8000/api/contents/${store.state.other.username}/`,
      config
    )
    .then((response) => response.data)
    .then((data) => data.contents);

  store.dispatch("unsetTimeline");
  store.dispatch("setTimeline", contents);
}

export async function updateOther() {
  const other = await axios
    .get(
      `http://0.0.0.0:8000/api/accounts/${store.state.other.username}/`,
      config
    )
    .then((response) => response.data)
    .then((data) => data);

  store.dispatch("setOther", other);
}
