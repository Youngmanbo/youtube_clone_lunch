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

function getVideo(id){
    let url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
    return fetch(url).then(res=> res.json());
}

async function getVideoList(){
    url = 'http://oreumi.appspot.com/video/getVideoList';
    const response = await fetch(url);
    return response.json();
}

export {getVideo};
export {getVideoList};
export {getChannel};