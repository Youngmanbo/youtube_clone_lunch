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
            <h4>${formatview} 조회수 . ${formatDate(res.upload_date)}</h4><br></br>
            <h4>${res.video_detail}</h4>
        </div>    
    `
    parent.innerHTML = html;
    let mVideo = document.querySelector(".channel-mainVideo");
    mVideo.addEventListener('click', (e)=>{
        console.log(res.video_channel);
        goVideo(e, res.video_channel, res.video_id);
    })
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

//channel videoList html 생성 함수

async function renderVideo(info) {
    let parent = document.querySelector('#channel-footer-videoList');

    // 비디오 컨테이너
    let videoDiv = document.createElement('div');
    videoDiv.className = 'video-container';

    videoDiv.addEventListener('mouseover', e =>{
        video.play();
        video.setAttribute('controls', "");
    })
    videoDiv.addEventListener('mouseout', e =>{
        video.removeAttribute('controls');
        video.pause();
    })

    let video = document.createElement('video');
    video.src = info.video_link;
    video.poster = info.image_link;
    video.muted = true;
    

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
    date.innerText = formatDate(info.upload_date);
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