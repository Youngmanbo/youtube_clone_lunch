
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

function getVideoList(){    // 동영상 리스트들 가져오기
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function(){
        if (xhr.status === 200 && xhr.readyState === 4){
            // 값을 잘 받아왔을 때
    
           console.log(JSON.parse(xhr.responseText));
        
        }else{
            // 요청이 실패한 경우
            console.error('Error:', xhr.status);
        }
    };
    xhr.open('GET', '<http://oreumi.appspot.com/video/getVideoList>', true);
    xhr.send(null);
}



const videoList = getVideoList();
