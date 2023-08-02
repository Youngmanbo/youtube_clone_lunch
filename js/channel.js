

// channel request 함수
async function getChannel(param = 'oreumi') {
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
    if (id == undefined){
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
    video.setAttribute('autoplay', "");
    video.addEventListener('click', goVideo);

    let infoDiv = document.createElement('div');
    infoDiv.className = 'video-info'
    infoDiv.onclick = movePage;
    info.value = info.video_channel;

    let titleTag = document.createElement('h3');
    titleTag.innerText = info.video_title;
    titleTag.value = info.video_channel;

    let container = document.createElement('div');
    container.className = 'view-date';

    let viewTag = document.createElement('span');
    viewTag.innerText = "조회수 " + info.views + "회" + ' . ';
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
async function getChannelInfo(res = 'oreumi') {
    console.log(res);


    if (res == undefined){
        res = 'oreumi';
    }
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
    console.log(parent);
    let channelCover = document.querySelector("#channel-cover > img");
    channelCover.src = response.channel_banner;

    let channelProfile = document.querySelector('#channel-title-profile > .profile-container > img');
    channelProfile.src = response.channel_profile;

    let infoDiv = document.createElement('div');
    infoDiv.className = "channel-infos";

    let subs = document.createElement("span")
    let channelName = document.createElement("h2");
    subs.innerText = response.subscribers + " 구독";

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

function nav_display() {
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    let navStyle = getComputedStyle(nav).display;

    let idChannelCover = document.getElementById('channel-cover');
    let idChannel = document.getElementById('channel');
    let idChannelFooterVideoList = document.getElementById('channel-footer-videoList');

    let classChannelBodyContainer = document.getElementsByClassName('channel-body-container')[0];

    if (navStyle == "none") {
        nav.style.display = "block";
        // 다른부분들 밀기
        idChannelCover.style.marginLeft = "240px";
        idChannel.style.marginLeft = "240px";
        idChannelFooterVideoList.style.paddingLeft = "255px";
        classChannelBodyContainer.style.paddingLeft = "250px";
    } else {
        nav.style.display = "none";
        // 다른부분들 밀기
        idChannelCover.style.marginLeft = "0px";
        idChannel.style.marginLeft = "0px";
        idChannelFooterVideoList.style.paddingLeft = "15px";
        classChannelBodyContainer.style.paddingLeft = "10px";

    }
}

//도메인에서 paremeter 추출 함수

function getParam(){
    let result = {};
    let url = window.location.href;
    let params = url.split("?")[1];
    if (params == undefined){
        return 'oreumi';
    }
    params = params.split("&");
    params.forEach( e =>{
        let param = e.split('=');
        console.log(param);
        result[param[0]] = param[1];
    })
    return result;

}
//---------- 비디오 누루면 비디오 채널로 이동------------
function goVideo(e) {
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("html")[0];
    newUrl = split_url + "html/video.html";
    let temp = e.target.currentSrc.split('_');
  
    let idx = temp[1].split('.');
    newUrl += `?id=${idx[0]}`;
    window.location.replace(newUrl);
  }


function go_home(){
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("html")[0];
    newUrl = split_url + "html/home.html";
    window.location.replace(newUrl);
}

//window.onload == 브라우저의 html이 로드 된다음에 function 아래를 실행해라.



let params = getParam();
let channel = getChannel(params['channel']);
let videoInfos = getVideoInfoList(channel);

getChannelInfo(params['channel']).then(async (chinfo) => {
    renderChannelInfo(chinfo);
})

getVideo(params['id']).then(async res => {
    renderChannelVideo(res);
})

videoInfos.then(async data => {
    let promises = data.map(async el => {
        return await renderVideo(el);
    });
    Promise.all(promises);
})

let home = document.querySelector(".links");
home.addEventListener('click', go_home);


// 메뉴 클릭시 보이고 안보이게

imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);


