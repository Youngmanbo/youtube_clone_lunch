
function showFilters() {
    const filterButtons = document.querySelectorAll('.filters');
    filterButtons.forEach((button, index) => {
        if (index >= currentFilterIndex && index < currentFilterIndex + filtersPerPage) {
            button.classList.remove('hidden');
            setTimeout(() => {
                button.style.transform = 'translateX(0)';
            }, index * 1);
        } else {
            button.classList.add('hidden');
            button.style.transform = 'translateX(-30px)';
        }
    });
}


function showNextFilters() {
  const totalFilters = document.querySelectorAll('.filters').length;
  if (currentFilterIndex + filtersPerPage < totalFilters) {
      currentFilterIndex += filtersPerPage;
      showFilters();
  }
}

function showPreviousFilters() {
  if (currentFilterIndex - filtersPerPage >= 0) {
      currentFilterIndex -= filtersPerPage;
      showFilters();
  }
}



// 필터 버튼 이벤트


async function createFilterBtn (tag){

  let parent = document.querySelector(".filter-lists");
  let btn = document.createElement("button");
  btn.className = 'filters';
  btn.innerText = `${tag}`;

  btn.addEventListener('click', e =>{
      let videoList = JSON.parse(sessionStorage.getItem('videoList'));
      searchFilter(videoList, tag);
  })
  parent.appendChild(btn);
}

async function allFilter(){
    let videoList = await saveDataToSessionStorage("videoList", getVideoList);
    searchFilter(videoList, "");
  }