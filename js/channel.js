/*  
    let channel = getChannel(); or getVideoList;
    let videoInfos = getVideoInfoList(channel);

    renderList(videoInfos);


    render() 함수에서 html 수정 및 변경   

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
    let video = ''
    await res.then(data =>{
        video = data.map(async data => {
            return await getVideo(data.video_id);
        })
    });

    
    return video; 
}

function render(info){
    info.then(obj => {

        let parent = document.querySelector('#channel-footer-videoList');
        
        let div = document.createElement('div');
        div.className = 'video-container';
        let video = document.createElement('video');
        video.src=obj.video_link;
        video.poster = obj.image_link;
        
        div.appendChild(video);
        parent.appendChild(div);

    })

}

async function renderList(res){
    await res.then(async data => {
        data.map(obj =>{

            render(obj);
        })
    })
    
}



window.onload = function(){
    let channel = getChannel();
    let videoInfos = getVideoInfoList(channel);

    renderList(videoInfos);

}