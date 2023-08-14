// 메뉴 클릭시 보이고 안보이게

imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);


function nav_display() {
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    let navStyle = getComputedStyle(nav).display;

    let idChannelCover = document.getElementById('channel-cover');
    let idChannel = document.getElementById('channel');

    let classChannelBodyContainer = document.getElementsByClassName('channel-body-container')[0];
    let playListBox = document.getElementById('playlist_box');

    if (navStyle == "none") {
        nav.style.display = "block";
        // 다른부분들 밀기
        idChannelCover.style.marginLeft = "240px";
        idChannel.style.marginLeft = "240px";
        playListBox.style.paddingLeft = "255px";
        classChannelBodyContainer.style.paddingLeft = "250px";
    } else {
        nav.style.display = "none";
        // 다른부분들 밀기
        idChannelCover.style.marginLeft = "0px";
        idChannel.style.marginLeft = "0px";
        playListBox.style.paddingLeft = "15px";
        classChannelBodyContainer.style.paddingLeft = "10px";

    }
}


const button = document.getElementById('channel-subscribes-btn');

button.addEventListener('click', () => {
    buttonText = button.innerHTML;
    if(buttonText == 'SUBSCRIBES'){
        button.innerHTML = 'SUBSCRIBING';
        let sub = document.getElementById('escape').parentElement;
        let aTag = document.createElement('a');
        aTag.className = 'links';
        let imgTag = document.createElement('img');
        imgTag.src = channelTitleImg;
        aTag.appendChild(imgTag);
        aTag.append(getParam());
        aTag.setAttribute('id','newsubs');
        sub.parentNode.insertBefore(aTag, sub.nextSibling);
    }else{
        button.innerHTML = 'SUBSCRIBES';
        document.getElementById('newsubs').remove();
    }
});