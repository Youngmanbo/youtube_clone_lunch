/*  
    let channel = getChannel(); or getVideoList;
    let videoInfos = getVideoInfoList(channel);

*/



async function getChannel(param=undefined){
    Url = 'http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi'
    const response = await fetch(Url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

async function getVideo(id){
    url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
    const response = await fetch(url);
    return response.json();
}

async function getVideoList(){
    url = 'http://oreumi.appspot.com/video/getVideoList';
    const response = await fetch(url);
    return response.json();
}

async function getVideoInfoList(res){

    
    return res.then(data =>{
        const promises = data.map(async data => {
           return await getVideo(data.video_id);
        });
        return Promise.all(promises);

    });
    
}

async function renderVideo(info){


    let parent = document.querySelector('#channel-footer-videoList');
    
    let div = document.createElement('div');
    div.className = 'video-container';
    let video = document.createElement('video');
    video.src=info.video_link;
    video.poster = info.image_link;
    video.setAttribute('controls', "");
    
    div.appendChild(video);
    parent.appendChild(div);


}



window.onload = function(){
    let channel = getChannel();
    let videoInfos = getVideoInfoList(channel);
    
    console.log(videoInfos);
    
    videoInfos.then(async data=>{
        let promises = data.map(async el => {
            return await renderVideo(el);
        });
        Promise.all(promises);
    })
}