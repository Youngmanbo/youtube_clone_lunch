// ulr을 제외한 비디오 정보들
// function getVideoInfo(n){    // n번째 동영상 info 가져오기
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', `<http://oreumi.appspot.com/video/getVideoInfo?vidie_id=${n}>`, true);
//     xhr.onreadystatechange = function(){
//         if (xhr.status === 200 && xhr.readyState === 4){
//             // 값을 잘 받아왔을 때
//             return JSON.parse(xhr.responseText) ;
//         }else{
//             // 요청이 실패한 경우
//             console.error('Error:', xhr.status);
//         }
//     };
// }

//url받아오기
function getVideoUrl(n) {
  // n번째 동영상 info 가져오기
  const url = new XMLHttpRequest();
  url.open('GET', `http://oreumi.appspot.com/video/getVideoInfo?video_id=${n}`, true);
  url.onreadystatechange = function() {
    if (url.status === 200 && url.readyState === 4) {
      // 값을 잘 받아왔을 때
      return JSON.parse(url.responseText);
    } else {
      // 요청이 실패한 경우
      console.error('Error:', url.status);
    }
  };
  url.send();
}
//console.log(videoUrls);


// 비디오 넣을 태그 자리 불러옴
const videoContainer=document.querySelector(".body-container");

let videoList = [];

function renderVideoList(videoList) {
  videoContainer.innerHTML = ''; // 기존 비디오 목록 초기화
  videoList.forEach((video, index) => {
    // videoUrls받아오는거 아직안됨
    // let videoUrls=getVideoUrl(index);
    // console.log(videoUrls);
    
    let videoElement = document.createElement('video');
    let videoInfoIndex = videoUrls[video.video_id];
    videoElement.src = videoInfoIndex.video_link;
    videoElement.controls = true;
    videoElement.poster = videoInfoIndex.image_link;

    let titleElement = document.createElement('h2');
    titleElement.textContent = videoInfoIndex.video_title;

    let descriptionElement = document.createElement('p');
    descriptionElement.textContent = videoInfoIndex.video_title;

    
    videoContainer.appendChild(titleElement);
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(descriptionElement);

  });
}

function makeurlList(videoList){
  videoList.forEach((video) => {
    const videoUrl = new XMLHttpRequest();
    let requestUrl = "http://oreumi.appspot.com/video/getVideoInfo?video_id=";
    requestUrl += video.video_id
    videoUrl.open('GET' , requestUrl, true);

    videoUrl.onreadystatechange = function() {
      if(videoUrl.status === 200 && video.readyState === 4) {
        let videoUrlList = JSON.parse(videoUrl.responseText);
        videoUrls[video.video_id] = videoUrlList;
      }else{
        console.error('Error:' , videoUrl.status);
      }
    };
    videoUrl.send();

  });
}

function getVideoList() {
  const temp = new XMLHttpRequest();
  temp.open('GET', 'http://oreumi.appspot.com/video/getVideoList', true);
  
  temp.onreadystatechange = function() {
    if (temp.status === 200 && temp.readyState === 4) {
      // 값을 잘 받아왔을 때
      videoList = JSON.parse(temp.responseText);
      makeurlList(videoList);
      renderVideoList(videoList);
    } else {
      // 요청이 실패한 경우
      console.error('Error:', temp.status);
    }
  };

  temp.send();
}

async function getVideoList(){
  
}

window.onload = function(){ // (window == 브라우저) 기본적인 html이 다 로드되면 안에있는 함수를 실행하겠다는 뜻
  getVideoList();
  // getVideoUrl(0); 
}