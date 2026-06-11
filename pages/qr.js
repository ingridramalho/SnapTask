(() => {
    document.addEventListener("DOMContentLoaded", () => {

        const BACKEND_URL = "https://snaptaskbackend.onrender.com";

        const backButton     = document.getElementById("backButton");
        const sideMenu       = document.getElementById("sideMenu");
        const generateBtn    = document.getElementById("generateBtn");
        const qrContainer    = document.getElementById("qrContainer");
        const linkBox        = document.getElementById("linkBox");
        const linkText       = document.getElementById("linkText");
        const copyBtn        = document.getElementById("copyBtn");

        if (backButton && sideMenu) {
            backButton.addEventListener("click", () => sideMenu.classList.toggle("open"));
            document.addEventListener("click", (e) => {
                if (!sideMenu.contains(e.target) && !backButton.contains(e.target)) {
                    sideMenu.classList.remove("open");
                }
            });
        }

        const realImageInput = document.createElement("input");
        realImageInput.type   = "file";
        realImageInput.accept = "image/*";
        realImageInput.style.display = "none";
        realImageInput.id = "realImageInput";
        document.body.appendChild(realImageInput);

        if (!generateBtn || !qrContainer) return;

        generateBtn.addEventListener("click", () => {

            if (generateBtn.innerText === "Gerar novo link") {
                resetarTela();
                return;
            }

            realImageInput.click();
        });

        realImageInput.addEventListener("change", async () => {
            const arquivo = realImageInput.files[0];
            if (!arquivo) return;

            generateBtn.disabled  = true;
            generateBtn.innerText = "Enviando...";
            qrContainer.innerHTML = `<p style="color:#777;font-size:14px;text-align:center;">⏳ Fazendo upload e gerando QR...</p>`;

            const formData = new FormData();
            formData.append("imagem", arquivo);

            try {
                const resposta = await fetch(`${BACKEND_URL}/gerar_qr`, {
                    method: "POST",
                    body: formData
                });

                if (!resposta.ok) throw new Error("Erro no servidor.");

                const dados = await resposta.json();

                if (dados.erro) {
                    alert("Erro: " + dados.erro);
                    resetarTela();
                    return;
                }

                qrContainer.innerHTML = `<img src="data:image/png;base64,${dados.qr_base64}" style="width:100%;border-radius:8px;" alt="QR Code">`;

                if (linkText) linkText.innerText = dados.link;
                if (linkBox)  linkBox.classList.remove("hidden");

                generateBtn.innerText = "Gerar novo link";

            } catch (erro) {
                console.error(erro);
                alert("Erro ao gerar QR: " + erro.message);
                resetarTela();
            } finally {
                generateBtn.disabled = false;
                realImageInput.value = "";
            }
        });

        if (copyBtn && linkText) {
            copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(linkText.innerText).then(() => {
                    copyBtn.innerText     = "Copiado! ✓";
                    copyBtn.style.color   = "#00ff00";
                    setTimeout(() => {
                        copyBtn.innerText   = "Copiar";
                        copyBtn.style.color = "";
                    }, 2000);
                });
            });
        }

        function resetarTela() {
            qrContainer.innerHTML = `
                <img src="../images/link.png" alt="Link" class="qr-icon" id="initialIcon">
                <p id="initialText">Gere um link para compartilhar</p>
            `;
            if (linkBox) linkBox.classList.add("hidden");
            generateBtn.innerText = "Gerar Link";
        }

    });
})();