let cards = [
    { q: "Tire uma foto para gerar seus flashcards", a: "Clique no botão abaixo e selecione uma imagem" },
    { q: "A IA vai criar 3 perguntas e respostas", a: "Baseadas no conteúdo da sua foto" },
    { q: "Toque no card para ver a resposta", a: "Use os botões ‹ › para navegar entre os cards" }
];

let current = 0;
let flipped = false;

const flashCard    = document.getElementById("flashCard");
const questionText = document.getElementById("questionText");
const answerText   = document.getElementById("answerText");
const counter      = document.getElementById("counter");
const tapInfo      = document.getElementById("tapInfo");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");

function updateCard() {
    questionText.innerText = cards[current].q;
    answerText.innerText   = cards[current].a;
    counter.innerText      = `${current + 1} / ${cards.length}`;
    prevBtn.disabled       = current === 0;
    nextBtn.disabled       = current === cards.length - 1;
    flashCard.classList.remove("flipped");
    flipped = false;
    tapInfo.innerText = "Toque para ver resposta";
}

flashCard.addEventListener("click", () => {
    flipped = !flipped;
    flashCard.classList.toggle("flipped");
    tapInfo.innerText = flipped ? "Toque para ver pergunta" : "Toque para ver resposta";
});

prevBtn.addEventListener("click", () => {
    if (current > 0) { current--; updateCard(); }
});

nextBtn.addEventListener("click", () => {
    if (current < cards.length - 1) { current++; updateCard(); }
});


backButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

updateCard();

const exportBtn = document.querySelector(".export-btn");

const inputImagem = document.createElement("input");
inputImagem.type   = "file";
inputImagem.accept = "image/*";
inputImagem.style.display = "none";
document.body.appendChild(inputImagem);

const btnGerarIA = document.createElement("button");
btnGerarIA.className   = "export-btn";
btnGerarIA.textContent = "Gerar com IA (foto)";
btnGerarIA.style.marginTop = "8px";
exportBtn.parentNode.insertBefore(btnGerarIA, exportBtn.nextSibling);

const statusIA = document.createElement("p");
statusIA.style.cssText = "text-align:center;font-size:13px;color:#aaa;margin-top:6px;";
btnGerarIA.parentNode.insertBefore(statusIA, btnGerarIA.nextSibling);

btnGerarIA.addEventListener("click", () => inputImagem.click());

inputImagem.addEventListener("change", async () => {
    const arquivo = inputImagem.files[0];
    if (!arquivo) return;

    btnGerarIA.disabled    = true;
    statusIA.textContent   = "⏳ Gerando flashcards com IA...";

    try {
        const novosCards = await window.gerarFlashcards(arquivo);

        if (!novosCards || novosCards.length === 0) {
            throw new Error("Nenhum flashcard retornado.");
        }

        cards   = novosCards.map(c => ({ q: c.frente, a: c.verso }));
        current = 0;
        updateCard();

        statusIA.textContent = "✅ Flashcards gerados com sucesso!";
    } catch (e) {
        statusIA.textContent = "❌ Erro: " + e.message;
    } finally {
        btnGerarIA.disabled = false;
        inputImagem.value   = "";
    }
});