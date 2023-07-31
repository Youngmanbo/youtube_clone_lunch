menu_logo = document.getElementById('home-logo').childNodes[5];
youtube_logo = document.getElementById('home-logo').childNodes[7];

menu_logo.addEventListener('click' ,nav_display);

function nav_display(){
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    if (nav.style.display == "block" || nav.style.display == ""){
        nav.style.display = "none";
    }else{
        nav.style.display = "block";
    }
}
