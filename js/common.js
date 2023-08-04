imgtag = document.getElementsByTagName('img');
youtube_logo = imgtag[1];

youtube_logo.addEventListener('click', go_home);

function go_home(){
    let curruntUrl = window.location.href;
    let split_url = curruntUrl.split("youtube_clone_lunch")[0];
    newUrl = split_url + "/index.html";
    window.location.replace(newUrl);
}
