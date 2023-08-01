

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

async function renderVideo(info){

    //리스트 가져올때 index0번 빼고불러오는거 잠시 보류
    // let id = window.location.href.split("?")[1]['video_id'];

    // if (id !=info.video_id){   }

        let parent = document.querySelector('.right-sidebar');
        
        // 비디오 컨테이너
    
        let videoDiv = document.createElement('div');
        videoDiv.className = 'side-video-list';
        
        let video = document.createElement('video');
        video.src=info.video_link;
        video.poster = info.image_link;
        video.setAttribute('controls', "");
    
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
        viewTag.innerText = "조회수 " + info.views+ "회" + ' . ';
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


// 채널 정보 html 생성 및 수정 함수
async function renderChannelInfo(response){

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

// 메인비디오 생성 함수
async function renderChannelVideo(res){
    let parent = document.querySelector(".play-video-container")
    let html = `
        <div class='play-video'>
            <video src=${res.video_link} poster=${res.image_link} controls></video>
        <div>
        <div class='video-mainInfo'>
            <h3>${res.video_title}</h3><br>
            <h6>${res.views} ${res.upload_date}</h6>
        </div>
        `
        parent.innerHTML=html;
}

// 채널 페이지 이동 

function movePage(e){
    let curruntUrl = window.location.href;
    let sp = curruntUrl.split("?");
    newUrl = sp[0] + '?' + `channel=${e.target.value}`;
    window.location.replace(newUrl);
}



//window.onload == 브라우저의 html이 로드 된다음에 function 아래를 실행해라.

window.onload = function(){ 
    let channel = getChannel();
    // let videoList = getVideoList();
    let videoInfos = getVideoInfoList(channel);
    let channelInfo = getChannelInfo(); 
    
    //메인영상 하나만 호출
    getVideo(0).then(async res => {
        renderChannelVideo(res);
    })

    videoInfos.then(async data=>{
        let promises = data.map(async el => {
            return await renderVideo(el);
        });
        Promise.all(promises);
    })

}


















