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

    const prom = Object.keys(res).map(async key => {
        return await getVideo(res[key].video_id);
    })
    const result = await Promise.all(prom);

    return res;
}

function render(info){
    let parent = document.querySelector('#channel-footer-videoList');
    let div = document.createElement('div');
    div.className = 'video-container';
    let video = document.createElement('video');
    video.src=info.video_link;
    video.poster = info.lmg_link;
    video.setAttribute('controls');
    
    div.appendChild(video);
    parent.appendChild(div);


    parent.appendChild(html);
}

async function renderList(res){
    const prom = Object.keys(res).map(async key => {
        return await render(res[key]);
    })
    const result = await Promise.all(prom);

    
}



window.onload = function(){

    let channel = getChannel();
    let videoInfos = getVideoInfoList(channel);
    console.log(videoInfos);
    render(videoInfos[0]);

}