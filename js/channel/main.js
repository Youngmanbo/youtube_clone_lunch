(async () => {
    let param = getParam();

    let channel = await saveDataToSessionStorage(param['channel']+'Channel', getChannel, param['channel']);
    let videoInfos = await saveDataToSessionStorage(param['channel']+"VideoList",getVideoInfoList, channel);

    let channelInfo = await saveDataToSessionStorage(param['channel']+'Info', getChannelInfo, param['channel']);

    await renderChannelInfo(channelInfo);

    let mostView = channel.reduce((prev, curr) => {
        return prev.views > curr.views ? prev: curr;
    });
    let mostVideo = await getVideo(mostView.video_id);
    
    await renderChannelVideo(mostVideo);


    let promises = videoInfos.map(async e =>{
        return await renderVideo(e);
    })
    Promise.all(promises);
})()