document.addEventListener("DOMContentLoaded", function () {
    const commentInput = document.querySelector('.add-comment-input input'); //input태그 class만든거라서 html추가해야함
    const commentAddButton = document.querySelector('.comment-add'); //butten태그
    const commentCancelButton = document.querySelector('.comment-cancle'); //취소버튼
    const commentList = document.querySelector(".comment-list"); //댓글 추가시 list
    const userImage = document.getElementById('userImage');

    commentAddButton.addEventListener("click", addComment);
    commentInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addComment();
        }
    });

    function getRandomPhotoPath() {
        const photoPaths = [
            "../imgs/team/ec.jpg",
            "../imgs/team/kimziho.jpg",
            "../imgs/team/lunchTeam.jpg",
            "../imgs/team/nj.jpg",
            "../imgs/team/ym.jpg",
            "../imgs/team/youngM.jpg"
        ];

        const randomIndex = Math.floor(Math.random() * photoPaths.length);
        return photoPaths[randomIndex];
    }





    function addComment() {
        const commentText = commentInput.value;
        if (commentText.trim() === "") {
            return;
        }
        // 요부분 다시 수정하기
        const commentContainer = document.createElement("div"); //<div class="comment">댓글들 </div>
        commentContainer.classList.add("container-comment");

        // const userImage=document.createElement("img");
        // userImage.src=getRandomPhotoPath();
        // userImage.alt="";

        const commentUserInfoContainer = document.createElement("div")
        commentUserInfoContainer.className = 'user-info-container';

        const userContainer = document.createElement('div');
        userContainer.className = 'user-container'

        const username = document.createElement("div");
        username.classList.add("username");



        const timestamp = document.createElement("span");
        //timestamp.textContent=" 3 minutes ago";
        const currentTime = new Date();
        timestamp.textContent = getTimeAgoString(currentTime);

        const commentContent = document.createElement("div");
        commentContent.className = 'default-comments';
        commentContent.textContent = commentText;


        commentUserInfoContainer.appendChild(username);
        commentUserInfoContainer.appendChild(timestamp);
        userContainer.appendChild(commentUserInfoContainer);
        userContainer.appendChild(commentContent);

        commentContainer.appendChild(userImage.cloneNode(true));
        commentContainer.appendChild(userContainer)

        commentList.appendChild(commentContainer);

        // 댓글 제거 버튼
        let removediv = document.createElement('div');
        removediv.className = 'remove-div';
        let replacebtn = document.createElement('button');
        replacebtn.className = 'replace-btn';
        let removebtn = document.createElement('button');
        removebtn.addEventListener('click', (event) =>
            removeComments(event)
        );
        replacebtn.addEventListener('click', (event) =>
            replaceComments(event)
        );


        removebtn.className = 'remove-btn';
        replacebtn.innerHTML = '수정';
        removebtn.innerHTML = '삭제';

        removediv.appendChild(replacebtn);
        removediv.appendChild(removebtn);
        commentContainer.appendChild(removediv);

        //댓글 오름차순
        commentList.insertBefore(commentContainer, commentList.firstChild);

        commentInput.value = "";
        imgsrc = userImage.src.split('/team/')[1];
        userImage.src = getRandomPhotoPath();
        if (imgsrc == "ec.jpg") {
            username.textContent = "철이네 먹방";
        } else if (imgsrc == "kimziho.jpg") {
            username.textContent = '지호지아';
        } else if (imgsrc == 'lunchTeam.jpg') {
            username.textContent = 'Lunch Group';
        } else if (imgsrc == 'ym.jpg') {
            username.textContent = '유미의 세포들';
        } else if (imgsrc == 'youngM.jpg') {
            username.textContent = '영민Tube';
        } else {
            username.textContent = '탈주닌자';
        }
    }
    // 취소버튼
    commentCancelButton.addEventListener("click", function () {
        commentInput.value = "";
    });

    //이미지가 로드되기 전에 js가 실행되서 => 이미지가 로드된 후에 js코드가 실행되게 하려고 이거 만듬
    userImage.onload = function () {
        const initialImageLoad = userImage.onload;
        userImage.onload = null;

        if (initialImageLoad) {
            initialImageLoad();
        }
    };

    userImage.src = getRandomPhotoPath();

    function getTimeAgoString(timestamp) {
        const currentTime = new Date();
        const diffMillis = currentTime - timestamp;

        const minutes = Math.floor(diffMillis / 60000);
        if (minutes < 1) {
            return "방금 전";
        } else if (minutes < 60) {
            return `${minutes}분 전`;
        } else if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            return `${hours}시간 전`;
        } else {
            const days = Math.floor(minutes / 1440);
            return `${days}일 전`;
        }

    }

});



// 댓글 삭제


function removeComments(e) {
    if (confirm("댓글을 삭제하시겠습니까?")) {
        e.target.parentElement.parentElement.remove();
    }
}

function replaceComments(e) {
    let beforeText = e.target.parentElement.parentElement.childNodes[1].childNodes[1];
    let replaceText = prompt("수정할 내용으로 적어주세요.")
    if (confirm(`${beforeText.innerHTML} -> ${replaceText} 로 댓글을 수정하시겠습니까?`)) {
        beforeText.innerHTML = replaceText;
        alert("수정이 완료 되었습니다.");
    }
}

function writeComments(){
    let fr = new FileReader();
}