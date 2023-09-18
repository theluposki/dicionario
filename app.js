const API_URL = "https://api.dicionario-aberto.net";

const NEWS = "/news?limit=10";

const WORD = "/word/";
const BROWSE = "/browse/";

const input = document.getElementById("input");
const output = document.getElementById("output");
const btnSearch = document.getElementById("btnSearch");
const ElSuggestions = document.getElementById("suggestions");

let timeoutSuggestions;

ElSuggestions.style.display = "none";

const suggestions = () => {
  clearTimeout(timeoutSuggestions);

  if (!input.value) return;

  timeoutSuggestions = setTimeout(async () => {
    const text = input.value;
    ElSuggestions.innerHTML = "";

    if (!text.trim()) {
      ElSuggestions.style.display = "none"
      return;
    }

    const response = await fetch(
      `${API_URL}${BROWSE}${text.toLocaleLowerCase()}`
    );

    if (response.status === 400 || response.status === 404) {
      return;
    }

    const data = await response.json();

    ElSuggestions.style.display = "flex";

    data.words.forEach((item, index) => {
      ElSuggestions.innerHTML += `<li data-item="${index}" class="${
        item.word === text.toLocaleLowerCase() ? "item-sug active" : "item-sug"
      }">${item.word}</li>`;
    });
  }, 600);
};

ElSuggestions.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const content = e.target.textContent;
    input.value = content;
    ElSuggestions.style.display = "none";
  }
});

input.addEventListener("keydown", suggestions);

btnSearch.addEventListener("click", async () => {
  if (!input.value) return;

  output.innerHTML = "";

  const text = input.value;

  const response = await fetch(`${API_URL}${WORD}${text.toLocaleLowerCase()}`);

  console.log(response.status);

  const data = await response.json();

  if (data.error) {
    output.innerHTML += `
    <div class="content-output">
      <strong>${data.error}</strong>
      <p>Não foi encontrada.</p>
    </div>
    `;
    return;
  }

  ElSuggestions.innerHTML = "";
  ElSuggestions.style.display = "none";

  console.log(data);
  data.forEach((item) => {
    output.innerHTML += `
    <div class="content-output">
      <strong>${item.word}</strong>
      <p>${item.xml}</p>
    </div>
    `;
  });
});
