// ulr을 제외한 비디오 정보들
function getVideoInfo(n){    // n번째 동영상 info 가져오기
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `<http://oreumi.appspot.com/video/getVideoInfo?vidie_id=${n}>`, true);
    xhr.onreadystatechange = function(){
        if (xhr.status === 200 && xhr.readyState === 4){
            // 값을 잘 받아왔을 때
            return JSON.parse(xhr.responseText) ;
        }else{
            // 요청이 실패한 경우
            console.error('Error:', xhr.status);
        }
    };
}

let videoUrls=[];
//url받아오기
function getVideoUrl(n) {
  // n번째 동영상 info 가져오기
  const url = new XMLHttpRequest();
  url.open('GET', `http://oreumi.appspot.com/video/getVideoInfo?video_id=${n}`, true);
  url.onreadystatechange = function() {
    if (url.readyState === 4) {
      if (url.status === 200) {
        // 값을 잘 받아왔을 때
        var videoInfo = JSON.parse(url.responseText);
        videoUrls.push(videoInfo);
        //console.log(videoInfo);
      } else {
        // 요청이 실패한 경우
        console.error('Error:', url.status);
      }
    }
  };
  url.send();
}
//console.log(videoUrls);


// 비디오 넣을 태그 자리 불러옴
const videoContainer=document.querySelector(".body-container");

let videoList = [];

function renderVideoList() {
  videoContainer.innerHTML = ''; // 기존 비디오 목록 초기화
  videoList.forEach((video, index) => {
    // videoUrls받아오는거 아직안됨
    // let videoUrls=getVideoUrl(index);
    // console.log(videoUrls);
    
    let videoElement = document.createElement('video');
    videoElement.src = video.videoUrl;
    videoElement.controls = true;

    let titleElement = document.createElement('h2');
    titleElement.textContent = video.title;

    let descriptionElement = document.createElement('p');
    descriptionElement.textContent = video.description;

    
    videoContainer.appendChild(titleElement);
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(descriptionElement);

  });
}

function getVideoList() {
  const xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function() {
    if (xhr.status === 200 && xhr.readyState === 4) {
      // 값을 잘 받아왔을 때
      videoList = JSON.parse(xhr.responseText);
      renderVideoList();
    } else {
      // 요청이 실패한 경우
      console.error('Error:', xhr.status);
    }
  };

  xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoList', true);
  xhr.send(null);
}

async function getVideoList(){
  
}

window.onload = function(){ // (window == 브라우저) 기본적인 html이 다 로드되면 안에있는 함수를 실행하겠다는 뜻
  getVideoList();
  getVideoUrl(0); 
}