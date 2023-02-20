const searchInput = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const content = document.getElementsByClassName("content")[0];
const processChange = (name) =>{
    fetch(`https://rickandmortyapi.com/api/character/?name=${name}`)
        .then(res => res.json())
        .then(data => createCards(data));
};
searchButton.addEventListener("click", ()=>{
    while(content.hasChildNodes()){
        content.removeChild(content.lastChild)
    }
    processChange(searchInput.value)
});
const createCards = (apiData) =>{
    apiData['results'].forEach(data => {
        const image = document.createElement('img');
        image.setAttribute('src',data['image']);
        content.appendChild(image);
    });
}