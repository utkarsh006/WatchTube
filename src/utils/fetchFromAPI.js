import axios from "axios";
import { categories } from "./constants";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const apiKey = process.env.REACT_APP_APIKEY;

const options = {
  method: "GET",
  params: { part: "snippet", key: apiKey, maxResults: 10 },
};

const fetchFromAPI = async (url, pageToken) => {
  const options = {
    method: "GET",
    params: { part: "snippet", key: apiKey, maxResults: 10 },
  };
  if (pageToken) options.params.pageToken = pageToken;
  const { data } = await axios.get(`${BASE_URL}/${url}`, options);
  return data;
};

const fetchVideos = async ({ request, pageToken,category }) => {
  const c = categories.find((item)=>item.name===category)
  const endPoint = `videos?regionCode=IN&chart=mostPopular&${
    c && c.categoryId && `videoCategoryId=${c.categoryId}`
  }`;
  console.log(endPoint)
  return fetchFromAPI(endPoint, pageToken);
};

const fetchChannel = async ({ params }) => {
  const { id } = params;
  const channelData = fetchFromAPI(`channels?part=snippet&id=${id}`);
  const videosData = fetchFromAPI(
    `search?channelId=${id}&part=snippet%2Cid&order=date`,
  );
  return { channelData, videosData };
};

const fetchSearch = async ({ searchTerm, pageToken }) => {
  const data = fetchFromAPI(`search?part=snippet&q=${searchTerm}`, pageToken);
  return data;
};

const videoDetails = async ({ params }) => {
  const { id } = params;
  const videoData = fetchFromAPI(`videos?part=snippet,statistics&id=${id}`);
  return { videoData };
};

const fetchSuggestionFromSearchText = async (q, signal) => {
  const options = {
    method: "GET",
    params: { part: "snippet", q, key: apiKey },
    headers: {
      Authorization: apiKey,
    },
    signal,
  };

  const result = await axios(`${BASE_URL}/search`, options);
  if(!result) throw new Error("Error")
  return result;
};

export {
  fetchSuggestionFromSearchText,
  videoDetails,
  fetchSearch,
  fetchChannel,
  fetchFromAPI,
  fetchVideos,
};
