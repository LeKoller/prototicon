import axios from "axios";
import store from "./store";

export const config = {
  headers: {
    Authorization: `Token ${store.state.user.token}`,
  },
};

export async function getTimeline() {
  await axios
    .get(
      `http://0.0.0.0:8000/api/contents/${store.state.user.username}/`,
      config
    )
    .then((response) => response.data)
    .then((data) => {
      store.dispatch("setTimeline", data.contents);
    });
}

export function hideDeletedContent(content_id, reset) {
  store.dispatch("setContentTitleEmpty", content_id);
  getTimeline();

  reset.value++;
}

export async function deleteContent(content_id, reset) {
  await axios
    .delete(`http://0.0.0.0:8000/api/contents/${content_id}/`, config)
    .then((response) => response.data)
    .then((data) => console.log(data));

  hideDeletedContent(content_id, reset);
}
