// 동영상 정보를 직접 가져와 동영상 컨테이너에 표시하는 함수
async function populateVideoContainer() {
  const response = await fetch("http://oreumi.appspot.com/video/getVideoList");
  const data = await response.json();
  const videoContainer = document.querySelector(".body-container");

  data.forEach((videoInfo) => {
    const videoItem = createVideoItem(videoInfo);
    videoContainer.appendChild(videoItem);
  });
}

// 동영상 데이터를 기반으로 동영상 아이템 엘리먼트를 생성하는 함수
function createVideoItem(videoData) {
  const videoItem = document.createElement("div");
  videoItem.classList.add("video-item");

  const video = document.createElement("video");
  video.src = videoData.video_link;
  video.controls = true;
  video.preload = "metadata";

  const thumbnail = document.createElement("img");
  video.poster = videoData.image_link;
  thumbnail.alt = videoData.video_title;
  

  const title = document.createElement("h2");
  title.textContent = videoData.video_title;

  const channel = document.createElement("p");
  channel.textContent = videoData.video_channel;

  const views = document.createElement("p");
  views.textContent = `조회수: ${videoData.views}회`;

  videoItem.appendChild(video);
  videoItem.appendChild(thumbnail);
  videoItem.appendChild(title);
  videoItem.appendChild(channel);
  videoItem.appendChild(views);
  console.log(videoData.image_link);
  return videoItem;
  
}

// 페이지 로드 시 동영상 컨테이너를 채우는 함수를 호출합니다.
document.addEventListener("DOMContentLoaded", populateVideoContainer);
