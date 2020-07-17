// Geolocalização ////////////////////////////////////////////////
var coordinates = {};

var options = {
    enableHighAccuracy: true,
    timeout: 5000, // tempo antes de chamar o erro
    maximumAge: 0
};



function sucess (pos) {
    coordinates = pos.coords;

    console.log('Sua localização:');
    console.log(`Latitude: ${coordinates.latitude}`);
    console.log(`Longitude: ${coordinates.longitude}`);
    console.log(`Acurácia: ${coordinates.accuracy}m`);
}

function error (err) {
    console.warn(`ERRO(${err.code}: ${err.message})`);

    if (err.code === 1) {
        coordinates.latitude = -7.11532; // João Pessoa, Paraíba
        coordinates.longitude = -34.861;
    }
}



// Buscar no Flickr API ////////////////////////////////////////////////

const apiKey = "e1b93107b916d11d423cc76107600b2e";

const myImage = document.querySelector('img');

var searchURL = "";
var data = {};

const btnSkip = document.getElementById('btnSkip');
var photoIndex = 0;

var imageUrl = "";

const subtitle = document.getElementById('subtitle');
var subText= "";

var clickAudio = new Audio('_audio/click.wav');

function getWord () {
    const searchWord = document.getElementById('searchWord');
    let word = searchWord.value.trim().toLowerCase();
    console.log(word);
    subText =`<p id="titulo">${word}</p> <p id="local">lat:${coordinates.latitude.toFixed(4)} &nbsp &nbsp long:${coordinates.longitude.toFixed(4)}</p>`;
    subtitle.innerHTML = subText;
    searchURL = constructSearchURL (coordinates.latitude, coordinates.longitude, word);
    showImage (searchURL);
    
}

function constructSearchURL (lat, long, word) {
    return "https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/?api_key=" + apiKey +
    "&format=json&nojsoncallback=1&method=flickr.photos.search&safe_search=1&per_page=5&lat=" + lat +
    "&lon=" + long + 
    "&text=" + word;
}


function showImage (searchURL) {
    fetch (searchURL)
    .then (function (resp) {
        return resp.json();
    })
    .then (function (resp) {
        data = resp;
        imageUrl = constructImageURL(data.photos.photo[0]);
        console.log(imageUrl);
        myImage.src = imageUrl;
        clickAudio.play();

        btnSkip.addEventListener('click', skipImage);

        return data;
    })
    .catch(err => {console.error(err.message)});
}




function skipImage (event) {
    var btn = event.target.id;
    console.log(btn);

    if (btn === "btnRight" && photoIndex < data.photos.photo.length - 1) {
        photoIndex++;
        imageUrl = constructImageURL(data.photos.photo[photoIndex]);
        console.log(imageUrl);
        myImage.src = imageUrl;
    } else if (btn === "btnRight" && photoIndex === data.photos.photo.length - 1) {
        photoIndex = 0;
        imageUrl = constructImageURL(data.photos.photo[photoIndex]);
        console.log(imageUrl);
        myImage.src = imageUrl;
        clickAudio.play();
    } else if (btn === "btnLeft" && photoIndex > 0) {
        photoIndex--;
        imageUrl = constructImageURL(data.photos.photo[photoIndex]);
        console.log(imageUrl);
        myImage.src = imageUrl;
    } else if (btn === "btnLeft" && photoIndex === 0) {
        photoIndex = data.photos.photo.length - 1;
        imageUrl = constructImageURL(data.photos.photo[photoIndex]);
        console.log(imageUrl);
        myImage.src = imageUrl;
        clickAudio.play();
    } else {
        return;
    }
}

// function skipImage (event) {
//     var btn = event.target.id;
//     console.log(btn);
//     if (btn === "btnRight" && photoIndex < data.photos.photo.length - 1) {
//         photoIndex++;
//         imageUrl = constructImageURL(data.photos.photo[photoIndex]);
//         console.log(imageUrl);
//         myImage.src = imageUrl;
//     } else if (btn === "btnLeft" && photoIndex > 0) {
//         photoIndex--;
//         imageUrl = constructImageURL(data.photos.photo[photoIndex]);
//         console.log(imageUrl);
//         myImage.src = imageUrl;
//     } else {
//         return;
//     }
// }



function constructImageURL (photoObj) {
    return "https://farm" + photoObj.farm +
            ".staticflickr.com/" + photoObj.server +
            "/" + photoObj.id + "_" + photoObj.secret + ".jpg";
}
// const imageUrl = constructImageURL(data.photos.photo[0]);





// FUNÇÃO PRINCIPAL ///////////////////////////////////////////
window.onload = main;
function main() {

    // inicia com imagens das praias de João Pessoa, Paraíba
    searchURL =  "https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/?api_key=e1b93107b916d11d423cc76107600b2e&format=json&nojsoncallback=1&method=flickr.photos.search&safe_search=1&per_page=5&lat=-7.11532&lon=-34.861&text=praia";
    showImage (searchURL);
    subText =`<p id="titulo">praias</p> <p id="local">lat:-7.1153 &nbsp &nbsp long:-34.8610</p>`;
    subtitle.innerHTML = subText;
    navigator.geolocation.getCurrentPosition(sucess, error, options);

    const button = document.getElementById('btnSearch');
    button.addEventListener('click', getWord);

}