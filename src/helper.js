import axios from "axios";
import store from "./store";
import config from "./components/ContentCard";

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

    store.dispatch("setTimeline", contents);
  }
}

export function hideDeletedContent(content_id) {
  store.dispatch("setContentTitleEmpty", content_id);
  getTimeline();
}

export async function deleteContent(content_id) {
  await axios
    .delete(`http://0.0.0.0:8000/api/contents/${content_id}/`, config)
    .then((response) => response.data)
    .then((data) => data);

  hideDeletedContent(content_id);
}
