//유사도 측정 결과 가져오기
async function getSimilarity(firstWord, secondWord) {
    const openApiURL = "http://aiopen.etri.re.kr:8000/WiseWWN/WordRel";
    const access_key = 'd447995d-daf4-43d8-aef6-647c28df46c9';

    let requestJson = {
      argument: {
        first_word: firstWord,
        second_word: secondWord,
      },
    };

    let response = await fetch(openApiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_key,
      },
      body: JSON.stringify(requestJson),
    });
    let data = await response.json();
    return data.return_object["WWN WordRelInfo"].WordRelInfo.Distance;
  }

//유사도

async function calculateVideoSimilarities(response) {
    let videoList = response[0];
    let targetTagList = response[1];
    let targetVideoId = response[2];
    
    let filteredVideoList = [];

    for (let video of videoList) {
      let totalDistance = 0;
      let promises = [];

      for (let videoTag of video.video_tag) {
        for (let targetTag of targetTagList) {
          if (videoTag == targetTag) {
            promises.push(0);
          } else {
            promises.push(getSimilarity(videoTag, targetTag));
          }
        }
      }

      let distances = await Promise.all(promises);

      for (let distance of distances) {
        if (distance !== -1) {
          totalDistance += distance;
        }
      }

      if (totalDistance !== 0) {
        if (targetVideoId !== video.video_id) {
          filteredVideoList.push({ ...video, score: totalDistance });
        }
      }
    }

    filteredVideoList.sort((a, b) => a.score - b.score);

    filteredVideoList = filteredVideoList.map((video) => ({
      ...video,
      score: 0,
    }));
    console.log(filteredVideoList);
    return filteredVideoList;
  }
