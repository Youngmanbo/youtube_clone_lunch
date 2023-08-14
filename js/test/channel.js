


let channelTitleImg = "";

// channel request 함수
async function getChannel(param) {
    Url = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=${param}`
    const response = await fetch(Url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

//videoInfo reqeust 함수

async function getVideo(id) {
    if (id == undefined) {
        id = 0;
    }
    url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
    const response = await fetch(url);
    return response.json();
}

//videoList requests 함수

async function getVideoList() {
    url = 'http://oreumi.appspot.com/video/getVideoList';
    const response = await fetch(url);
    return response.json();
}


//videoInfoList 의 video_id값을 추출하여 한꺼번에 requests를 보내는 함수

async function getVideoInfoList(res) {


    return res.then(data => {
        const promises = data.map(async data => {
            return await getVideo(data.video_id);
        });
        return Promise.all(promises);

    });

}




// channelInfo requests 함수
async function getChannelInfo(res) {


    Url = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${res}`
    const response = await fetch(Url, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
        }
    });
    return response.json();

}







//window.onload == 브라우저의 html이 로드 된다음에 function 아래를 실행해라.


let parameter = getParam();

let channel = getChannel(parameter);
let videoInfos = getVideoInfoList(channel);
// let channelInfo = getChannelInfo(getParam());


getChannelInfo(parameter).then(async (channelInfo) => {
    renderChannelInfo(channelInfo);
})

getChannel(parameter).then((videoList) => {      // 체널 중에 views 가장 높은 동영상 
    let mostView = videoList.reduce((prev, curr) => {
        return prev.views > curr.views ? prev : curr;
    });
    getVideo(mostView.video_id).then(async res => {
        renderChannelVideo(res);
    });
})

videoInfos.then(async data => {
    let promises = data.map(async el => {
        return await renderVideo(el);
    });
    Promise.all(promises);
})


// channel 매개변수 값 가져오기
function getParam() {
    let url = new URL(window.location.href);
    let param = url.searchParams;
    let parameter = param.get('channel');
    if (parameter == null || parameter == undefined) {
        parameter = 'oreumi';
    }
    return parameter;
}
