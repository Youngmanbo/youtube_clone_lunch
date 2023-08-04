let isPiPSupported =  'pictureInPictureEnabled' in document;
let video, toggleBtn;

if (isPiPSupported) {
    video = document.getElementById('videoElement');
    toggleBtn = document.getElementById('PiP');
    toggleBtn.addEventListener('click', togglePiPMode);

    video.addEventListener('enterpictureinpicture', (event)=> {
      toggleBtn.textContent = "Exit Pip Mode";  
    });

    video.addEventListener('leavepictureinpicture', (event) => {
        toggleBtn.textContent = " Enter PiP Mode";
    });
    video.addEventListener('leavepictureinpicture', (event) => {
        toggleBtn.textContent = " Enter PiP Mode";
    });

}

async function togglePiPMode(event) {
    toggleBtn.disabled = true;

    try {
        if (video !== document.pictureInPictureElement) {
            await video.requestPictureInPicture();
            toggleBtn.textContent = "Exit Pip Mode";
        } else {
            await document.exitPictureInPicture();
            toggleBtn.textContent = "Enable Pip Mode";
        }
    } catch (error) {
        console.log(error);
    } finally {
        toggleBtn.disabled = false;
    }
}