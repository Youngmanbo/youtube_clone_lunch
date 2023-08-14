
//햄버거 클릭시 사이드바 
function nav_display() {
    let nav = document.getElementsByClassName('channel-left-nav')[0];
    let navStyle = getComputedStyle(nav).display;
  
    if (navStyle == "none") {
      nav.style.display = "block";
      nav.style.zIndex = 1000; 
    } else {
      nav.style.display = "none";
    }
  }
  // 메뉴 클릭시 보이고 안보이게
  imgtag = document.getElementsByTagName('img');
  menu_logo = imgtag[0];
  menu_logo.addEventListener('click', nav_display);
  