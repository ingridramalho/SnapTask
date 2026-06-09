const copyBtn    = document.getElementById("copyBtn");
const editorArea = document.getElementById("editorArea");
const codeBox    = document.getElementById("codeBox");
const langBadge  = document.querySelector(".lang-badge");

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(editorArea.value);
    copyBtn.innerText = "Copiado!";
    setTimeout(() => { copyBtn.innerText = "Copiar Código"; }, 2000);
});

const previewBox = document.querySelector(".preview-box");

const inputCod = document.createElement("input");
inputCod.type   = "file";
inputCod.accept = "image/*";
inputCod.style.display = "none";
document.body.appendChild(inputCod);

const btnAnalisarIA = document.createElement("button");
btnAnalisarIA.className   = "copy-btn";
btnAnalisarIA.textContent = "📷 Analisar foto com IA";
btnAnalisarIA.style.cssText = "width:100%;margin-top:10px;";
previewBox.insertAdjacentElement("afterend", btnAnalisarIA);

const statusCod = document.createElement("p");
statusCod.style.cssText = "text-align:center;font-size:13px;color:#aaa;margin-top:6px;";
btnAnalisarIA.insertAdjacentElement("afterend", statusCod);

btnAnalisarIA.addEventListener("click", () => inputCod.click());

inputCod.addEventListener("change", async () => {
    const arquivo = inputCod.files[0];
    if (!arquivo) return;

    btnAnalisarIA.disabled = true;
    statusCod.textContent  = "⏳ Analisando código na imagem...";
    editorArea.value       = "Aguarde...";

    try {
        const resultado = await window.lerCodigo(arquivo);

        if (langBadge) langBadge.textContent = resultado.linguagem;

        editorArea.value = resultado.codigo;

        codeBox.innerHTML = `<pre><code>${resultado.codigo.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>`;

        statusCod.textContent = `✅ Linguagem detectada: ${resultado.linguagem}`;
    } catch (e) {
        statusCod.textContent = "❌ Erro: " + e.message;
        editorArea.value = "";
    } finally {
        btnAnalisarIA.disabled = false;
        inputCod.value = "";
    }
});