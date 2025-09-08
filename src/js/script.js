const POSITIONS_MAP = {
  Goleiro: "GOL",
  Zagueira: "ZAG",
  "Lateral Direito": "LD",
  "Lateral Esquerdo": "LE",
  Volante: "VOL",
  "Meia Central": "MC",
  "Meio-campo": "MEI",
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

const playerlist = document.getElementById("playerlist");

// tudo aqui dentro acontece assim que a página carrega
window.onload = async () => {
  await loadPlayers();
  displayPlayers();
  playerlist.addEventListener("click", handlePlayerListClick);
};

// função que carrega o JSON local
async function loadJSON() {
  try {
    // faz a requisição do JSON local
    const response = await fetch("./src/json/players.json");

    // se o status da requisição for diferente de ok: true lança erro
    if (!response.ok) throw new Error("Erro ao carregar JSON");

    // o método .json() retorna o json do corpo da resposta
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function loadPlayers() {
  // localStorage.clear();

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
  playerlist.innerHTML = "";

  // pega os player do localstorage como string
  let players = localStorage.getItem("players");

  // transforma em array
  players = JSON.parse(players);

  // itera e cria uma div playercard para cada player do JSON
  players.forEach((player, index) => {
    const playerElement = document.createElement("div");
    playerElement.classList.add("playercard");

    // insere o conteúdo do card
    playerElement.innerHTML = `
      <img src="${player.photo}" alt="">
      <div class="top-left">
        <span class="position">${POSITIONS_MAP[player.position]}</span>
        <button data-action="favorite" data-index="${index}" class="star-button">
          <img src="src/assets/img/estrela${
            player.favorite ? 1 : 0
          }.png" alt="" />
        </button>
        <button data-action="edit" data-index="${index}" class="edit-button"><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="24px" fill="#0084ff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
        <button data-action="delete" data-index="${index}" class="delete-button"><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="24px" fill="#e74c3c"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
      </div>
      <span class="name">${player.name}</span>
      <span class="club">${player.club}</span>
      <div class="stats">
        <div class="stat">
          <span>Jogos</span>
          <span>${player.games}</span>
        </div>
        <div class="stat">
          <span>Gols</span>
          <span>${player.goals}</span>
        </div>
        <div class="stat">
          <span>Assist.</span>
          <span>${player.assists}</span>
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
};

const createPlayer = (playerData) => {
  let players = JSON.parse(localStorage.getItem("players")) || [];
  players.push(playerData);
  savePlayers("players", players);
  displayPlayers();
  alert("Jogadora adicionada com sucesso!");
};

document.getElementById("playerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const playerData = {
    name: document.getElementById("name").value,
    position: document.getElementById("position").value,
    club: document.getElementById("club").value,
    photo: document.getElementById("photo").value,
    goals: Number(document.getElementById("goals").value),
    assists: Number(document.getElementById("assists").value),
    games: Number(document.getElementById("games").value),
    favorite: false,
  };

  createPlayer(playerData);
  e.target.reset();
});

const updatePlayer = (index) => {
  let players = JSON.parse(localStorage.getItem("players"));

  const player = players[index];

  player.name = prompt("Edite o nome:", player.name);
  player.position = prompt("Edite a posição:", player.position);
  player.club = prompt("Edite o clube:", player.club);
  player.photo = prompt("Edite a URL da foto:", player.photo);
  player.goals = Number(prompt("Edite os gols:", player.goals));
  player.assists = Number(prompt("Edite as assistências:", player.assists));
  player.games = Number(prompt("Edite os jogos:", player.games));

  // atualiza no LocalStorage
  savePlayers("players", players);

  // Atualiza a tela
  displayPlayers();
  alert("Jogadora editada com sucesso!");
};

const deletePlayer = (index) => {
  let players = JSON.parse(localStorage.getItem("players"));
  players.splice(index, 1);
  savePlayers("players", players);
  displayPlayers();
  alert("Jogadora removida com sucesso!");
};

function handlePlayerListClick(event) {
  const clickedElement = event.target.closest("button");
  if (!clickedElement) return;

  const { action, index } = clickedElement.dataset;

  const actions = {
    favorite: favoritePlayer,
    edit: (i) => {
      updatePlayer(i);
    },
    delete: deletePlayer,
  };

  // aqui eu chamo a função e passo index como parâmetro
  if (actions[action]) actions[action](index);
}
