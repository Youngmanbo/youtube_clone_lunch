let url = 'http://aiopen.etri.re.kr:8000/WiseQAnal'
let key = 'd447995d-daf4-43d8-aef6-647c28df46c9'
let text ="재미난 액션영화 추천해줘"
let requestJSON ={
    'argument':{
        'text':text
    }
};

let ai = fetch(url,{
    method: "GET",
    hedaers:{
        'Content-Type':'application/json',
        'Authorization':key
    },
    body:JSON.stringify(requestJSON),
})

console.log(ai.then(data));