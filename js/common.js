imgtag = document.getElementsByTagName('img');
youtube_logo = imgtag[1];

youtube_logo.addEventListener('click', go_home);

function go_home(){
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("youtube_clone_lunch")[0];
    newUrl = split_url + "youtube_clone_lunch/index.html";

    window.location.href = newUrl;
}

// 파라미터 함수
function getParam(){
    let result = {};
    let url = window.location.href;
    let params = url.split("?")[1];
    if (params === undefined){
        return '0';
    }
    params = params.split("&");
    params.forEach( e =>{
        let param = e.split('=');
        result[param[0]] = param[1];
    })
    if (result['channel'] == undefined){
        result['channel'] ='oreumi';
    }
    if (result['id'] == undefined){
        result['id'] = '0';
    }
    return result;

}

//---- 세션 스토리지에 api값 저장---------


async function getDataToSessionStorage(data){
    let result = sessionStorage.getItem(data);
    return result ? JSON.parse(result) : null;
}


async function saveDataToSessionStorage(data, func, factor=null){
    try{
        const result = await getDataToSessionStorage(data);
        
        if (result){
            return result
        }
        else{
            const result2 = factor ? await func(factor) : await func();
            sessionStorage.setItem(data, JSON.stringify(result2));
            return result2;
        }
        }catch(error){
            console.error("error  발생: ", error, data);
        }
}

// api 함수들

async function getVideoInfoList(res) {

    const promises = res.map(async data => {
       return await getVideo(data.video_id); 
     });
     return await Promise.all(promises);

 
 }
 
 async function getVideoList(){
    const url = 'http://oreumi.appspot.com/video/getVideoList';
    const response = await fetch(url);
    const videoList = await response.json();

    // index를 기준으로 오름차순으로 정렬
    videoList.sort((a, b) => a.index - b.index);

    return videoList;
}
 
 
 
 async function getVideo(id) {
   
   const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
   const response = await fetch(url);
   return await response.json();
 }
 
 
 
 // 채널 정보
 async function getChannelInfo(channelName='oreumi') {


   let url = `http://oreumi.appspot.com/channel/getChannelInfo`;
 
   let response = await fetch(url, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ video_channel: channelName }),
   });
 
   let channelData = await response.json();
 
   return channelData;
 }

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
 
//조회수 포맷

function formatViews(views) {
if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
} else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
}
return views;
}

// 날짜 포맷
function formatDate(dateStr) {
  
    if (dateStr == undefined){
      return
    }
  
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
  