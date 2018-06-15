createMainPage();

function createMainPage(){

    const app = document.getElementById('root');
    
    const logo = document.createElement('img');
    logo.src = 'img/logo1.jpg';
    
    const spam = document.createElement('spam');
    spam.setAttribute('class','temp');
    spam.setAttribute('id','temp');
    spam.setAttribute('offset','100');
    spam.setAttribute('scroll','');
    
    const container = document.createElement('div');
    container.setAttribute('class','container');
    container.setAttribute('id','container');
    
    const character = document.createElement('div');
    character.setAttribute('class','character');
    character.setAttribute('id','character');
    character.style.display = 'none';
    
    app.appendChild(logo);
    app.appendChild(spam);
    app.appendChild(container);
    app.appendChild(character);
    
    window.onscroll = function(){
        if(character.style.display == 'none'){
            if((window.innerHeight+this.window.scrollY) >= this.document.body.scrollHeight){
                scrollBottom();
            }
        }
    }
    loadApi(null,null,null);
};  

function scrollBottom(){
    const offsetId = document.getElementById('temp').getAttribute('offset');
    document.getElementById('temp').setAttribute('offset',parseInt(offsetId)+100);
    loadApi(null,null,offsetId);
};

function loadApi(type,value,offset){
    const api = apiAddress(type,value,offset);
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

function apiAddress(type,value,offset){
    const apiAddress = 'http://gateway.marvel.com/v1/public/';
    const getType = 'characters';
    const apikey = '766611ab74f4e8ab5d5b29c5f6e7d398';
    const hash = 'aea69f12a4b31ababd0c88e37b488550';
    const ts = '1';
    const limit = 100;
    const orderBy = 'name';
    // const offset = offset;
    const nameStartsWith = '';
    let parameters = (type == 'character'?'/'+value:'');
    parameters += '?orderBy='+orderBy+'&limit='+limit+'&offset='+offset;
    
    const validation = '&apikey='+apikey+'&hash='+hash+'&ts='+ts;
    const api = apiAddress+getType+parameters+validation
    return api;
};

function fetchMarvelList(type,value,data){
    data = data.data.results;
    for(var i in data){
        createCard(type,i,data);
    }
    createListener(type,value);
};

function createCard(type,i,data){
    const card = `
        <div class="card" id=${(type=='character'?'char'+data[i].id:data[i].id)}>
        <h1>${data[i].name}</h1>
        <img src=${data[i].thumbnail.path}/portrait_xlarge.${data[i].thumbnail.extension}>
        <p>${data[i].description}</p>
        </div>
        `; // attention for this simbol: " ` "
    if(data[i].description.length > 0){
        if(type == 'character'){
            character.innerHTML = "";
            character.innerHTML += card;
            container.style.display = 'none';
            character.style.display = '';
        }else{
            container.innerHTML += card;
        }
    }
};

function createListener(type,value){
    if(type=="character"){
        document.getElementById('char'+value).addEventListener("click",function(){
            character.style.display = 'none';
            container.style.display = '';
            
            // const scroll = document.getElementById('temp').getAttribute('scroll');
            // console.log("scroll");
            // console.log(scroll);
            // window.scrollTo(0,scroll);
            
        });
    }else{
        var children = document.getElementsByClassName("card");
        for(var i = 0;i < children.length; i++){

            // document.getElementById('temp').setAttribute('scroll',window.innerHeight+this.window.scrollY+100);
            
            const idCharacter = document.getElementById(children[i].id);
            document.getElementById(idCharacter.id).addEventListener("click",function(){
                loadApi('character',idCharacter.id,null);
            });
        }
    }
};

function clearElement(elementID){
    document.getElementById(elementID).innerHTML = "";
};
