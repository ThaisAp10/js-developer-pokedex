const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onClick="pokemonClick(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

// evento click no pokemon da lista

const pokemonClick = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const resp = await fetch(url)
    const pokemon = await resp.json()
    displayPokemon(pokemon)
}

// abre a tela com as informações do pokemon

const displayPokemon = (pokemon) => {
    const imagem = pokemon.sprites.other.dream_world.front_default
    const types = pokemon.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    const generateHtml = `
    <div class="display">
    <div id="details">
        <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.id}</span>
        <span class="name">#${pokemon.name}</span>
        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
        </div>
    <img id="pokemon-img" src="${imagem}"
        alt="${pokemon.name}">
    <div id="data">
        <h4>Infos</h4>
    <div id="small-info">
    </div>
    <div class="small-info-data">
        <p class="${type}">Height:${(pokemon.height/10).toFixed(2)} m</p> 
        <p class="${type}">Weight:${(pokemon.weight/10)} kg</p>
    </div>
    </li>
    <button id="closeBtn" onClick="closeDisplay()">X</button>
    </div> 
    </div>
    </div>                  
    `

    pokemonList.innerHTML = generateHtml + pokemonList.innerHTML
}

//Fechar a tela
const closeDisplay = () => {
    const display = document.querySelector('.display')
    display.parentElement.removeChild(display)
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})