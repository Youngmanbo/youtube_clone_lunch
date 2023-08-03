

// channel request 함수
async function getChannel(param) {
    Url = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=${param}`
    const response = await fetch(Url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

//videoInfo reqeust 함수

async function getVideo(id = 0) {
    if (id == undefined) {
        id = 0;
    }
    url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
    const response = await fetch(url);
    return response.json();
}

//videoList requests 함수

async function getVideoList() {
    url = 'http://oreumi.appspot.com/video/getVideoList';
    const response = await fetch(url);
    return response.json();
}

// 조회수를 간략하게 표현하는 함수
function formatViews(views) {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views;
  }

//videoInfoList 의 video_id값을 추출하여 한꺼번에 requests를 보내는 함수

async function getVideoInfoList(res) {


    return res.then(data => {
        const promises = data.map(async data => {
            return await getVideo(data.video_id);
        });
        return Promise.all(promises);

    });

}

//channel videoList html 생성 함수

async function renderVideo(info) {
    let parent = document.querySelector('#channel-footer-videoList');
  
    // 비디오 컨테이너
    let videoDiv = document.createElement('div');
    videoDiv.className = 'video-container';
  
    let video = document.createElement('video');
    video.src = info.video_link;
    video.poster = info.image_link;
    video.setAttribute('controls', "");

    let infoDiv = document.createElement('div');
    infoDiv.className = 'video-info';
    infoDiv.onclick = movePage;
    info.value = info.video_channel;
  
    let titleTag = document.createElement('h3');
    titleTag.innerText = info.video_title;
    titleTag.value = info.video_channel;
  
    let container = document.createElement('div');
    container.className = 'view-date';
  
    // 조회수를 간략하게 표시
    let viewTag = document.createElement('span');
    viewTag.innerText = "조회수 " + formatViews(info.views) + ' . ';
    viewTag.value = info.video_channel;
  
    let date = document.createElement('span');
    date.innerText = info.upload_date;
    date.value = info.video_channel;
  
    videoDiv.appendChild(video);
  
    infoDiv.appendChild(titleTag);
    container.appendChild(viewTag);
    container.appendChild(date);
    infoDiv.appendChild(container);
  
    videoDiv.appendChild(infoDiv);
    parent.appendChild(videoDiv);
  }


// channelInfo requests 함수
async function getChannelInfo(res) {
    console.log(res);


    Url = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${res}`
    const response = await fetch(Url, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
        }
    });
    return response.json();

}


// 채널 정보 html 생성 및 수정 함수
async function renderChannelInfo(response) {

    let parent = document.querySelector('#channel-title-profile');
  
    let channelCover = document.querySelector("#channel-cover > img");
    channelCover.src = response.channel_banner;
  
    let channelProfile = document.querySelector('#channel-title-profile > .profile-container > img');
    channelProfile.src = response.channel_profile;
  
    let infoDiv = document.createElement('div');
    infoDiv.className = "channel-infos";
  
    let subs = document.createElement("span");
    let channelName = document.createElement("h2");
    let totalViews = response.videos.reduce((acc, video) => acc + video.views, 0);
  
    subs.innerText = formatViews(response.subscribers) + " 구독, 총 조회수 " + formatViews(totalViews);
    channelName.innerText = response.channel_name;

    infoDiv.appendChild(channelName);
    infoDiv.appendChild(subs);

    parent.appendChild(infoDiv);

}

const button = document.getElementById('channel-subscribes-btn');

button.addEventListener('click', () => {
  if (button.classList.contains('subscribed')) {
    button.textContent = 'SUBSCRIBE';
    button.classList.remove('subscribed');
  } else {
    button.textContent = 'SUBSCRIBING';
    button.classList.add('subscribed');
  }
});

// 메인비디오 생성 함수
async function renderChannelVideo(res) {
    let parent = document.querySelector(".channel-body-container")
    let html = `
        <div class='channel-mainVideo'>
            <video src=${res.video_link} poster=${res.image_link} controls></video>
        </div>
        <div class='channel-mainInfo'>
            <h3>${res.video_title}</h3><br></br>
            <h4>${res.views} 조회수</h4><br></br>
            <h4>${res.video_detail}</h4>
        </div>    
    `
    parent.innerHTML = html;
}

// 채널 페이지 이동 

function movePage(e) {
    let curruntUrl = window.location.href;
    let sp = curruntUrl.split("?");
    newUrl = sp[0] + '?' + `channel=${e.target.value}`;
    window.location.replace(newUrl);
}



//window.onload == 브라우저의 html이 로드 된다음에 function 아래를 실행해라.

window.onload = function () {
    let channel = getChannel(getParam());
    let videoInfos = getVideoInfoList(channel);
    // let channelInfo = getChannelInfo(getParam());

    

    getChannelInfo(getParam()).then(async (channelInfo) => {
        renderChannelInfo(channelInfo);
    })

    getVideo(0).then(async res => {
        renderChannelVideo(res);
    })

    videoInfos.then(async data => {
        let promises = data.map(async el => {
            return await renderVideo(el);
        });
        Promise.all(promises);
    })

}


// 메뉴 클릭시 보이고 안보이게

imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);

function nav_display() {
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    let navStyle = getComputedStyle(nav).display;

    let idChannelCover = document.getElementById('channel-cover');
    let idChannel = document.getElementById('channel');
    let idChannelFooterVideoList = document.getElementById('channel-footer-videoList');

    let classChannelBodyContainer = document.getElementsByClassName('channel-body-container')[0];
    let playListBox = document.getElementById('playlist_box');

    idChannelCover.style.marginLeft = "240px";
    idChannel.style.marginLeft = "240px";
    playListBox.style.paddingLeft = "255px";
    classChannelBodyContainer.style.paddingLeft = "250px";
}

function nav_display() {
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    let navStyle = getComputedStyle(nav).display;

    let idChannelCover = document.getElementById('channel-cover');
    let idChannel = document.getElementById('channel');

    let classChannelBodyContainer = document.getElementsByClassName('channel-body-container')[0];
    let playListBox = document.getElementById('playlist_box');

    if (navStyle == "none") {
        nav.style.display = "block";
        // 다른부분들 밀기
        idChannelCover.style.marginLeft = "240px";
        idChannel.style.marginLeft = "240px";
        playListBox.style.paddingLeft = "255px";
        classChannelBodyContainer.style.paddingLeft = "250px";
    } else {
        nav.style.display = "none";
        // 다른부분들 밀기
        idChannelCover.style.marginLeft = "0px";
        idChannel.style.marginLeft = "0px";
        playListBox.style.paddingLeft = "15px";
        classChannelBodyContainer.style.paddingLeft = "10px";

    }
}

// channel 매개변수 값 가져오기
function getParam(){
    let result = {};
    let url = new URL(window.location.href);
    let param = url.searchParams;
    return  param.get('channel');

}