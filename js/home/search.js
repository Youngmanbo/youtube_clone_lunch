// ----------------------검색 -------------------------------------------
let searchBtn = document.getElementsByClassName('search-icon')[0]; // 검색 버튼
let searchBox = document.getElementById('search-bar');  // 검색 창
searchBtn.addEventListener('click', search);
searchBox.addEventListener('keypress', enterSearch); // enter 시 search

async function search(text=null) {
    let searchText;
    if (text){
        searchText = text;
    }else{
        searchText = document.getElementById('search-bar').value.toLowerCase();
    }
  if (searchText == "") { // 검색하는게 text가 비어있을때
    return;
  } else {
    let videoList = await saveDataToSessionStorage("videoList", getVideoList);

    searchFilter(videoList, searchText);
  }
}

function searchFilter(videoList, searchTxt){
    let totalList = [];
    let searchText= searchTxt.toLowerCase();

    let searchTitle = videoList.filter((video) =>       // 제목검색
    video.video_title.toLowerCase().includes(searchText)
    );

    let searchChannel = videoList.filter((video) =>     // 체널명 검색
    video.video_channel.toLowerCase().includes(searchText)
    );

    let searchDetail = videoList.filter((video) =>      // 디테일 검색
    video.video_detail.toLowerCase().includes(searchText)
    );


    let searchTag = videoList.filter((video) => {       // 태그 검색
    for(let i = 0 ; i < video.video_tag.length ; i++){
        if(video.video_tag[i].toLowerCase().includes(searchText)){
          return true;
        }
    }
    });

    // 검색한 거 합치기
    totalList = totalList.concat(searchTitle);
    totalList = totalList.concat(searchChannel);
    totalList = totalList.concat(searchDetail);
    totalList = totalList.concat(searchTag);

    // 중복된 검색 지우기
    totalList = totalList.filter((item, pos) => totalList.indexOf(item) === pos);  


    if (totalList.length == 0) {
    alert('검색하신 내용과 일치하는 동영상이 존재하지 않습니다.');
    } else {
    createVideosItem(totalList);
    document.getElementById('search-bar').value = "";
    }
}


async function enterSearch(e) {  // 엔터키 검색
  searchText = document.getElementById('search-bar').value.toLowerCase();
  if (e.keyCode != 13) {  // 엔터키가 아니라면 exit
    return;
  }
  if (searchText == "") { // 검색하는게 text가 비어있을때
    return;
  } else {
    let videoList = await saveDataToSessionStorage("videoList", getVideoList);
    searchFilter(videoList, searchText);
  }
}


// 검색 후 동영상 추가
async function createVideosItem(videoDatas) {
  clear_videoList();
  let videolist = videoDatas.map(async (vid) =>
    await getVideo(vid.video_id) //await saveDataToSessionStorage(vid.video_id, getVideo, vid.video_id)  
  );
  let videoInfoList = await Promise.all(videolist);

  videoInfoList.map(data => createVideoItem(data));
}

function clear_videoList() { //비디오들 화면 다 지우기
  let videoItems = document.getElementsByClassName('body-container')[0];
  while (videoItems.hasChildNodes()) {
    videoItems.removeChild(videoItems.firstChild);
  }
}

