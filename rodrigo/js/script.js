const app = document.getElementById('root');

const logo = document.createElement('img');
logo.src = 'img/logo1.jpg';

const container = document.createElement('div');
container.setAttribute('class','container');

app.appendChild(logo);
app.appendChild(container);

//open a new connection using the get resquest
fetch('http://gateway.marvel.com/v1/public/characters?'+
'apikey=766611ab74f4e8ab5d5b29c5f6e7d398'+
'&hash=aea69f12a4b31ababd0c88e37b488550'+
'&ts=1'+
'&limit=100'+
'&modifiedSince=2010-01-01'+
'&offset=100'
)
//convert the response to json
.then(function(response){
    return response.json();
})
//work with the json information
.then(function(data){
    data = data.data.results;
    for(var i in data){
        const card = `
            <div class="card">
                <h1>${data[i].name}</h1>
                <img src=${data[i].thumbnail.path}/portrait_xlarge.${data[i].thumbnail.extension}>
                <p>${data[i].description}</p>
            </div>
        `; 
        if(data[i].description.length > 0){
            container.innerHTML += card;
        }
    }
    
})
