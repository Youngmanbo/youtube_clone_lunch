


// 반응형 구독버튼
const buttons = document.getElementsByClassName('Subscribes-Btn');

for (const button of buttons) {
  button.addEventListener('click', () => {
    if (button.classList.contains('subscribed')) {
      button.textContent = 'SUBSCRIBES';
      button.classList.remove('subscribed');
    } else {
      button.textContent = 'SUBSCRIBING';
      button.classList.add('subscribed');
    }
  });
}


//클릭하면 메인영상으로 변경

function changeMain(e){

    e.preventDefault(); // 재생 금지

    window.scrollTo(0,0); //브라우저 최상단으로 이동

    let currentSrc = e.target.src;
    let currentImg = e.target.poster;
    
    let mainVideoTag = document.querySelector(".play-video > video")
    let tempSrc = mainVideoTag.src;
    let tempImg = mainVideoTag.poster;

    mainVideoTag.setAttribute('src', currentSrc);
    mainVideoTag.setAttribute('poster', currentImg);
    mainVideoTag.play();
    mainVideoTag.muted = false;

    e.target.setAttribute('src', tempSrc);
    e.target.setAttribute('poster', tempImg);
}

function goChannel(e, videoChannel, videoId) {
    if (e.target == "video") {
      return;
    }
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("youtube_clone_lunch")[0];
    newUrl = split_url + 'youtube_clone_lunch/html/channel.html';
    newUrl += `?channel=${videoChannel}`;
    newUrl += `&id=${videoId}`
    window.location.href = newUrl;
}

//<---------------------------함수실행부------------------------------------->

(async () => {
    let param = getParam();
    let getMainVideo = await saveDataToSessionStorage("video_id_"+param['id'], getVideo, param['id']);
       
    await renderChannelVideo(getMainVideo);
    
    let channelInfo = await saveDataToSessionStorage("videoChannelInfo", getChannelInfo, param['channel']); 

    await renderChannelInfo(channelInfo);

    let channel = await saveDataToSessionStorage("videoChannel", getChannel, param['channel']);
    let vList = await saveDataToSessionStorage("videoVideoList", getVideoList);
    let videoInfos = await saveDataToSessionStorage("videoVideoInfos", getVideoInfoList, channel);

    await createBtnEvent();

    let responseData = [vList, getMainVideo.video_tag, getMainVideo.video_id];
    let filteredVideoList = await saveDataToSessionStorage("filter_"+getMainVideo.video_title, calculateVideoSimilarities, responseData);
    for(i=0; i<5; i++){
        let filterVideo = await saveDataToSessionStorage("video_id_"+filteredVideoList[i].video_id, getVideo, filteredVideoList[i].video_id);
        await renderVideo(filterVideo, param['id'])
    } 


})();



// pip 버튼 이벤트

async function createBtnEvent(){

    try{
        let pipBtn = document.querySelector('.pip-btn-video');
        let videoMain = document.querySelector('#main-video');
    
        console.log(pipBtn);
    
        pipBtn.addEventListener('click', async e => {
        e.disabled = true;
        if (videoMain !== document.pictureInPictureElement){
            await videoMain.requestPictureInPicture();
            videoMain.muted = false;
            await videoMain.play();
        }else{
            videoMain.muted = true;
        await document.exitPictureInPicture();
        }
    })
    }catch (error){
        console.log(error);
    }
    }




//햄버거 클릭시 사이드바 
function nav_display() {
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    let navStyle = getComputedStyle(nav).display;

    if (navStyle == "none") {
      nav.style.display = "block";
      nav.style.zIndex = 1000; 
    } else {
      nav.style.display = "none";
    }
  }
// 메뉴 클릭시 보이고 안보이게
imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);
