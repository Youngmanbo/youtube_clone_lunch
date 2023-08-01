async function populateVideoContainer() {
    const response = await fetch("http://oreumi.appspot.com/video/getVideoList");
    return response.json()
  }


populateVideoContainer().then(data => {
    data.array.forEach(element => {
        bla
    });
})