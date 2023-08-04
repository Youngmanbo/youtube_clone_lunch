let channelTitleImg = "";

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

async function getVideo(id) {
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

    videoDiv.addEventListener('click', (event) =>
        goVideo(event, info.video_channel, info.video_id)
    );
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
    channelTitleImg = response.channel_profile;

    let infoDiv = document.createElement('div');
    infoDiv.className = "channel-infos";

    let subs = document.createElement("span");
    let channelName = document.createElement("h2");
    // let totalViews = response.videos.reduce((acc, video) => acc + video.views, 0);

    subs.innerText = formatViews(response.subscribers) + " 구독";//+ formatViews(totalViews);
    channelName.innerText = response.channel_name;

    infoDiv.appendChild(channelName);
    infoDiv.appendChild(subs);

    parent.appendChild(infoDiv);

}

const button = document.getElementById('channel-subscribes-btn');

button.addEventListener('click', () => {
    buttonText = button.innerHTML;
    if(buttonText == 'SUBSCRIBES'){
        button.innerHTML = 'SUBSCRIBING';
        let sub = document.getElementById('escape').parentElement;
        let aTag = document.createElement('a');
        aTag.className = 'links';
        let imgTag = document.createElement('img');
        imgTag.src = channelTitleImg;
        aTag.appendChild(imgTag);
        aTag.append(getParam());
        aTag.setAttribute('id','newsubs');
        sub.parentNode.insertBefore(aTag, sub.nextSibling);
    }else{
        button.innerHTML = 'SUBSCRIBES';
        document.getElementById('newsubs').remove();
    }
});

// 메인비디오 생성 함수
async function renderChannelVideo(res) {
    let parent = document.querySelector(".channel-body-container")
    let formatview = formatViews(res.views);
    let link = res.video_link + '?autoplay=1&loop=1';

    let html = `
        <div class='channel-mainVideo'>
            <video src=${link} poster=${res.image_link} id='channel-main-video-id' autoplay muted></video>
        </div>
        <div class='channel-mainInfo'>
            <h3>${res.video_title}</h3><br></br>
            <h4>${formatview} 조회수</h4><br></br>
            <h4>${res.video_detail}</h4>
        </div>    
    `
    parent.innerHTML = html;
    let mVideo = document.querySelector(".channel-mainVideo");
    console.log(res);
    mVideo.addEventListener('click', (e)=>{
        console.log(res.video_channel);
        goVideo(e, res.video_channel, res.video_id);
    })
}

// 채널 페이지 이동 

function movePage(e) {
    let curruntUrl = window.location.href;
    let sp = curruntUrl.split("?");
    newUrl = sp[0] + '?' + `channel=${e.target.value}`;
    window.location.href = newUrl;
}



//window.onload == 브라우저의 html이 로드 된다음에 function 아래를 실행해라.


let parameter = getParam();

let channel = getChannel(parameter);
let videoInfos = getVideoInfoList(channel);
// let channelInfo = getChannelInfo(getParam());


getChannelInfo(parameter).then(async (channelInfo) => {
    renderChannelInfo(channelInfo);
})

getChannel(parameter).then((videoList) => {      // 체널 중에 views 가장 높은 동영상 
    let mostView = videoList.reduce((prev, curr) => {
        return prev.views > curr.views ? prev : curr;
    });
    getVideo(mostView.video_id).then(async res => {
        renderChannelVideo(res);
    });
})

videoInfos.then(async data => {
    let promises = data.map(async el => {
        return await renderVideo(el);
    });
    Promise.all(promises);
})




// 메뉴 클릭시 보이고 안보이게

imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);


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
function getParam() {
    let url = new URL(window.location.href);
    let param = url.searchParams;
    let parameter = param.get('channel');
    if (parameter == null || parameter == undefined) {
        parameter = 'oreumi';
    }
    return parameter;
}

//메인 동영상 클릭시 해당 video.html 이동

function goMainVideo(e) {
    let tagName = e.target.localName;
    if (tagName == 'video' || tagName == 'h3' || tagName == 'h4') {
        let curruntUrl = window.location.href;
        let split_url = curruntUrl.split("html")[0];
        newUrl = split_url + "html/video.html";
        let videoTag = document.getElementById('channel-main-video-id');
        let temp = videoTag.currentSrc.split('_')
        let idx = parameter['id'];
        newUrl += `?id=${idx}`;
        newUrl += `&channel=${parameter['channel']}`;
        window.location.href = newUrl;
    }
}


function goVideo(event, videoChannel, videoId) {
    let tagName = event.target.localName;
    if (tagName == 'video' || tagName == 'h3' || tagName == 'span') {
        let curruntUrl = window.location.href;
        let split_url = curruntUrl.split("html")[0];
        newUrl = split_url + "html/video.html";
        newUrl += `?channel=${videoChannel}`;
        newUrl += `&id=${videoId}`;
        window.location.href = newUrl;
    }
}


document.getElementById('playAll-btn').addEventListener('click', playAll);

function playAll() {
    let videoChannel = getParam();
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("html")[0];
    newUrl = split_url + "html/video.html";
    let videoTag = document.getElementsByClassName('video-container')[0].childNodes[0];
    let temp = videoTag.currentSrc.split('_')
    let idx = temp[1].split('.');
    newUrl += `?channel=${videoChannel}`;
    newUrl += `&id=${idx[0]}`;
    window.location.href = newUrl;
}