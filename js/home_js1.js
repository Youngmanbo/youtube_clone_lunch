async function getVideoInfoList(res) {


  return res.then(data => {
      const promises = data.map(async data => {
          return await getVideo(data.video_id);
      });
      return Promise.all(promises);

  });

}

async function getVideoList() {
  url = 'http://oreumi.appspot.com/video/getVideoList';
  const response = await fetch(url);
  return response.json();
}


async function getVideo(id) {
  const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
  const response = await fetch(url);
  return response.json();
}

// 동영상 데이터를 기반으로 동영상 아이템 엘리먼트를 생성하는 함수
async function createVideoItem(videoData, tags) {

  const videoContainer = document.querySelector(".body-container");

  tags.push(videoData.video_tag);

  const videoItem = document.createElement("div");
  videoItem.classList.add("video-item");
  videoItem.value = videoData.video_tag;
  const video = document.createElement("video");
  video.src = videoData.video_link;
  video.controls = true;
  video.preload = "metadata";
  video.poster = videoData.image_link;

  const videoInfoTag = document.createElement("div");
  videoInfoTag.calssName = 'video-infos'

  const title = document.createElement("h2");
  title.textContent = videoData.video_title;
  
  const channel = document.createElement("p");
  channel.textContent = videoData.video_channel;

  
  const views = document.createElement("p");
  views.textContent = `조회수: ${videoData.views}회`;


  videoItem.appendChild(video);
  videoInfoTag.appendChild(title);
  videoInfoTag.appendChild(channel);
  videoInfoTag.appendChild(views);
  videoInfoTag.addEventListener('click', (event) =>
    goChannel(event , videoData.video_channel )
  );
  videoItem.appendChild(videoInfoTag);
  video.addEventListener('click', goVideo);
  videoContainer.appendChild(videoItem)

}

function nav_display() {
  let nav = document.getElementsByClassName('channel-left-nav')[0];
  let navStyle = getComputedStyle(nav).display;

  let filter = document.getElementsByClassName("filter-lists")[0];
  let bodyContainer = document.getElementsByClassName("body-container")[0];
  if (navStyle == "none") {
    nav.style.display = "block";
    // 다른부분들 밀기
    filter.style.left = "240px";
    bodyContainer.style.marginLeft = "240px";
  } else {
    nav.style.display = "none";
    // 다른부분들 당겨오기
    filter.style.left = "0px";
    bodyContainer.style.marginLeft = "0px";
  }
}


// 비디오 클릭시 비디오 페이지로 이동
// ? 뒤에 idx값 넣어서 이동
function goVideo(e) {
  let curruntUrl = window.location.href;
  let split_url = curruntUrl.split("html")[0];
  newUrl = split_url + "html/video.html";
  let temp = e.target.currentSrc.split('_');

  console.log(e.target.currentSrc);
  console.log(temp);

  let idx = temp[1].split('.');
  newUrl += `?id=${idx[0]}`;
  window.location.replace(newUrl);
}

// 비디오 밑 텍스트 클릭시 channel로 이동
// id값으로 channel 넘김
function goChannel(e , videoChannel) {
  if(e.target == "video"){
    return;
  }
  let curruntUrl = window.location.href;
  let split_url = curruntUrl.split("html")[0];
  newUrl = split_url + "html/channel.html";
  newUrl += `?channel=${videoChannel}`;
  window.location.replace(newUrl);
}

//검색기능
function search(tags){
  const searchBtn = document.querySelector(".search > img");
  const searchInput = document.querySelector('#search-bar');
  searchBtn.addEventListener('click', ()=>{
    let inputValue = searchInput.value;

    videos = document.querySelectorAll(".video-item")
    let result = []

    const re = new RegExp(inputValue);

    for (var i = 0; i < videos.length; ++i) {
      var item = videos[i].value;
      item.foreach(e =>{
        if 
      })
    }
  })
}



let tags = [];

// 비디오 리스트 생성
getVideoInfoList(getVideoList()).then(async res =>{
  let promises = res.map(async el => {
      return await createVideoItem(el, tags);
  });
  Promise.all(promises);
})
search(tags);

// 메뉴 클릭시 보이고 안보이게
imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);

