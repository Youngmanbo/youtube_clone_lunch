// 파라미터 함수
function getParam(){
    let result = {};
    let url = decodeURI(window.location.href);
    let params = url.split("?")[1];
    if (params === undefined){
        console.log('hello');
        return '0';
    }
    params = params.split("&");
    params.forEach( e =>{
        let param = e.split('=');
        result[param[0]] = param[1];
    })
    return result;

}

//---- 세션 스토리지에 api값 저장---------


async function getDataToSessionStorage(data){
    let result = sessionStorage.getItem(data);
    return result ? JSON.parse(result) : null;
}


async function saveDataToSessionStorage(data, func, factor=null){
    try{
        const result = await getDataToSessionStorage(data);
        
        if (result){
            return result
        }
        else{
            const result2 = factor ? await func(factor) : await func();
            sessionStorage.setItem(data, JSON.stringify(result2));
            return result2;
        }
        }catch(error){
            console.error("error  발생: ", error, data);
        }
}


let p = getParam();

if (p != 0){
    console.log(p['search']);
    search(p['search']);
}else{

    (async () => {
        let videoList = await saveDataToSessionStorage('videoList', getVideoList);
        let videoInfoList = await saveDataToSessionStorage('videoInfoList', getVideoInfoList, videoList);
    
        let promises = videoInfoList.map(async el => {
            return await createVideoItem(el);
        });
        
        await Promise.all(promises);
        
    })();


}

//------------------------------------------------------------------------------------------------
async function getVideoInfoList(res) {

     const promises = res.map(async data => {
        return await getVideo(data.video_id); 
      });
      return await Promise.all(promises);

  
  }
  
  async function getVideoList() {

    url = 'http://oreumi.appspot.com/video/getVideoList';
    const response = await fetch(url)
    return await response.json();
  
  }
  
  
  
  async function getVideo(id) {
    const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
    const response = await fetch(url);
    return await response.json();
  }
  
  
  
  // 채널 정보
  async function getChannelInfo(channelName) {


    let url = `http://oreumi.appspot.com/channel/getChannelInfo`;
  
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ video_channel: channelName }),
    });
  
    let channelData = await response.json();
  
    return channelData;
  }
  


  
  // 동영상 데이터를 기반으로 동영상 아이템 엘리먼트를 생성하는 함수
async function createVideoItem(videoData) {
  
    let channelInfo = await saveDataToSessionStorage(videoData.video_channel, getChannelInfo, videoData.video_channel);
  
    const videoContainer = document.querySelector(".body-container");
  
    const videoItem = document.createElement("div");
    videoItem.classList.add("video-item");
    videoItem.value = videoData.video_tag;
    videoItem.id = "video-item" + videoData.video_id;
  
    const video = document.createElement("video");
    video.src = videoData.video_link;
    video.preload = "metadata";
    video.poster = videoData.image_link;
    video.muted = true;
    const videoDiv = document.createElement("div");
    videoDiv.className = 'video-div';
  
    video.addEventListener("mouseover", e =>{
      video.play();
      video.setAttribute('controls',"");
    })
    video.addEventListener("mouseout", e => {
      video.removeAttribute("controls");
      video.pause();
    })
  
  
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
    let formatView = formatViews(videoData.views);
  
    views.textContent = `조회수: ${formatView}회`;
  
  
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
    video.addEventListener('click', (e) =>
      goVideo(e, videoData.video_channel)
    );
    videoContainer.appendChild(videoItem)
  
}
  
// 메뉴 클릭시 보이고 안보이게
imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);

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
  function goVideo(e, channel) {
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("index.html")[0];
    newUrl = split_url + "html/video.html";
    let temp = e.target.currentSrc.split('_');
  
    let idx = temp[1].split('.');
    newUrl += `?id=${idx[0]}`;
    newUrl += `&channel=${channel}`;
    window.location.href = newUrl;
  }
  
  // 비디오 밑 텍스트 클릭시 channel로 이동
  // id값으로 channel 넘김
  function goChannel(e, videoChannel, videoId) {
    if (e.target == "video") {
      return;
    }
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("index.html")[0];
    newUrl = split_url + "html/channel.html";
    newUrl += `?channel=${videoChannel}`;
    newUrl += `&id=${videoId}`
    window.location.href = newUrl;
  }  
  
  
  function go_home() {
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("html")[0];
    newUrl = split_url + "html/home.html";
    window.location.href = newUrl;
  }
  
  
  // ----------------------------------------------------------------------------
  
  function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views;
  }
  
// ----------------------검색 -------------------------------------------
let searchBtn = document.getElementsByClassName('search-icon')[0]; // 검색 버튼
let searchBox = document.getElementById('search-bar');  // 검색 창
searchBtn.addEventListener('click', search);
searchBox.addEventListener('keypress', enterSearch); // enter 시 search

async function search(text=null) {
    let searchText;
    if (text){
        searchText = text;
    }else{
        searchText = document.getElementById('search-bar').value.toLowerCase();
    }
  if (searchText == "") { // 검색하는게 text가 비어있을때
    return;
  } else {
    let videoList = await saveDataToSessionStorage("videoList", getVideoList);

    searchFilter(videoList, searchText);
  }
}

function searchFilter(videoList, searchText){
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
}


async function enterSearch(e) {  // 엔터키 검색
  searchText = document.getElementById('search-bar').value.toLowerCase();
  if (e.keyCode != 13) {  // 엔터키가 아니라면 exit
    return;
  }
  if (searchText == "") { // 검색하는게 text가 비어있을때
    return;
  } else {
    let videoList = await saveDataToSessionStorage("videoList", getVideoList);
    searchFilter(videoList, searchText);
  }
}


// 검색 후 동영상 추가
async function createVideosItem(videoDatas) {
  clear_videoList();
  let videolist = videoDatas.map(async (vid) =>
    await saveDataToSessionStorage(vid.video_id, getVideo, vid.video_id)
  );
  let videoInfoList = await Promise.all(videolist);

  videoInfoList.map(data => createVideoItem(data));
}

function clear_videoList() { //비디오들 화면 다 지우기
  let videoItems = document.getElementsByClassName('body-container')[0];
  while (videoItems.hasChildNodes()) {
    videoItems.removeChild(videoItems.firstChild);
  }
}
//--------------------------------------------------------------------------------------------