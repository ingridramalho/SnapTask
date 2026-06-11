const documents = [
    { title: "Aula de Cálculo II - Integrais", date: "Hoje, 14:30", preview: "Integral definida: ∫ab f(x)dx = F(b) - F(a)...", text: `Integral Definida\n\nA integral definida de uma função f(x) no intervalo [a, b] é dada por:\n∫ab f(x)dx = F(b) - F(a)\nOnde F(x) é a primitiva de f(x).\n\nPropriedades:\n• Linearidade\n• Intervalo nulo\n• Aditividade\n\nTécnicas:\n1. Substituição simples\n2. Integração por partes\n3. Frações parciais` },
    { title: "Reunião de Projeto - Sprint 4", date: "Ontem, 10:15", preview: "Tarefas pendentes: refatorar módulo de auth...", text: `Sprint 4 - Notas da Reunião\n\nParticipantes:\nAna, Pedro, Lucas e Mariana\n\nTarefas:\n• Refatorar autenticação\n• Implementar testes E2E\n• Revisar PR dark-mode\n\nNova reunião:\nSexta-feira às 14h` },
    { title: "Fórmulas de Física - Termodinâmica", date: "12 Abr, 09:00", preview: "1ª Lei: ΔU = Q - W...", text: `Termodinâmica - Resumo\n\n1ª Lei:\nΔU = Q - W\n\n2ª Lei:\nΔS ≥ 0\n\nEquações:\n• PV = nRT\n• W = P·ΔV\n• Q = mcΔT\n\nAplicações:\n- Motores térmicos\n- Refrigeradores` },
    { title: "Brainstorm - Design do App", date: "10 Abr, 16:45", preview: "Paleta de cores: dark theme, acentos dourados...", text: `Brainstorm - Redesign do App\n\nPaleta:\n• Background escuro\n• Dourado/âmbar\n• Verde menta\n\nLayout:\n- Glass morphism\n- Bordas arredondadas\n- Animações suaves\n\nPrioridades:\n1. Bottom sheet\n2. Tabs animadas\n3. Cards expansíveis` }
];

const docsContainer    = document.getElementById("docsContainer");
const editorScreen     = document.getElementById("editorScreen");
const documentScreen   = document.getElementById("documentScreen");
const docTitle         = document.getElementById("docTitle");
const docDate          = document.getElementById("docDate");
const docTextarea      = document.getElementById("docTextarea");
const processingOverlay = document.getElementById("processingOverlay");
const previewPaper     = document.getElementById("previewPaper");
const processBtn       = document.getElementById("processBtn");

documents.forEach((doc, index) => {
    docsContainer.innerHTML += `
    <div class="doc-card" onclick="openDocument(${index})">
        <div class="doc-icon"><img src="../images/editor-doc.png"></div>
        <div class="doc-info">
            <h3>${doc.title}</h3>
            <small>${doc.date}</small>
            <p>${doc.preview}</p>
        </div>
        <div class="doc-arrow">›</div>
    </div>`;
});

function openDocument(index) {
    const doc = documents[index];
    docTitle.innerText   = doc.title;
    docDate.innerText    = doc.date;
    docTextarea.value    = doc.text;
    editorScreen.classList.add("hidden");
    documentScreen.classList.remove("hidden");
    previewPaper.classList.remove("processed");
    processBtn.innerHTML = `<img src="../images/maximize.png"><span>Corrigir Perspectiva</span>`;
}

function closeDocument() {
    documentScreen.classList.add("hidden");
    editorScreen.classList.remove("hidden");
}

function processDocument() {
    processingOverlay.classList.remove("hidden");
    setTimeout(() => {
        processingOverlay.classList.add("hidden");
        previewPaper.classList.add("processed");
        processBtn.innerHTML = `<img src="../images/maximize.png"><span>Reprocessar</span>`;
    }, 1500);
}

const cardIA = document.createElement("div");
cardIA.className = "doc-card";
cardIA.style.cssText = "border: 1px dashed #6c63ff; cursor:pointer;";
cardIA.innerHTML = `
    <div class="doc-icon"><img src="../images/editor-doc.png"></div>
    <div class="doc-info">
        <h3>Transcrever imagem com IA</h3>
        <small>Selecione uma foto de lousa ou caderno</small>
        <p>O Gemini extrai e organiza o texto automaticamente</p>
    </div>
    <div class="doc-arrow">›</div>`;
docsContainer.prepend(cardIA);

const inputDoc = document.createElement("input");
inputDoc.type   = "file";
inputDoc.accept = "image/*";
inputDoc.style.display = "none";
document.body.appendChild(inputDoc);

cardIA.addEventListener("click", () => inputDoc.click());

inputDoc.addEventListener("change", async () => {
    const arquivo = inputDoc.files[0];
    if (!arquivo) return;

    docTitle.innerText   = "Transcrevendo com IA...";
    docDate.innerText    = "Aguarde";
    docTextarea.value    = "⏳ Processando imagem...";
    editorScreen.classList.add("hidden");
    documentScreen.classList.remove("hidden");
    processingOverlay.classList.remove("hidden");

    try {
        const texto = await window.gerarDocumento(arquivo);
        docTitle.innerText   = "Documento gerado pela IA";
        docDate.innerText    = "Agora";
        docTextarea.value    = texto;
    } catch (e) {
        docTextarea.value = "❌ Erro: " + e.message;
    } finally {
        processingOverlay.classList.add("hidden");
        inputDoc.value = "";
    }
});