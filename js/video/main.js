


// 반응형 구독버튼
const buttons = document.getElementsByClassName('Subscribes-Btn');

for (const button of buttons) {
  button.addEventListener('click', () => {
    if (button.classList.contains('subscribed')) {
      button.textContent = 'SUBSCRIBES';
      button.classList.remove('subscribed');
    } else {
      button.textContent = 'SUBSCRIBING';
      button.classList.add('subscribed');
    }
  });
}



//<---------------------------함수실행부------------------------------------->

(async () => {
    let param = getParam();
    let getMainVideo = await saveDataToSessionStorage("video_id_"+param['id'], getVideo, param['id']);
       
    await renderChannelVideo(getMainVideo);
    
    let channelInfo = await saveDataToSessionStorage("videoChannelInfo", getChannelInfo, param['channel']); 

    await renderChannelInfo(channelInfo);

    let channel = await saveDataToSessionStorage("videoChannel", getChannel, param['channel']);
    let vList = await saveDataToSessionStorage("videoVideoList", getVideoList);
    let videoInfos = await saveDataToSessionStorage("videoVideoInfos", getVideoInfoList, channel);

    await createBtnEvent();

    let responseData = [vList, getMainVideo.video_tag, getMainVideo.video_id];
    let filteredVideoList = await saveDataToSessionStorage("filter_"+getMainVideo.video_title, calculateVideoSimilarities, responseData);
    for(i=0; i<5; i++){
        let filterVideo = await saveDataToSessionStorage("video_id_"+filteredVideoList[i].video_id, getVideo, filteredVideoList[i].video_id);
        await renderVideo(filterVideo, param['id'])
    } 


})();


