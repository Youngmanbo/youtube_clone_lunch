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
  return await response.json();
}


async function getVideo(id) {
  const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
  const response = await fetch(url);
  return await response.json();
}


let channelCache = {};

// 채널 정보
async function getChannelInfo(channelName) {
  // 캐시에 채널 정보가 있는지 확인
  if (channelCache[channelName]) {
    return channelCache[channelName];
  }

  let url = `http://oreumi.appspot.com/channel/getChannelInfo`;

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_channel: channelName }),
  });

  let channelData = await response.json();

  // 캐시에 채널 정보 저장
  channelCache[channelName] = channelData;

  return channelData;
}


// 동영상 데이터를 기반으로 동영상 아이템 엘리먼트를 생성하는 함수
async function createVideoItem(videoData) {

  let channelInfo = await getChannelInfo(videoData.video_channel);

  const videoContainer = document.querySelector(".body-container");

  const videoItem = document.createElement("div");
  videoItem.classList.add("video-item");
  videoItem.value = videoData.video_tag;
  videoItem.id = "video-item" + videoData.video_id;

  const video = document.createElement("video");
  video.src = videoData.video_link;
  video.controls = true;
  video.preload = "metadata";
  video.poster = videoData.image_link;
  // video.setAttribute('autoplay', "");
  const videoDiv = document.createElement("div");
  videoDiv.className = 'video-div';

  const videoInfoTag = document.createElement("div");
  videoInfoTag.calssName = 'video-infos'

  const title = document.createElement("h2");
  title.textContent = videoData.video_title;

  const channelImgDiv = document.createElement("div");
  channelImgDiv.className = 'channel-img-div';
  const channelImg = document.createElement("img");
  channelImg.src = channelInfo.channel_profile;
  channelImg.classList.add('profile_channel_img');

  const channel = document.createElement("p");
  channel.textContent = videoData.video_channel;


  const views = document.createElement("p");
  views.textContent = `조회수: ${videoData.views}회`;


  videoItem.appendChild(video);
  videoInfoTag.appendChild(channelImgDiv);
  channelImgDiv.appendChild(channelImg);
  videoInfoTag.appendChild(videoDiv);
  videoDiv.appendChild(title);
  videoDiv.appendChild(channel);
  videoDiv.appendChild(views);
  videoInfoTag.addEventListener('click', (event) =>
    goChannel(event, videoData.video_channel, videoData.video_id)
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

  let idx = temp[1].split('.');
  newUrl += `?id=${idx[0]}`;
  window.location.replace(newUrl);
}

// 비디오 밑 텍스트 클릭시 channel로 이동
// id값으로 channel 넘김
function goChannel(e, videoChannel, videoId) {
  if (e.target == "video") {
    return;
  }
  let curruntUrl = window.location.href;
  let split_url = curruntUrl.split("html")[0];
  newUrl = split_url + "html/channel.html";
  newUrl += `?channel=${videoChannel}`;
  newUrl += `&id=${videoId}`
  window.location.replace(newUrl);
}

async function getSearchList(res, words) {


  return res.then(async data => {
    let filterData = data.filter = (d => {
      console.log(words);
      tags = d.video_tag;
      let flag = false;
      tags.forEach(e => {
        let re = new RegExp(e);
        if (words.math(re) != null) {
          flag = true;
        }
        return flag;
      })
    })
    console.log(data);
    console.log(filterData);
    let promises = filterData.map(async res => {
      return await getVideo(res.video_id);
    })
    Promise.all(promises);

  });

}


function go_home() {
  let curruntUrl = window.location.href;
  let split_url = curruntUrl.split("html")[0];
  newUrl = split_url + "html/home.html";
  window.location.replace(newUrl);
}


// ----------------------------------------------------------------------------

let tags = [];

// 비디오 리스트 생성
getVideoInfoList(getVideoList()).then(async res => {
  let promises = res.map(async el => {
    return await createVideoItem(el);
  });
  Promise.all(promises);
})

// 메뉴 클릭시 보이고 안보이게
imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);




// 검색기능

let searchBtn = document.getElementsByClassName('search-icon')[0]; // 검색 버튼
let searchBox = document.getElementById('search-bar');  // 검색 창
searchBtn.addEventListener('click', search);
searchBox.addEventListener('keypress', enterSearch); // enter 시 search

function search() {
  searchText = document.getElementById('search-bar').value.toLowerCase();
  if (searchText == "") { // 검색하는게 text가 비어있을때
    return;
  } else {
    getVideoList().then((videoList) => {
      let totalList = [];

      let searchTitle = videoList.filter((video) =>       // 제목검색
        video.video_title.toLowerCase().includes(searchText)
      );

      let searchChannel = videoList.filter((video) =>     // 체널명 검색
        video.video_channel.toLowerCase().includes(searchText)
      );

      let searchDetail = videoList.filter((video) =>      // 디테일 검색
        video.video_detail.toLowerCase().includes(searchText)
      );


      let searchTag = videoList.filter((video) => {       // 태그 검색
        for(let i = 0 ; i < video.video_tag.length ; i++){
          video.video_tag[i].toLowerCase().includes(searchText)
        }
      });
      // 태그 검색은 왜 안될까

      // 검색한 거 합치기
      totalList = totalList.concat(searchTitle);
      totalList = totalList.concat(searchChannel);
      totalList = totalList.concat(searchDetail);
      totalList = totalList.concat(searchTag);

      // 중복된 검색 지우기
      totalList = totalList.filter((item, pos) => totalList.indexOf(item) === pos);  


      if (totalList.length == 0) {
        alert('검색하신 내용과 일치하는 동영상이 존재하지 않습니다.');
      } else {
        createVideosItem(totalList);
        document.getElementById('search-bar').value = "";
      }
    });
  }
}

function enterSearch(e) {  // 엔터키 검색
  searchText = document.getElementById('search-bar').value.toLowerCase();
  if (e.keyCode != 13) {  // 엔터키가 아니라면 exit
    return;
  }
  if (searchText == "") { // 검색하는게 text가 비어있을때
    return;
  } else {
    getVideoList().then((videoList) => {
      let totalList = [];

      let searchTitle = videoList.filter((video) =>       // 제목검색
        video.video_title.toLowerCase().includes(searchText)
      );

      let searchChannel = videoList.filter((video) =>     // 체널명 검색
        video.video_channel.toLowerCase().includes(searchText)
      );

      let searchDetail = videoList.filter((video) =>      // 디테일 검색
        video.video_detail.toLowerCase().includes(searchText)
      );


      let searchTag = videoList.filter((video) => {       // 태그 검색
        for(let i = 0 ; i < video.video_tag.length ; i++){
          video.video_tag[i].toLowerCase().includes(searchText)
        }
      });
      // 태그 검색은 왜 안될까

      // 검색한 거 합치기
      totalList = totalList.concat(searchTitle);
      totalList = totalList.concat(searchChannel);
      totalList = totalList.concat(searchDetail);
      totalList = totalList.concat(searchTag);

      // 중복된 검색 지우기
      totalList = totalList.filter((item, pos) => totalList.indexOf(item) === pos);  


      if (totalList.length == 0) {
        alert('검색하신 내용과 일치하는 동영상이 존재하지 않습니다.');
      } else {
        Promise.all(createVideosItem(totalList));
        document.getElementById('search-bar').value = "";
      }
    });
  }
}

// 검색 후 동영상 추가
async function createVideosItem(videoDatas) {
  clear_videoList();
  let videolist = videoDatas.map((vid) =>
    getVideo(vid.video_id)
  );
  let videoInfoList = await Promise.all(videolist);

  for (let i = 0; i < videoInfoList.length; i++) {
    let videoData = videoInfoList[i];
    let channelInfo = await getChannelInfo(videoData.video_channel);
    const videoContainer = document.querySelector(".body-container");

    const videoItem = document.createElement("div");
    videoItem.classList.add("video-item");
    videoItem.value = videoData.video_tag;
    videoItem.id = "video-item" + videoData.video_id;

    const video = document.createElement("video");
    video.src = videoData.video_link;
    video.controls = true;
    video.preload = "metadata";
    video.poster = videoData.image_link;

    const videoDiv = document.createElement("div");
    videoDiv.className = 'video-div';

    const videoInfoTag = document.createElement("div");
    videoInfoTag.calssName = 'video-infos'

    const title = document.createElement("h2");
    title.textContent = videoData.video_title;

    const channelImgDiv = document.createElement("div");
    channelImgDiv.className = 'channel-img-div';
    const channelImg = document.createElement("img");
    channelImg.src = channelInfo.channel_profile;
    channelImg.classList.add('profile_channel_img');

    const channel = document.createElement("p");
    channel.textContent = videoData.video_channel;


    const views = document.createElement("p");
    views.textContent = `조회수: ${videoData.views}회`;


    videoItem.appendChild(video);
    videoInfoTag.appendChild(channelImgDiv);
    channelImgDiv.appendChild(channelImg);
    videoInfoTag.appendChild(videoDiv);
    videoDiv.appendChild(title);
    videoDiv.appendChild(channel);
    videoDiv.appendChild(views);
    videoInfoTag.addEventListener('click', (event) =>
      goChannel(event, videoData.video_channel, videoData.video_id)
    );
    videoItem.appendChild(videoInfoTag);
    video.addEventListener('click', goVideo);
    videoContainer.appendChild(videoItem)
  }

}

function clear_videoList() { //비디오들 화면 다 지우기
  let videoItems = document.getElementsByClassName('body-container')[0];
  while (videoItems.hasChildNodes()) {
    videoItems.removeChild(videoItems.firstChild);
  }
}



//필터 슬라이드 구글보고 한거 방법2
const filterLists=document.querySelector('.filter-box');//전체 슬라이드 컨테이너
const filterButtons=document.querySelectorAll('.filter-box button');//모든 슬라이드들
let currentIdx=0;//현재 슬라이드 인덱스
const slideCount=filterButtons.length; //슬라이드 개수
const leftBtn=document.querySelector('.prev')
const rightBtn=document.querySelector('.next')
const slideWidth=100; //한개의 슬라이드 넓이
const slideMargin=50; //슬라이드간의 margin값

//전체 슬라이드 컨테이너 넓이 설정
filterLists.style.width=(slideWidth + slideMargin) + slideCount;

function moveSlide(num) {
  filterLists.style.left = -num * 400 + 'px';
  currentIdx = num;
}

leftBtn.addEventListener('click', function () {
  /*첫 번째 슬라이드로 표시 됐을때는 
  이전 버튼 눌러도 아무런 반응 없게 하기 위해 
  currentIdx !==0일때만 moveSlide 함수 불러옴 */

  if (currentIdx !== 0) moveSlide(currentIdx - 1);
});

rightBtn.addEventListener('click', function () {
  /* 마지막 슬라이드로 표시 됐을때는 
  다음 버튼 눌러도 아무런 반응 없게 하기 위해
  currentIdx !==slideCount - 1 일때만 
  moveSlide 함수 불러옴 */
  if (currentIdx !== slideCount - 1) {
    moveSlide(currentIdx + 1);
  }
});



//필터 슬라이드 방법1 - 작동안함 잠시 보류
// let topMenuCurrentPosition = 0;
// // top-menu 슬라이드
// const slideWidth = 200; // 슬라이드 한번에 이동할 너비

// //오른쪽 화살표 클릭시 슬라이드가 왼쪽으로 이동
// function slideTags() {
//     const tagsContainer = document.querySelectorAll('.filters'); //필터 버튼들 전체
//     const containerWidth = document.querySelector('.filter-lists').offsetWidth; //슬라이드 가능 영역 너비
//     const minPosition = -containerWidth; // 슬라이드 최소 이동 범위 계산
//     //const top_menu_left_button=document.querySelector('.top-menu-icon-leftToRightBotton'); //이거 맞나?

//     if (topMenuCurrentPosition > minPosition + slideWidth + 72) {
//         topMenuCurrentPosition -= slideWidth; // 슬라이드를 왼쪽으로 이동시키기 위해 감소
//         //top_menu_left_button.style.visibility = 'visible';
//     }

//     tagsContainer.style.transform = `translateX(${topMenuCurrentPosition}px)`;
// }

// //왼쪽 화살표 클릭시 슬라이드가 오른쪽으로 이동
// function slideVideoCardsLeft() {
//     const tagsContainer = document.querySelector('.filters');
//     const maxPosition = 0; // 최대 이동 범위 (초기 위치)
    
//     if (topMenuCurrentPosition < maxPosition) {
//         topMenuCurrentPosition += slideWidth; // 슬라이드를 왼쪽으로 이동시키기 위해 증가
//     } else if (topMenuCurrentPosition >= 0){
//         top_menu_left_button.style.visibility = 'hidden';
//     }

//     tagsContainer.style.transform = `translateX(${topMenuCurrentPosition}px)`;
// }

// const top_menu_button = document.querySelector('.top-menu-icon-leftToRightBotton');
// if (top_menu_button) {
//     top_menu_button.addEventListener('click', slideTags);
// }

// let top_menu_left_button = document.querySelector('.top-menu-icon-leftBotton');
// if (top_menu_left_button) {
//     top_menu_left_button.addEventListener('click', slideVideoCardsLeft);
// }