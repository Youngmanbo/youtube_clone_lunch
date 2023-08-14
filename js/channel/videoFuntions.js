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

// 채널 페이지 이동 

function movePage(e) {
    let curruntUrl = window.location.href;
    let sp = curruntUrl.split("?");
    newUrl = sp[0] + '?' + `channel=${e.target.value}`;
    window.location.href = newUrl;
}