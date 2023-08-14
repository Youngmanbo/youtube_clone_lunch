  
// 메뉴 클릭시 보이고 안보이게
imgtag = document.getElementsByTagName('img');
menu_logo = imgtag[0];
menu_logo.addEventListener('click', nav_display);



function nav_display() {
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    let navStyle = getComputedStyle(nav).display;
  
    let filter = document.getElementsByClassName("filter-lists")[0];
    let bodyContainer = document.getElementsByClassName("body-container")[0];
    if (navStyle == "none") {
      nav.style.display = "block";
      // 다른부분들 밀기
      filter.style.left = "240px";
      bodyContainer.style.marginLeft = "240px";
    } else {
      nav.style.display = "none";
      // 다른부분들 당겨오기
      filter.style.left = "0px";
      bodyContainer.style.marginLeft = "0px";
    }
  }
    