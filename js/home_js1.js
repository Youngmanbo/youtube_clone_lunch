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

// video 정보
<<<<<<< HEAD
const videoContainer=document.getElementById("body-container")
=======
const videoContainer=document.getElementByClass("body-container")
>>>>>>> js_1
const videoList = [
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_1.mp4',
    title: '블록체인의 미래와 혁신',
    description: '분산 원장 기술의 놀라운 가능성',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_2.mp4',
    title: '로봇 공학의 최신 동향',
    description: '인간과 기계가 공존하는 새로운 시대',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_3.mp4',
    title: '사물인터넷(IoT) 기술의 전망',
    description: '모든 것이 연결되는 미래',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_4.mp4',
    title: '생명공학의 유망한 발전',
    description: '질병 치료와 유전자 편집의 새로운 효과',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_5.mp4',
    title: '환경 친화적 기술의 지속 가능성',
    description: '녹색 에너지 혁명의 중심',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_6.mp4',
    title: '가상현실(VR)과 증강현실(AR)의 혁신',
    description: '새로운 경험의 창조',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_7.mp4',
    title: '양자 컴퓨팅의 미래',
    description: '빠른 계산 속도와 보안의 패러다임 전환',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_8.mp4',
    title: '자율주행 차량의 도래',
    description: '운전의 패러다임을 완전히 바꾸는 기술',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_9.mp4',
    title: '디지털 의료 서비스의 급부상',
    description: '포스트 코로나 시대의 헬스케어 혁신',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_10.mp4',
    title: '귀여운 토끼와 함께하는 일상',
    description: '토끼의 매력에 빠져보세요!',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_11.mp4',
    title: '토끼의 생태와 서식지 탐방',
    description: '자연에서 만난 토끼들의 이야기',
  },
  {
    videoUrl: 'https://storage.googleapis.com/oreumi.appspot.com/video_12.mp4',
    title: '재미있는 토끼 트릭과 놀이',
    description: '귀여운 동물 친구들의 재롱꾼 면모',
  }
];

function renderVideoList() {
  videoContainer.innerHTML = ''; // 기존 비디오 목록 초기화

  videoList.forEach(video => {
    const videoElement = document.createElement('video');
    videoElement.src = "http://oreumi.appspot.com/video/getVideoInfo?video_id=1";
    videoElement.controls = true;

    const titleElement = document.createElement('h2');
    titleElement.textContent = video.title;

    const descriptionElement = document.createElement('p');
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
