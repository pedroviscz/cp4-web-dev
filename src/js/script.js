const POSITIONS_MAP = {
  Goleiro: "GOL",
  Zagueira: "ZAG",
  Zagueiro: "ZAG",
  LateralDireito: "LD",
  LateralEsquerdo: "LE",
  Volante: "VOL",
  "Meio-campo": "MEI",
  "Meia Central": "MC",
  "Meia Ofensivo": "MEI",
  "Meia Direita": "MD",
  "Meia Esquerda": "ME",
  "Ponta Direita": "PD",
  "Ponta Esquerda": "PE",
  "Segundo Atacante": "SA",
  Atacante: "ATA",
  Centroavante: "ATA",
};

const savePlayers = (key, value) => 
  localStorage.setItem(key, JSON.stringify(value));

// elementos DOM
const playerlist = document.getElementById('playerlist');

// tudo aqui dentro acontece assim que a página carrega
window.onload = async () => {
  await loadPlayers();
  displayPlayers();
  playerlist.addEventListener('click', handlePlayerListClick);
};

// função que carrega o JSON local
async function loadJSON() {
  try {
    // faz a requisição do JSON local
    const response = await fetch('./src/json/players.json');

    // se o status da requisição for diferente de ok: true lança erro
    if (!response.ok) throw new Error("Erro ao carregar JSON");

    // o método .json() retorna o json do corpo da resposta
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function loadPlayers() {
  localStorage.clear();

  // se não encontrar a chave players no local storage
  if (!localStorage.getItem("players")) {
    // carrega o JSON local
    const data = await loadJSON();

    // salva o JSON no localStorage
    savePlayers("players", data);
    console.log("JSON salvo no localStorage pela primeira vez:", data);
    
  } else {
    console.log("Dados já existem no localStorage");
  }
}

function displayPlayers() {
  // limpa a lista de players toda vez antes de mostrar
  playerlist.innerHTML = '';

  // pega os player do localstorage como string
  let players = localStorage.getItem('players');

  // transforma em array
  players = JSON.parse(players);

  // itera e cria uma div playercard para cada player do JSON
  players.forEach((player, index) => {
    const playerElement = document.createElement('div');
    playerElement.classList.add('playercard');

    // insere o conteúdo do card
    playerElement.innerHTML = `
      <img src="${player.photo}" alt="">
      <div class="top-left">
        <span class="position">${POSITIONS_MAP[player.position]}</span>
        <button data-action="favorite" data-index="${index}" class="star-button">
          <img src="src/assets/img/estrela${player.favorite ? 1 : 0}.png" alt="" />
        </button>
      </div>
      <span class="name">${player.name}</span>
      <span class="club">${player.club}</span>
      <div class="stats">
        <div class="stat">
          <span>Gols</span>
          <span>${player.goals}</span>
        </div>
        <div class="stat">
          <span>Assist.</span>
          <span>${player.assists}</span>
        </div>
        <div class="stat">
          <span>Jogos</span>
          <span>${player.games}</span>
        </div>
      </div>
    `;

    // adiona o elemento ao nó
    playerlist.append(playerElement);
  });
}

const favoritePlayer = (index) => {
  // pega os players do localStorage e converte pra array
  let players = JSON.parse(localStorage.getItem("players"));

  // coloca o oposto do que estava em favorite
  players[index].favorite = !players[index].favorite;

  // seta as informações atualizadas no localstorage
  savePlayers("players", players);

  // atualiza vizualização das jogadoras
  displayPlayers();
}

function handlePlayerListClick(event) {
  const clickedElement = event.target.closest("button");
  if (!clickedElement) return;

  const { action, index } = clickedElement.dataset;

  const actions = {
    favorite: favoritePlayer
  };

  // aqui eu chamo a função e passo index como parâmetro
  if (actions[action]) actions[action](index);
}