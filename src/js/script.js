// tudo aqui dentro acontece assim que a página carrega
window.onload = () => {
  loadPlayers();
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