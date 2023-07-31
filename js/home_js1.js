async function populateVideoContainer() {
  const videoIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; // 동영상 ID들을 가져와서 배열로 정의한다고 가정
  const videoContainer = document.querySelector(".body-container");

  for (const videoId of videoIds) {
    try {
      const videoInfo = await getVideo(videoId);
      const videoItem = createVideoItem(videoInfo);
      videoContainer.appendChild(videoItem);
    } catch (error) {
      console.error(`Error fetching video with ID ${videoId}:`, error);
    }
  }
}

async function getVideo(id) {
  const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
  const response = await fetch(url);
  return response.json();
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
  thumbnail.poster = videoData.image_link;
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
  console.log(videoData.image_link)
  return videoItem;
  
}
// 서치바 검색기능
const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
// 검색 경로 저장
let searchLink = "https://www.youtube.com/results?search_query=";

// 페이지 로드 시 동영상 컨테이너를 채우는 함수를 호출합니다.
document.addEventListener("DOMContentLoaded", populateVideoContainer);




// 메뉴 클릭시 보이고 안보이게
imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click' ,nav_display);

function nav_display(){  
  let nav = document.getElementsByClassName('channel-left-nav')[0];
  let navStyle = getComputedStyle(nav).display;

  let filter = document.getElementsByClassName("filter-lists")[0];
  let bodyContainer = document.getElementsByClassName("body-container")[0];
  if (navStyle == "none"){
      nav.style.display = "block";
      // 다른부분들 밀기
      filter.style.left = "240px";
      bodyContainer.style.marginLeft = "240px";
    }else{
      nav.style.display = "none";
      // 다른부분들 당겨오기
      filter.style.left = "0px";
      bodyContainer.style.marginLeft = "0px";
  }
}