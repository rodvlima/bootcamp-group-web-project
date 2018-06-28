let offset = 0;
let limit = 20;
let loading = true;
let scroll = true;
let cardPosition;
let marvelCharacters = [];
// let marvelComics = [];

(function createMainPage(){
    
    const root = document.getElementById('root');
    const logo = document.createElement('img');
    logo.src = 'img/logo1.jpg';

    const topNav = document.createElement('div');
    topNav.setAttribute('class','topNav');
    topNav.setAttribute('id','topNav');
    
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
    root.appendChild(topNav);
    root.appendChild(container);
    root.appendChild(character);
    root.appendChild(preLoader);

    scrollBottom();
    createTopNav();
    loadApi();
})();  

function createTopNav(){
    const topBar = document.getElementById('topNav');
    const bar = `<a class="home">Home</a>
        <div class="search-container">
            <form action="/action_page.php">
            <input type="text" placeholder="Search.." name="search">
            <button type="submit"><i class="fa fa-search"></i></button>
            </form>
        </div>`;
    topBar.innerHTML += bar;
};

function scrollBottom(){    
    window.onscroll = function(){
        if(scroll){
            if((window.innerHeight+this.window.scrollY) >= this.document.body.scrollHeight){
                if(loading == false){
                    loader.style.display = '';
                    loading = true;
                    loadApi();
                    console.log('---------loadapi---------')
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
    const orderBy = (type == 'series'?'startYear':'name');
    const nameStartsWith = '';
    const validation = '?apikey='+apikey+'&hash='+hash+'&ts='+ts;
    const parameters = '&orderBy='+orderBy+(!type?'&limit='+limit+'&offset='+offset:'');
    let api = '';
    api = apiAddress+getType+extra+validation+parameters;
    offset += limit;
    return api;
};  

function loadApi(type,character){
    const api = apiAddress(type,(character?character.id:null));
    console.log(api)
    if(!type){
        console.log('get character')
    }else{
        console.log('get series')
    }
    fetch(api)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if(type && character){
            data = data.data.results;
            marvelCharacters[marvelCharacters.indexOf(character)].series.items=data;
            console.log('carregou'+marvelCharacters[marvelCharacters.indexOf(character)].name)
        }else{
            data = data.data.results;
            for(var i in data){
                if(data[i].description.length > 0){
                    data[i].series.items='';
                    marvelCharacters.push(data[i]);
                    console.log('Api ready')
                };
            }
            fetchMarvelCharacters();
            createListener();
        }
    });
};

// function loadSeries(type,character){
//     const api = apiAddress(type,(character?character.id:null));
//     if(!type){
//         console.log('get character')
//     }else{
//         console.log('get series')
//     }
//     fetch(api)
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(data){
//         if(type && character){
//             data = data.data.results;
//             marvelCharacters[marvelCharacters.indexOf(character)].series.items=data;
//             console.log('carregou'+marvelCharacters[marvelCharacters.indexOf(character)].name)
//         }else{
//             data = data.data.results;
//             for(var i in data){
//                 if(data[i].description.length > 0){
//                     data[i].series.items='';
//                     marvelCharacters.push(data[i]);
//                     loading = false;
//                     console.log('Api ready')
//                 };
//             }
//             fetchMarvelCharacters();
//             createListener();
//         }
//     });
// };

// function fetchMarvelList(data){
//     data = data.data.results;
//     for(var i in data){
//         createCard(i,data);
//     }
//     createListener();
// };

// function createCard(i,data){
//     const card = `
//     <div class="card" id=${(data[i].id)}>
//     <h1>${data[i].name}</h1>
//     <img class="thumbnail" id=${'thumb'+data[i].id}" src=${data[i].thumbnail.path}/portrait_xlarge.${data[i].thumbnail.extension}>
//     <p id="description">${data[i].description}</p>
//     </div>`; // attention for this simbol: " ` "

//     if(data[i].description.length > 0){
//         container.innerHTML += card;
//         loader.style.display = 'none';
//     }
// };

function fetchMarvelCharacters(){
    var toCard = marvelCharacters.filter(f=>f.loadCard!=true);
    toCard.forEach(i =>{
        loadApi('series',i);
        createCard(i);
    });
};

function createCard(charObject){
    const card = `
    <div class="card" id=${(charObject.id)}>
    <h1>${charObject.name}</h1>
    <img class="thumbnail" id=${'thumb'+charObject.id}" 
    src=${charObject.thumbnail.path}/portrait_xlarge.${charObject.thumbnail.extension}>
    <p id="description">${charObject.description}</p>
    </div>`; // attention for this simbol: " ` "
    
    container.innerHTML += card;
    loader.style.display = 'none';
    charObject.loadCard=true;
    // console.log(marvelCharacters.find(i => i.id == charObject.id));
};    

function createCharacter(idCharacter){
    var charObject = marvelCharacters.find(i => i.id == idCharacter);
    var items = charObject.series.available;
    scroll = false;
    const character = document.getElementById('character');
    const card = document.getElementById(idCharacter);
    const clone = card.cloneNode(true);
    clone.setAttribute('id','char'+charObject.id);
    clone.setAttribute('class','charCard');
    clone.innerHTML += `<h2>${(items==0?'Sorry, there is no series available for this character':'Series')}</h2><div class="content" id="content" style="display:'';"></div>`;
    clone.innerHTML += `<div class="back" id="back"><img id="back" src='img/button-red-back.png' width=150px; height=50px;"></div>`;
    character.innerHTML = '';
    character.appendChild(clone);
    document.getElementById('back').addEventListener('click',function(){showCards()});
    document.getElementById('container').style.display = 'none';
    document.getElementById('preLoader').style.display = 'none';
    character.style.display = '';
    cardPosition = card;
    if(items>0){
        var counter = 0;
        var interval = window.setInterval(items, 1000);
        function items() {
            if(charObject.series.items.length > 0){
                charObject.series.items.forEach(i => createSeries(i));
                clearInterval(interval);
            }else if(counter == 10){
                clearInterval(interval);
                window.alert('Erro ao carregar a página')
            }
            counter++;
        };
    }
    character.scrollIntoView();
};    

function createSeries(charObject){
    const series = `
    <div class="series" id=${(charObject.id)}>
    <center><h3>${charObject.title}</h3></center>
    <img class="thumbnail" id=${'thumb'+charObject.id}" src=${charObject.thumbnail.path}/portrait_xlarge.${charObject.thumbnail.extension}>
    <p id="description">${(!charObject.description)?'':charObject.description}</p>
    </div>`; // attention for this simbol: " ` "
    
    const content = document.getElementById('content');
    content.innerHTML += series;
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