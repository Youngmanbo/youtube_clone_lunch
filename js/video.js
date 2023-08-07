// 검색버튼 활성화
let inputText = document.getElementById("search-bar");
let searchBtn = document.querySelector(".search > img");

function deliverParamToHome(userInput){

    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("youtube_clone_lunch")[0];
    newUrl = split_url + "youtube_clone_lunch/index.html";
    newUrl += '?search=' + encodeURI(userInput);

    window.location.href = newUrl;

}


searchBtn.addEventListener('click', e => {

    let userInput = inputText.value
    deliverParamToHome(userInput);

})


inputText.addEventListener('keyup', enterSearch);

function enterSearch(e){
    let userInput = inputText.value;
    if (e.keyCode !== 13){
        return;
    }
    if (userInput == "") { // 검색하는게 text가 비어있을때
        return;
    } else {
        deliverParamToHome(userInput);
    }
}



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
        video.muted = true;

        videoDiv.addEventListener('mouseover', e =>{
            video.play();
            video.setAttribute('controls', "");
        })
        videoDiv.addEventListener('mouseout', e =>{
            video.removeAttribute('controls');
            video.pause();
        })

        let infoDiv = document.createElement('div');
        infoDiv.className = 'video-info'
        info.value = info.video_channel;
        infoDiv.addEventListener("click", (e)=>{
            goChannel(e, info.video_channel, info.video_id);
        })
        
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
        date.innerText = formatDate(info.upload_date);
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


//유사도 측정 결과 가져오기
async function getSimilarity(firstWord, secondWord) {
    const openApiURL = "http://aiopen.etri.re.kr:8000/WiseWWN/WordRel";
    const access_key = 'd447995d-daf4-43d8-aef6-647c28df46c9';

    let requestJson = {
      argument: {
        first_word: firstWord,
        second_word: secondWord,
      },
    };

    let response = await fetch(openApiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_key,
      },
      body: JSON.stringify(requestJson),
    });
    let data = await response.json();
    return data.return_object["WWN WordRelInfo"].WordRelInfo.Distance;
  }

//유사도

async function calculateVideoSimilarities(videoList, targetTagList, targetVideoId) {
    let filteredVideoList = [];

    for (let video of videoList) {
      let totalDistance = 0;
      let promises = [];

      for (let videoTag of video.video_tag) {
        for (let targetTag of targetTagList) {
          if (videoTag == targetTag) {
            promises.push(0);
          } else {
            promises.push(getSimilarity(videoTag, targetTag));
          }
        }
      }

      let distances = await Promise.all(promises);

      for (let distance of distances) {
        if (distance !== -1) {
          totalDistance += distance;
        }
      }

      if (totalDistance !== 0) {
        if (targetVideoId !== video.video_id) {
          filteredVideoList.push({ ...video, score: totalDistance });
        }
      }
    }

    filteredVideoList.sort((a, b) => a.score - b.score);

    filteredVideoList = filteredVideoList.map((video) => ({
      ...video,
      score: 0,
    }));
    console.log(filteredVideoList);
    return filteredVideoList;
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
                <p class='info-channel-name'>${response.channel_name}</p>
                <p class='info-channel-sub'>${sub}</p>
            </div>
        </div>
        <div class="info-channel-info">
            ${detail}
        </div>
    `;
    let parent = document.querySelector('.user-logo-info');
    let p = getParam();
    parent.innerHTML = html;
    parent.addEventListener('click', e =>{
        goChannel(e, response.channel_name, p['id']);
    })


}

// 메인비디오 생성 함수
async function renderChannelVideo(res){
    let parent = document.querySelector(".play-video-container")
    let formatView = formatViews(res.views);

    let html = `
        <div class='play-video' id='main-video-container'>
            <video id = 'main-video' src=${res.video_link} poster=${res.image_link} controls muted autoplay></video>
            <button class='pip-btn-video'><img src='../imgs/Navigations/Icongaming.svg'></button>
        <div>
        <div class='video-mainInfo' >
            <h3>${res.video_title}</h3><br>
            <h6>${formatView} ${formatDate(res.upload_date)}</h6>
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

//페이지 로드시 메인비디오 재생

// async function playVideo(){
//     let video = document.querySelector('#main-video');
//     console.log(video);
//     video.play();
// }




//<---------------------------함수실행부------------------------------------->




let param = getParam();
let channel = getChannel(param['channel']);
let vList = getVideoList();
let videoInfos = getVideoInfoList(channel);
let channelInfo = getChannelInfo(param['channel']); 


//메인영상 하나만 호출
getVideo(param['id']).then(async res => {
    await renderChannelVideo(res);
    await createBtnEvent();
    let filteredVideoList = vList.then(async vidList => {
        let targetVideoId= await res.video_id;
        let calcul = await calculateVideoSimilarities(vidList, res.video_tag, targetVideoId); 
        for(i=0; i<5; i++){
            getVideo(calcul[i].video_id).then(async res => {
                await renderVideo(res, param['id']);
            })
        } 

    })
})



// videoInfos.then(async data=>{
//     let promises = data.map(async el => {
//         return await renderVideo(el, param['id']);
//     });
//     Promise.all(promises);
// })

channelInfo.then(async data => renderChannelInfo(data));


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




//날짜 포맷
function formatDate(dateStr) {
    // 입력된 날짜 문자열을 파싱하여 Date 객체를 생성
    function parseDate(dateStr) {
        const parts = dateStr.split("/");
        // parts[0]은 년도, parts[1]은 월, parts[2]는 일
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    /** 두 날짜간 차이 계산 */
    function calculateDifference(currentDate, pastDate) {
        const diffMilliseconds = currentDate - pastDate;
        const diffSeconds = diffMilliseconds / 1000;
        const diffMinutes = diffSeconds / 60;
        const diffHours = diffMinutes / 60;
        const diffDays = diffHours / 24;
        const diffWeeks = diffDays / 7;
        const diffMonths = diffDays / 30.44; // 평균적으로 한 달은 30.44일로 계산

        if (diffMonths >= 1) {
            return Math.round(diffMonths) + "개월 전";
        } else if (diffWeeks >= 1) {
            return Math.round(diffWeeks) + "주 전";
        } else if (diffDays >= 1) {
            return Math.round(diffDays) + "일 전";
        } else if (diffHours >= 1) {
            return Math.round(diffHours) + "시간 전";
        } else {
            return Math.round(diffMinutes) + "분 전";
        }
    }

    const pastDate = parseDate(dateStr);
    const currentDate = new Date();
    return calculateDifference(currentDate, pastDate);
}










