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

async function getVideo2(id){
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
        return await getVideo2(res[key].video_id);
    })
    const result = await Promise.all(prom);

    return res;
}


export {getVideo};
export {getVideoList};
export {getChannel};