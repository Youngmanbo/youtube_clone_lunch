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