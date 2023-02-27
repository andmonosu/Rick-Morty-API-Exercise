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
    const footer = document.getElementsByTagName('footer')[0];
    while(footer.hasChildNodes()){
        footer.removeChild(footer.lastChild);
    }
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Page';
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous Page';
    if(prevUri===null){
        footer.appendChild(nextButton);
        nextButton.addEventListener('click', () => {processChange(searchInput.value,false,true)});
    }else if(nextUri===null){
        prevButton.addEventListener('click', () => {processChange(searchInput.value,true,false)});
        footer.appendChild(prevButton);
    }else{
        nextButton.addEventListener('click', () => {processChange(searchInput.value,false,true)});
        prevButton.addEventListener('click', () => {processChange(searchInput.value,true,false)});
        footer.appendChild(prevButton);
        footer.appendChild(nextButton);
    }
}
const createCards = (apiData) =>{
    while(content.hasChildNodes()){
        content.removeChild(content.lastChild);
    }
    apiData['results'].forEach(data => {
        const image = document.createElement('img');
        image.setAttribute('src',data['image']);
        content.appendChild(image);
        const genderParagraph = document.createElement('p')
        const gender = new String(data['gender']);
        genderParagraph.innerText = gender;
        //content.appendChild(genderParagraph);

        const speciesParagraph = document.createElement('p')
        const species = new String(data['species']);
        speciesParagraph.innerText = species;
        //content.appendChild(speciesParagraph);
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

