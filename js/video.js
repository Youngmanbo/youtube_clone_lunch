

// channel request 함수
async function getChannel(param='oreumi'){
    Url = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=${param}`
    const response = await fetch(Url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

//videoInfo reqeust 함수

async function getVideo(id=0){
    url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
    const response = await fetch(url);
    return response.json();
}

//videoList requests 함수

// async function getVideoList(){
//     url = 'http://oreumi.appspot.com/video/getVideoList';
//     const response = await fetch(url);
//     return response.json();
// }

async function getVideoList(){
    const url = 'http://oreumi.appspot.com/video/getVideoList';
    const response = await fetch(url);
    const videoList = await response.json();

    // index를 기준으로 오름차순으로 정렬
    videoList.sort((a, b) => a.index - b.index);

    return videoList;
}


// function renderChannel


//videoInfoList 의 video_id값을 추출하여 한꺼번에 requests를 보내는 함수

async function getVideoInfoList(res){

    
    return res.then(data =>{
        const promises = data.map(async data => {
           return await getVideo(data.video_id);
        });
        return Promise.all(promises);

    });
    
}

//channel videoList html 생성 함수


function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views;
}


async function renderVideo(info, id){

    //리스트 가져올때 index0번 빼고불러오는거 잠시 보류
    // let id = window.location.href.split("?")[1]['video_id'];

     if (id !=info.video_id){ 

        let parent = document.querySelector('.right-sidebar');
        
        // 비디오 컨테이너
    
        let videoDiv = document.createElement('div');
        videoDiv.className = 'side-video-list';
        videoDiv.addEventListener('click', (e)=>{
            changeMain(e);
        });
        
        let video = document.createElement('video');
        video.src=info.video_link;
        video.poster = info.image_link;
        video.setAttribute('controls', "");
        // video.setAttribute('autoplay', "");
    
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
        let formatView = formatViews(info.views);
        viewTag.innerText = "조회수 " + formatView+ "회" + ' . ';
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
}


// channelInfo requests 함수
async function getChannelInfo(res='oreumi'){
  
    Url = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${res}`
    const response = await fetch(Url,{
        method: 'POST',
        headers: {
            'accept': 'application/json',
        }
    });
    return response.json();
    
}

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

// 채널 정보 html 생성 및 수정 함수
async function renderChannelInfo(response){

    let detail = "식사조 화이팅!"
    let sub = formatViews(response.subscribers) + ' SUBSCRIBER';
    let html = `
        <div class="info-channel">
            <img src="${response.channel_profile}" alt="">
            <div class="info-channel-master">
                <p>${response.channel_name}</p>
                <p>${sub}</p>
            </div>
        </div>
        <div class="info-channel-info">
            ${detail}
        </div>
    `;
    let parent = document.querySelector('.user-logo-info');
    parent.innerHTML = html;

}

// 메인비디오 생성 함수
async function renderChannelVideo(res){
    let parent = document.querySelector(".play-video-container")
    let formatView = formatViews(res.views);

    let html = `
        <div class='play-video'>
            <video src=${res.video_link} poster=${res.image_link} controls></video>
        <div>
        <div class='video-mainInfo'>
            <h3>${res.video_title}</h3><br>
            <h6>${formatView} ${res.upload_date}</h6>
        </div>
        `
        parent.innerHTML=html;
}

// 채널 페이지 이동 

function movePage(e){
    let curruntUrl = window.location.href;
    let sp = curruntUrl.split("?");
    newUrl = sp[0] + '?' + `channel=${e.target.value}`;
    window.location.href = newUrl;
}


function getParam(){
    let result = {};
    let url = window.location.href;
    let params = url.split("?")[1];
    if (params == undefined){
        return '0';
    }
    params = params.split("&");
    params.forEach( e =>{
        let param = e.split('=');
        result[param[0]] = param[1];
    })
    return result;

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

    e.target.setAttribute('src', tempSrc);
    e.target.setAttribute('poster', tempImg);
}




//<---------------------------함수실행부------------------------------------->


let param = getParam();
let channel = getChannel(param['channel']);
// let videoList = getVideoList();
let videoInfos = getVideoInfoList(channel);
let channelInfo = getChannelInfo(param['channel']); 


//메인영상 하나만 호출
getVideo(param['id']).then(async res => {
    renderChannelVideo(res);
})

videoInfos.then(async data=>{
    let promises = data.map(async el => {
        return await renderVideo(el, param['id']);
    });
    Promise.all(promises);
})

channelInfo.then(async data => renderChannelInfo(data));
















