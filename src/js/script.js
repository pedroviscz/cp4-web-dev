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
  Centroavante: "ATA"
};

// elementos DOM
const playerlist = document.getElementById('playerlist');

// tudo aqui dentro acontece assim que a página carrega
window.onload = async () => {
  await loadPlayers();
  displayPlayers();
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
    localStorage.setItem("players", JSON.stringify(data));

    console.log("JSON salvo no localStorage pela primeira vez:", data);
  } else {
    console.log("Dados já existem no localStorage");
  }
}

function displayPlayers() {
  let players = localStorage.getItem('players');
  players = JSON.parse(players);

  players.forEach((player, index) => {
    const playerElement = document.createElement('div');
    playerElement.classList.add('playercard');

    playerElement.innerHTML = `
    <img src="${player.photo}" alt="">
    <div class="top-left">
          <span class="position">${POSITIONS_MAP[player.position]}</span>
          <button class="star-button">
            <img src="src/assets/img/icons8-estrela-100.png" alt="" />
          </button>
        </div>
    <span class="name">${player.name}</span>
    <span  class="club">${player.club}</span>
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

    playerlist.append(playerElement);
  });
}