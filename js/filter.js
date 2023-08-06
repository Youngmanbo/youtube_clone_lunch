

async function createFilterBtn (tag){

    let parent = document.querySelector(".filter-lists");
    let btn = document.createElement("button");
    btn.className = 'filters';
    btn.innerText = `${tag}`;

    btn.addEventListener('click', e =>{
        let videoList = saveDataToSessionStorage('videoList', getVideoList);
        searchFilter(videoList, tag);
    })
    parent.appendChild(btn);
}