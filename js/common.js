imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
youtube_logo = imgtag[1];

youtube_logo.addEventListener('click', go_home);
menu_logo.addEventListener('click' ,nav_display);

function go_home(){
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("html")[0];
    newUrl = split_url + "html/home.html";
    window.location.replace(newUrl);
}

// 메뉴 클릭시 보이고 안보이게
function nav_display(){  
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    if (nav.style.display == "block" || nav.style.display == ""){
        nav.style.display = "none";
    }else{
        nav.style.display = "block";
    }
}