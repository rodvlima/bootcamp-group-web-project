createPage(null,null);

function createPage(type,id){
    type = (type==null?'main':type);
    
    const app = document.getElementById('root');
    const logo = document.createElement('img');
    logo.src = 'img/logo1.jpg';
    const container = document.createElement('div');
    
    if(type!='main'){
        app.innerHTML = "";
    }
    
    container.setAttribute('class','container');
    container.setAttribute('id','container');
    
    app.appendChild(logo);
    app.appendChild(container);
    
    loadCharacters(type,id);
};  

function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}
function apiAddress(type,value){
    const apiAddress = 'http://gateway.marvel.com/v1/public/';
    const getType = 'characters';
    const apikey = '766611ab74f4e8ab5d5b29c5f6e7d398';
    const hash = 'aea69f12a4b31ababd0c88e37b488550';
    const ts = '1';
    const limit = 100;
    const offset = 1000;
    const nameStartsWith = '';
    let parameters = (type == 'character'?'/'+value:'');
    parameters += '?limit='+limit+'&offset='+offset;
    
    const validation = '&apikey='+apikey+'&hash='+hash+'&ts='+ts;
    const api = apiAddress+getType+parameters+validation
    return api;
};

function loadCharacters(type,value){
    const api = apiAddress(type,value);
    //open a new connection using the get resquest
    fetch(api)
    //convert the response to json
    .then(function(response){
        return response.json();
    })
    //work with the json information
    .then(function(data){
        data = data.data.results;
        for(var i in data){
            //create and populate the card
            const card = `
                <div class="card" id=${data[i].id}>
                    <h1>${data[i].name}</h1>
                    <img src=${data[i].thumbnail.path}/portrait_xlarge.${data[i].thumbnail.extension}>
                    <p>${data[i].description}</p>
                </div>
            `; // attention for this simbol: " ` "
            if(data[i].description.length > 0){
                container.innerHTML += card;
            }
        }
        var children = document.getElementsByClassName("card");
        for(var i = 0; type == 'main' && i < children.length; i++){
            const idCharacter = document.getElementById(children[i].id);
            var listener = document.getElementById(idCharacter.id).addEventListener("click",function(){
                console.log(idCharacter.id);
                createPage('character',idCharacter.id)


        });
    }
    })
};

