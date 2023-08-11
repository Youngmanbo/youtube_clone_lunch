
  
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