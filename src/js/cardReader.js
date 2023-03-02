const searchInput = document.getElementById("search-bar");
const content = document.getElementsByClassName("content")[0];
const genderFilter = document.getElementById("gender");
const statusFilter = document.getElementById("status");
let prevUri = '';
let nextUri = '';


function debounce(func, wait = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const processChange = debounce((name,isPrev,isNext) =>{
    let uri = '';
    if(isPrev){
        uri = prevUri;
    }else if(isNext){
        uri = nextUri;
    }else{
        uri = `https://rickandmortyapi.com/api/character/?name=${name}`;
    }
    if(searchInput.value !== ""){
        if(!isNext&&!isPrev){
            uri = applyFilters(uri);
        }
        fetch(uri)
            .then(res => res.json())
            .then(data => {
                createCards(data);
                setPrevAndNextUri(data);
            });
    }

});
searchInput.addEventListener("keyup", (e) => {
    processChange(e.target.value,false,false);
});

genderFilter.addEventListener('change', () => {processChange(searchInput.value,false,false)});
statusFilter.addEventListener('change', () => {processChange(searchInput.value,false,false)});


const setPrevAndNextUri = (apiData)=>{
    prevUri = apiData.info['prev'];
    nextUri = apiData.info['next'];
    const buttonContainer = document.getElementsByClassName('button-container')[0];
    while(buttonContainer.hasChildNodes()){
        buttonContainer.removeChild(buttonContainer.lastChild);
    }
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Page';
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous Page';
    if(prevUri!==null||nextUri!==null) {
        if (prevUri === null) {
            buttonContainer.appendChild(nextButton);
            nextButton.addEventListener('click', () => {
                processChange(searchInput.value, false, true)
            });
        } else if (nextUri === null) {
            prevButton.addEventListener('click', () => {
                processChange(searchInput.value, true, false)
            });
            buttonContainer.appendChild(prevButton);
        } else {
            nextButton.addEventListener('click', () => {
                processChange(searchInput.value, false, true)
            });
            prevButton.addEventListener('click', () => {
                processChange(searchInput.value, true, false)
            });
            buttonContainer.appendChild(prevButton);
            buttonContainer.appendChild(nextButton);
        }
    }
}
const createCards = (apiData) =>{
    while(content.hasChildNodes()){
        content.removeChild(content.lastChild);
    }
    apiData['results'].forEach(data => {
        const card = document.createElement('div');
        card.setAttribute('class','card');
        const cardImage = document.createElement('div');
        cardImage.setAttribute('class','card-image');
        const image = document.createElement('img');
        image.setAttribute('src',data['image']);
        cardImage.appendChild(image);
        card.appendChild(cardImage);
        const cardGender = document.createElement('div');
        cardGender.setAttribute('class','card-gender');
        const genderParagraph = document.createElement('p');
        const gender = new String(data['gender']);
        genderParagraph.innerText = 'Gender: ' + gender;
        cardGender.appendChild(genderParagraph);
        card.appendChild(cardGender);
        const cardSpecie = document.createElement('div');
        cardSpecie.setAttribute('class','card-specie');
        const specieParagraph = document.createElement('p');
        const specie = new String(data['species']);
        specieParagraph.innerText = 'Specie: '+ specie;
        cardSpecie.appendChild(specieParagraph);
        card.appendChild(cardSpecie);
        const cardStatus = document.createElement('div');
        cardStatus.setAttribute('class','card-status');
        const status = new String(data['status']);
        const statusParagraph = document.createElement('p');
        statusParagraph.innerText = status;
        cardStatus.appendChild(statusParagraph);
        card.appendChild(cardStatus);
        content.appendChild(card);
    });
}

const applyFilters = (uri) =>{
    uri = applyGenderFilter(uri);
    uri = applyStatusFilter(uri);
    return uri;
}

const applyGenderFilter = (uri) => {
    const genderFilterValue = genderFilter.value;
    if(genderFilterValue !== 'None'){
        uri = uri+`&gender=${genderFilterValue}`;
    }
    return uri;
}
const applyStatusFilter = (uri) => {
    const statusFilterValue = statusFilter.value;
    if(statusFilterValue !== 'None'){
        uri = uri+`&status=${statusFilterValue}`;
    }
    return uri;
}

