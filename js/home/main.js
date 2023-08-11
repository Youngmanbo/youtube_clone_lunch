var currentFilterIndex = 0;
const filtersPerPage = 5;

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
        let filterList = []
        videoInfoList.map(async data => {
            data.video_tag.forEach(a => filterList.push(a));
        })
        

        filterList = filterList.filter((item, idx) => filterList.indexOf(item) == idx)
        let filterParent = document.querySelector('.filter-lists');

        let filterAllBtn = document.createElement('button');
        filterAllBtn.className = 'filters';
        filterAllBtn.classList.add('fillter-all');
        filterAllBtn.innerText = "전체";

        let filterLeftBtn = document.querySelector('.filter-left-btn');
        filterLeftBtn.addEventListener('click',showPreviousFilters);

        filterParent.appendChild(filterAllBtn);

        filterList.forEach(e => createFilterBtn(e));

        let filterRightBtn = document.querySelector('.filter-right-btn');
        filterRightBtn.addEventListener('click', showNextFilters);

        document.querySelector('.fillter-all').addEventListener('click', allFilter);
        showFilters();
        
    })();


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
    video.className = "video-tiem-videoTag";
    video.src = videoData.video_link;
    video.preload = "metadata";
    video.poster = videoData.image_link;
    video.muted = true;
    const videoDiv = document.createElement("div");
    videoDiv.className = 'video-div';
    const videoTagDiv = document.createElement("div");
    videoTagDiv.className = 'videoTagDiv';

    pipBtn = document.createElement("button");
    pipBtn.className = "pip-btn";
    pipImg = document.createElement("img");
    pipImg.className = 'pip-img';
    pipImg.src = './imgs/Navigations/Icongaming.svg';
    pipBtn.appendChild(pipImg);

    pipBtn.addEventListener('click',async  e => {
      e.disabled = true;
      try{
        if (video !== document.pictureInPictureElement){
          await video.requestPictureInPicture();
          video.muted = false;
          await video.play();
        }else{
          video.muted = true;
          await document.exitPictureInPicture();
        }
      }catch (error){
        console.log(error);
      }finally {
        e.disabled = false;
      }
    })

    videoTagDiv.appendChild(video);
    videoTagDiv.appendChild(pipBtn);
  
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

    const date = videoData.upload_date;
  
    views.textContent = `조회수: ${formatView}회 . ${formatDate(date)}`;
  
    videoItem.appendChild(videoTagDiv);
    videoItem.appendChild(videoDiv);
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
  