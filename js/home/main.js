var currentFilterIndex = 0;
const filtersPerPage = 5;

let p = getParam();

if (p != 0){
    console.log(p['search']);
    search(p['search']);
}else{

    (async () => {
        let videoList = await saveDataToSessionStorage('videoList', getVideoList);
        let videoInfoList = await saveDataToSessionStorage('videoInfoList', getVideoInfoList, videoList);
    
        let promises = videoInfoList.map(async el => {
            return await createVideoItem(el);
        });
        
        await Promise.all(promises);
        let filterList = []
        videoInfoList.map(async data => {
            data.video_tag.forEach(a => filterList.push(a));
        })
        

        filterList = filterList.filter((item, idx) => filterList.indexOf(item) == idx)
        let filterParent = document.querySelector('.filter-lists');

        let filterAllBtn = document.createElement('button');
        filterAllBtn.className = 'filters';
        filterAllBtn.classList.add('fillter-all');
        filterAllBtn.innerText = "전체";

        let filterLeftBtn = document.querySelector('.filter-left-btn');
        filterLeftBtn.addEventListener('click',showPreviousFilters);

        filterParent.appendChild(filterAllBtn);

        filterList.forEach(e => createFilterBtn(e));

        let filterRightBtn = document.querySelector('.filter-right-btn');
        filterRightBtn.addEventListener('click', showNextFilters);

        document.querySelector('.fillter-all').addEventListener('click', allFilter);
        showFilters();
        
    })();


}
