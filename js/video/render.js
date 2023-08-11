


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

