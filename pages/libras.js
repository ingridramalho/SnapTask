const videoTab    = document.getElementById("videoTab");
const micTab      = document.getElementById("micTab");
const videoMode   = document.getElementById("videoMode");
const micMode     = document.getElementById("micMode");

videoTab.onclick = () => {
    videoTab.classList.add("active");
    micTab.classList.remove("active");
    videoMode.classList.remove("hidden");
    micMode.classList.add("hidden");
};

micTab.onclick = () => {
    micTab.classList.add("active");
    videoTab.classList.remove("active");
    micMode.classList.remove("hidden");
    videoMode.classList.add("hidden");
};

const uploadBtn       = document.getElementById("uploadBtn");
const videoPreview    = document.getElementById("videoPreview");
const transcriptionArea = document.getElementById("transcriptionArea");
const typingText      = document.getElementById("typingText");
const processingText  = document.getElementById("processingText");
const editableText    = document.getElementById("editableText");
const editableBadge   = document.getElementById("editableBadge");
const newVideoBtn     = document.getElementById("newVideoBtn");
const videoStatus     = document.getElementById("videoStatus");

const inputVideo = document.createElement("input");
inputVideo.type   = "file";
inputVideo.accept = "video/mp4,video/*";
inputVideo.style.display = "none";
document.body.appendChild(inputVideo);

uploadBtn.onclick = () => inputVideo.click();

inputVideo.addEventListener("change", async () => {
    const arquivo = inputVideo.files[0];
    if (!arquivo) return;

    uploadBtn.classList.add("hidden");
    videoPreview.classList.remove("hidden");
    transcriptionArea.classList.remove("hidden");
    processingText.classList.remove("hidden");
    editableText.classList.add("hidden");
    newVideoBtn.classList.add("hidden");
    typingText.innerHTML = "";
    videoStatus.innerHTML = "Enviando vídeo para a IA...";

    if (arquivo.size > 10 * 1024 * 1024) {
        videoStatus.innerHTML = "Vídeo grande, pode demorar um pouco...";
    }

    try {
        const traducao = await window.traduzirLibras(arquivo);

        videoStatus.innerHTML = "Vídeo processado";
        let index = 0;
        const interval = setInterval(() => {
            if (index < traducao.length) {
                typingText.innerHTML += traducao[index];
                index++;
            } else {
                clearInterval(interval);
                processingText.classList.add("hidden");
                editableText.classList.remove("hidden");
                editableText.value = traducao;
                editableBadge.classList.remove("hidden");
                newVideoBtn.classList.remove("hidden");
            }
        }, 30);

    } catch (e) {
        videoStatus.innerHTML  = "❌ Erro ao processar";
        typingText.innerHTML   = "Erro: " + e.message;
        newVideoBtn.classList.remove("hidden");
    } finally {
        inputVideo.value = "";
    }
});

newVideoBtn.onclick = () => {
    uploadBtn.classList.remove("hidden");
    videoPreview.classList.add("hidden");
    transcriptionArea.classList.add("hidden");
    processingText.classList.remove("hidden");
    editableText.classList.add("hidden");
    newVideoBtn.classList.add("hidden");
    videoStatus.innerHTML = "Processando vídeo...";
};

const micButton  = document.getElementById("micButton");
const micStatus  = document.getElementById("micStatus");
const soundWave  = document.getElementById("soundWave");
const speechBox  = document.getElementById("speechBox");
const speechText = document.getElementById("speechText");
const micWrapper = document.querySelector(".mic-wrapper");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const reconhecimento = new SpeechRecognition();
    reconhecimento.lang       = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = true;

    reconhecimento.onresult = (evento) => {
        let textoAtual = "";
        for (const result of evento.results) {
            textoAtual += result[0].transcript;
        }
        speechText.innerHTML = textoAtual;
    };

    reconhecimento.onend = () => {
        micWrapper.classList.remove("wave-active");
        micStatus.innerHTML = "Mantenha pressionado para falar";
        soundWave.classList.add("hidden");
    };

    reconhecimento.onerror = (e) => {
        micStatus.innerHTML = "❌ Erro: " + e.error;
    };

    function startMic() {
        micWrapper.classList.add("wave-active");
        micStatus.innerHTML = "Ouvindo... solte para parar";
        soundWave.classList.remove("hidden");
        speechBox.classList.remove("hidden");
        speechText.innerHTML = "";
        reconhecimento.start();
    }

    function stopMic() {
        reconhecimento.stop();
    }

    micButton.addEventListener("mousedown", startMic);
    micButton.addEventListener("mouseup", stopMic);
    micButton.addEventListener("touchstart", (e) => { e.preventDefault(); startMic(); });
    micButton.addEventListener("touchend", stopMic);

} else {
    const words = ["Olá, ", "tudo ", "bem? ", "Eu ", "gostaria ", "de ", "saber ", "sobre ", "o ", "projeto."];
    let micInterval;

    function startMic() {
        micWrapper.classList.add("wave-active");
        micStatus.innerHTML = "Ouvindo... solte para parar";
        soundWave.classList.remove("hidden");
        speechBox.classList.remove("hidden");
        speechText.innerHTML = "";
        let i = 0;
        micInterval = setInterval(() => {
            if (i < words.length) { speechText.innerHTML += words[i]; i++; }
        }, 600);
    }

    function stopMic() {
        micWrapper.classList.remove("wave-active");
        micStatus.innerHTML = "Mantenha pressionado para falar";
        clearInterval(micInterval);
    }

    micButton.addEventListener("mousedown", startMic);
    micButton.addEventListener("mouseup", stopMic);
    micButton.addEventListener("touchstart", startMic);
    micButton.addEventListener("touchend", stopMic);
}