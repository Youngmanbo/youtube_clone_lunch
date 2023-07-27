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
    html = `
    <div class=channel-video-list>
        <video controls poster=${info.imgae_link} src=${info.video_link}></video>
        <
    </div>
    `;
}
0
let channel = getChannel();
let videoInfo = getVideoInfoList(channel);

channel.videoInfo = videoInfo;
console.log(channel);