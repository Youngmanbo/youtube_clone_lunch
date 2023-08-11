  // 비디오 클릭시 비디오 페이지로 이동
  // ? 뒤에 idx값 넣어서 이동
  function goVideo(e, channel) {
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("index.html")[0];
    newUrl = split_url + "html/video.html";
    let temp = e.target.currentSrc.split('_');
  
    let idx = temp[1].split('.');
    newUrl += `?id=${idx[0]}`;
    newUrl += `&channel=${channel}`;
    window.location.href = newUrl;
  }
  
  // 비디오 밑 텍스트 클릭시 channel로 이동
  // id값으로 channel 넘김
  function goChannel(e, videoChannel, videoId) {
    if (e.target == "video") {
      return;
    }
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("index.html")[0];
    newUrl = split_url + "html/channel.html";
    newUrl += `?channel=${videoChannel}`;
    newUrl += `&id=${videoId}`
    window.location.href = newUrl;
  }  
  
  
  function go_home() {
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("html")[0];
    newUrl = split_url + "html/home.html";
    window.location.href = newUrl;
  }
  