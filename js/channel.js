// async function getChannel(param=undefined){
//     Url = 'http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi'
//     const response = await fetch(Url,{
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     });
//     return response.json();
// }

// async function getVideo(id){
//     url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`;
//     const response = await fetch(url);
//     return response.json();
// }

// async function getVideoList(){
//     url = 'http://oreumi.appspot.com/video/getVideoList';
//     const response = await fetch(url);
//     return response.json();
// }

// function render(res){
//     res.forEach(data){
//         let uploadDate = data.upload_date;
//         let channel = data.video_channel;
//         let detail = data.video_detail;
//         let id = data.video_id;
//         let tag = data.video_tag;
//         let title = data.video_title;
//         let views = data.views;

//         let html = `

//         `;
//     }
// }
import * as res from './requests.js';

console.log(res.getVideoList());
console.log(res.getVideo(0));
console.log(res.getChannel());
