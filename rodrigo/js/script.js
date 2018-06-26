let offset = 0;
let limit = 20;
let scroll = true;
let cardPosition;

(function createMainPage(){
    
    const root = document.getElementById('root');
    const logo = document.createElement('img');
    logo.src = 'img/logo1.jpg';
    
    const container = document.createElement('div');
    container.setAttribute('class','container');
    container.setAttribute('id','container');
    
    const character = document.createElement('div');
    character.setAttribute('class','character');
    character.setAttribute('id','character');
    character.style.display = 'none';

    const preLoader = document.createElement('div');
    preLoader.setAttribute('id','preLoader');
    preLoader.setAttribute('align','center');
    preLoader.setAttribute('style','height: 150px;');
    preLoader.setAttribute('style','display: "";');
    
    const loader = document.createElement('div');
    loader.setAttribute('class','loader');
    loader.setAttribute('id','loader');
    loader.style.display = 'none';
    
    preLoader.appendChild(loader);
    root.appendChild(logo);
    root.appendChild(container);
    root.appendChild(character);
    root.appendChild(preLoader);
    scrollBottom();
    loadApi();
})();  

function scrollBottom(){
    let loading = true;
    window.onscroll = function(){
        if(scroll){
            if((window.innerHeight+this.window.scrollY) >= this.document.body.scrollHeight){
                if(loading == false){
                    loader.style.display = '';
                    loading = true;
                    loadApi();
                }
            }else{
                loading = false;
            }
        }
    }
};

function apiAddress(type,idCharacter){
    const apiAddress = 'https://gateway.marvel.com:443/v1/public/';
    const getType = 'characters';
    const extra = (type && idCharacter?'/'+idCharacter+'/'+type:'');
    const apikey = '766611ab74f4e8ab5d5b29c5f6e7d398';
    const hash = 'aea69f12a4b31ababd0c88e37b488550';
    const ts = '1';
    // const orderBy = (type == 'comics'?'':'name');
    const orderBy = (type == 'series'?'startYear':'name');
    const nameStartsWith = '';
    const validation = '?apikey='+apikey+'&hash='+hash+'&ts='+ts;
    const parameters = '&orderBy='+orderBy+(!type?'&limit='+limit+'&offset='+offset:'');
    let api = '';
    api = apiAddress+getType+extra+validation+parameters;
    offset += limit;
    return api;
};  

function loadApi(type,idCharacter){
    const api = apiAddress(type,idCharacter);
    console.log(api)
    fetch(api)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if(type && idCharacter){
            fetchMarvelContents(data)
        }else{
            fetchMarvelList(data)
        }
    })
};

function fetchMarvelList(data){
    data = data.data.results;
    for(var i in data){
        createCard(i,data);
    }
    createListener();
};

function fetchMarvelContents(data){
    data = data.data.results;
    for(var i in data){
        createContent(i,data);
    }
    return data;
};

function createCard(i,data){
    const card = `
    <div class="card" id=${(data[i].id)}>
    <h1>${data[i].name}</h1>
    <img class="thumbnail" id=${'thumb'+data[i].id}" src=${data[i].thumbnail.path}/portrait_xlarge.${data[i].thumbnail.extension}>
    <p id="description">${data[i].description}</p>
    </div>`; // attention for this simbol: " ` "

    if(data[i].description.length > 0){
        container.innerHTML += card;
        loader.style.display = 'none';
    }
};

function createContent(i,data){
    // console.log(data[i])
    const comic = `
    <div class="comic" id=${(data[i].id)}>
    <center><h3>${data[i].title}</h3></center>
    <img class="thumbnail" id=${'thumb'+data[i].id}" src=${data[i].thumbnail.path}/portrait_xlarge.${data[i].thumbnail.extension}>
    <p id="description">${(!data[i].description)?'':data[i].description}</p>
    </div>`; // attention for this simbol: " ` "

        const content = document.getElementById('content');
        content.innerHTML += comic;
};

function createCharacter(idCharacter){
    scroll = false;
    const character = document.getElementById('character');
    const card = document.getElementById(idCharacter);
    const clone = card.cloneNode(true);
    clone.innerHTML += `<div id="content"><h2>Series</h2></div>`;
    clone.innerHTML += `<div id="back"><img id="back" src='img/button-red-back.png' width=150px; height=50px;"></div>`;
    character.innerHTML = '';
    character.appendChild(clone);
    document.getElementById('back').addEventListener('click',function(){showCards()});
    document.getElementById('container').style.display = 'none';
    document.getElementById('preLoader').style.display = 'none';
    character.style.display = '';
    cardPosition = card;
    loadApi('series',idCharacter);
};    

function createListener(){
    //card listener
    var cardElement = document.getElementsByClassName('card');
    for(var i = 0; i < cardElement.length;i++){
        const card = document.getElementById(cardElement[i].id);
        for(var x = 0;x < card.children.length;x++){
            if(card.children[x].className == 'thumbnail'){
                const thumb = document.getElementById(card.children[x].id);
                thumb.addEventListener('click',function(){createCharacter(card.id);});
            }
        }
    }
};

function showCards(){
    scroll = true;
    document.getElementById('container').style.display = '';
    document.getElementById('preLoader').style.display = '';
    document.getElementById('character').style.display = 'none';
    cardPosition.scrollIntoView();
};

/*---- OLD ----*/


// function hideCards(idCharacter){
//     //disable spinner
//     scroll = false;
//     //hide others cards and remove listener
//     const cardElement = document.getElementsByClassName('card');
//     for(var i = 0; i < cardElement.length;i++){
//         const card = document.getElementById(cardElement[i].id);
//         const cardId = card.id;
//         if(cardId != idCharacter){
//             cardElement[i].style.display = 'none';
//         }else{
//             cardPosition = card;
//         }
//     }
//     //display "back" image
//     const card = document.getElementById(idCharacter);
//     for(var i = 0;i < card.children.length;i++){
//         if(card.children[i].className == 'content'){
//             card.children[i].style.display = '';
//         }
//     }
// };