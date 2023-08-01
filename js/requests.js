/*  
    let channel = getChannel(); or getVideoList;

    getchannel, getvideo , getVideoInfoList= promise 객체로 반환됨
    
    사용법
    
    let channel = getChannel().then(data=>{

        기능구현 
    })


ex) let channel = getChannel();
    let videoInfos = getVideoInfoList(channel);
    
    
    videoInfos.then(async data=>{
        let promises = data.map(async el => {
            return renderVideo(el);
        });
        Promise.all(promises);
    })





*/



async function getChannel(param=undefined){
    Url = 'http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi'
    
    let result = undefined;
    await fetch(Url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => result = res.json());
    return result;
    
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

function renderVideo(info){


    let parent = document.querySelector('#channel-footer-videoList');
    
    let div = document.createElement('div');
    div.className = 'video-container';
    let video = document.createElement('video');
    video.src=info.video_link;
    video.poster = info.image_link;
    
    div.appendChild(video);
    parent.appendChild(div);


}





export {getVideo};
export {getVideoList};
export {getChannel};