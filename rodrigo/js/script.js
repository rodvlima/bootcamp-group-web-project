let offset = 0;
let limit = 50;
let scroll = true;
let windowHeight ;

(function createMainPage(){

    const app = document.getElementById('root');
    const logo = document.createElement('img');
    logo.src = 'img/logo1.jpg';
    
    const container = document.createElement('div');
    container.setAttribute('class','container');
    container.setAttribute('id','container');
    
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
    app.appendChild(logo);
    app.appendChild(container);
    app.appendChild(preLoader);
    scrollBottom();
    loadApi(null,null);
})();  

function scrollBottom(){
    let loading = true;
    window.onscroll = function(){
        if(scroll){
            if((window.innerHeight+this.window.scrollY) >= this.document.body.scrollHeight){
                if(loading == false){
                    loader.style.display = '';
                    loading = true;
                    loadApi(null,null);
                }
            }else{
                loading = false;
            }
        }
    }
};

function loadApi(type,value){
    const api = apiAddress(type,value);
    //open a new connection using the get resquest
    fetch(api)
    //convert the response to json
    .then(function(response){
        return response.json();
    })
    //work with the json information
    .then(function(data){
        fetchMarvelList(type,value,data)
    })
};

function apiAddress(type,value){
    const apiAddress = 'https://gateway.marvel.com/v1/public/';
    const getType = 'characters';
    const apikey = '766611ab74f4e8ab5d5b29c5f6e7d398';
    const hash = 'aea69f12a4b31ababd0c88e37b488550';
    const ts = '1';
    const orderBy = 'name';
    const nameStartsWith = '';
    let parameters = (type == 'character'?'/'+value:'');
    parameters += '?orderBy='+orderBy+'&limit='+limit+'&offset='+offset;
    
    const validation = '&apikey='+apikey+'&hash='+hash+'&ts='+ts;
    const api = apiAddress+getType+parameters+validation

    offset += limit;
    return api;
};

function fetchMarvelList(type,value,data){
    data = data.data.results;
    for(var i in data){
        createCard(type,i,data);
    }
    createListener();
};

function createCard(type,i,data){
    const card = `
    <div class="card" id=${(type=='character'?'char'+data[i].id:data[i].id)}>
    <h1>${data[i].name}</h1>
    <img class="thumbnail" id=${'thumb'+data[i].id}" src=${data[i].thumbnail.path}/portrait_xlarge.${data[i].thumbnail.extension}>
    <p id="description">${data[i].description}</p>
    <div class="content" id=${"content"+data[i].id} style="display:none;">
    <img class="back" id=${'back'+data[i].id} src='img/button-red-back.png' width=150px; height=50px;">
    <div>
    </div>
    `; // attention for this simbol: " ` "
    if(data[i].description.length > 0){
        container.innerHTML += card;
        loader.style.display = 'none';
    }
};

function createListener(){
    //card listener
    var cardElement = document.getElementsByClassName('card');
    for(var i = 0; i < cardElement.length;i++){
        const card = document.getElementById(cardElement[i].id);
        for(var x = 0;x < card.children.length;x++){
            if(card.children[x].className == 'thumbnail'){
                const thumb = document.getElementById(card.children[x].id);
                thumb.addEventListener('click',function(){hideCards(card.id);});
            }
            if(card.children[x].className == 'content'){
                const content = document.getElementById(card.children[x].id).getElementsByClassName('back');
                const back = document.getElementById(content[0].id)
                back.addEventListener('click',function(){showCards()});
            }
        }
    }
};

function showCards(){
    //enable spinner
    scroll = true;
    
    //display cards
    var cardElement = document.getElementsByClassName('card');
    for(var i = 0; i < cardElement.length;i++){
        const card = document.getElementById(cardElement[i].id);
        card.style.display = '';
        const content = card.getElementsByClassName('content');
        document.getElementById(content[0].id).style.display = 'none';
    }
    windowHeight.scrollIntoView();

};

function hideCards(idCharacter){
    //disable spinner
    scroll = false;
    //hide others cards and remove listener
    const cardElement = document.getElementsByClassName('card');
    for(var i = 0; i < cardElement.length;i++){
        const card = document.getElementById(cardElement[i].id);
        const cardId = card.id;
        if(cardId != idCharacter){
            cardElement[i].style.display = 'none';
        }else{
            windowHeight = card;
        }
    }
    //display "back" image
    const card = document.getElementById(idCharacter);
    for(var i = 0;i < card.children.length;i++){
        if(card.children[i].className == 'content'){
            card.children[i].style.display = '';
        }
    }
};