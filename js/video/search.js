// 검색버튼 활성화
let inputText = document.getElementById("search-bar");
let searchBtn = document.querySelector(".search > img");

function deliverParamToHome(userInput){

    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("youtube_clone_lunch")[0];
    newUrl = split_url + "youtube_clone_lunch/index.html";
    newUrl += '?search=' + encodeURI(userInput);

    window.location.href = newUrl;

}


searchBtn.addEventListener('click', e => {

    let userInput = inputText.value
    deliverParamToHome(userInput);

})


inputText.addEventListener('keyup', enterSearch);

function enterSearch(e){
    let userInput = inputText.value;
    if (e.keyCode !== 13){
        return;
    }
    if (userInput == "") { // 검색하는게 text가 비어있을때
        return;
    } else {
        deliverParamToHome(userInput);
    }
}

