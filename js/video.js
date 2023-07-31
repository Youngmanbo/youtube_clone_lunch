async function getChannel(param='oreumi'){
    Url=`http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${param}`
    const response=await fetch(Url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

//vido id값
async function getVideoList(){
    url='http://oreumi.appspot.com/video/getVideoList';
    const response = await fetch(url);
    return response.json();
}

//video id값으로 url들
async function getVideoInfoList(res){

        return res.then(data =>{
            const promises = data.map(async data=>{
                return await getVideo(data.video_id);
            });
            return Promise.all(promise);
        });
}

//메인 비디오
async function renderChnnelVideo(res){
    let parent = documnet.querySelector(".main-video")
    let html = `
        <div class='video-mainVideo'>
            <video src=${res.video_link} poster=${res.image_link} controls></video>
        <div>
        <div class='video-mainInfo'>
            <h5>${res.video_tag}</h5><br></br>
            <h3>${res.video_title}</h3><br></br>
            <h6>${res.views} ${res.upload_date}</h6>
        </div>
        `
        parent.innerHTML=html;
}





window.onload=function(){
    let channel = getChannel();
    let videoInfos=getVideoInfoList();
}