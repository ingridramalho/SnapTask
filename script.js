let zoomAtual = 1;
let modoAtual = 2;
let ultimaFoto = false;


document.querySelectorAll('.zoom-btn').forEach(btn => {

    btn.addEventListener('click', () => {

        document.querySelectorAll('.zoom-btn')
        .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        zoomAtual = parseFloat(btn.dataset.zoom);

        const scale =
        1 + (zoomAtual - 0.6) * 0.15;

        document.querySelector('.viewfinder-content')
        .style.transform = `scale(${scale})`;

        alert(`Zoom alterado para ${zoomAtual}x`);

    });

});

document.querySelectorAll('.mode-btn').forEach(btn => {

    btn.addEventListener('click', () => {

        document.querySelectorAll('.mode-btn')
        .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        modoAtual =
        parseInt(btn.dataset.mode);

        alert(`Modo alterado para ${btn.textContent}`);

    });

});


const captureBtn =
document.getElementById('captureBtn');

const flash =
document.getElementById('flash');

if (captureBtn && flash) {

    captureBtn.addEventListener('click', () => {

        flash.classList.add('active');

        setTimeout(() => {
            flash.classList.remove('active');
        }, 200);

        ultimaFoto = true;

        if (navigator.vibrate){
            navigator.vibrate(50);
        }

        alert('Foto capturada com sucesso! 📸');

    });

}

const moreBtn =
document.getElementById('moreBtn');

const moreMenu =
document.getElementById('moreMenu');

const closeMore =
document.getElementById('closeMore');

if (moreBtn && moreMenu) {

    moreBtn.addEventListener('click', () => {

        moreMenu.classList.add('open');

        alert('Menu de opções aberto');

    });

}

if (closeMore && moreMenu) {

    closeMore.addEventListener('click', () => {

        moreMenu.classList.remove('open');

        alert('Menu fechado');

    });

}

if (moreMenu) {

    moreMenu.addEventListener('click', (e) => {

        if (e.target === moreMenu){

            moreMenu.classList.remove('open');

        }

    });

}


let flashOn = false;

const btnFlash =
document.getElementById('btnFlash');

const flashImg =
btnFlash ? btnFlash.querySelector('img') : null;

if (btnFlash) {

    btnFlash.addEventListener('click', () => {

        flashOn = !flashOn;

        if (flashImg) {

            if (flashOn) {

                flashImg.style.filter =
                'brightness(0) invert(0.8) sepia(1) saturate(5) hue-rotate(30deg)';

                alert('Flash ativado');

            } else {

                flashImg.style.filter =
                'brightness(0) invert(1)';

                alert('Flash desativado');

            }

        }

    });

}


const btnSettings =
document.getElementById('btnSettings');

const galleryBtn =
document.getElementById('galleryBtn');

const snaptaskBtn =
document.getElementById('snaptaskBtn');

const rotateBtn =
document.getElementById('rotateBtn');

document.querySelectorAll('.more-item').forEach(item => {

    item.addEventListener('click', () => {

        const modeName =
        item.querySelector('span')
        ? item.querySelector('span').textContent
        : item.textContent;

        alert(`Abrindo modo: ${modeName}`);

        const moreMenuEl =
        document.getElementById('moreMenu');

        if (moreMenuEl){

            moreMenuEl.classList.remove('open');

        }

    });

});

if(btnSettings){

    btnSettings.addEventListener('click', () => {

        alert('Configurações abertas.');

    });

}

if(galleryBtn){

    galleryBtn.addEventListener('click', () => {

        const abrir =
        confirm('Deseja abrir a galeria?');

        if(abrir){

            alert('Abrindo galeria...');

        }

    });

}

if(snaptaskBtn){

    snaptaskBtn.addEventListener('click', () => {

        alert('Entrando no SnapTask');

    });

}

if(rotateBtn){

    rotateBtn.addEventListener('click', () => {

        const angulo =
        prompt('Digite o ângulo de rotação:');

        if(angulo){

            alert(`Imagem rotacionada em ${angulo}°`);

        }

    });

}

const backButton =
document.getElementById('backButton');

const sideMenu =
document.getElementById('sideMenu');

let menuOpen = false;

if (backButton && sideMenu) {

    let overlay =
    document.querySelector('.menu-overlay');

    if (!overlay) {

        overlay = document.createElement('div');

        overlay.className = 'menu-overlay';

        document.body.appendChild(overlay);

    }

    backButton.addEventListener('click', (e) => {

        e.stopPropagation();

        menuOpen = !menuOpen;

        if (menuOpen) {

            sideMenu.classList.add('open');

            overlay.classList.add('active');

            const arrowSpan =
            backButton.querySelector('.back-arrow');

            if (arrowSpan){
                arrowSpan.textContent = '>';
            }

        } else {

            sideMenu.classList.remove('open');

            overlay.classList.remove('active');

            const arrowSpan =
            backButton.querySelector('.back-arrow');

            if (arrowSpan){
                arrowSpan.textContent = '<';
            }

        }

    });

    overlay.addEventListener('click', () => {

        menuOpen = false;

        sideMenu.classList.remove('open');

        overlay.classList.remove('active');

        const arrowSpan =
        backButton.querySelector('.back-arrow');

        if (arrowSpan){
            arrowSpan.textContent = '<';
        }

    });

}

// ============================================================
//  INTEGRAÇÃO COM O BACKEND 
// ============================================================

const BACKEND_URL = "https://snaptaskbackend.onrender.com";

async function gerarFlashcards(arquivoImagem) {
    const form = new FormData();
    form.append("imagem", arquivoImagem);
 
    const resposta = await fetch(`${BACKEND_URL}/flashcards`, {
        method: "POST",
        body: form,
    });
 
    const dados = await resposta.json();
    if (!resposta.ok || dados.erro) throw new Error(dados.erro || "Erro ao gerar flashcards.");
    return dados.cards;
}

async function gerarDocumento(arquivoImagem) {
    const form = new FormData();
    form.append("imagem", arquivoImagem);
 
    const resposta = await fetch(`${BACKEND_URL}/documento`, {
        method: "POST",
        body: form,
    });
 
    const dados = await resposta.json();
    if (!resposta.ok || dados.erro) throw new Error(dados.erro || "Erro ao gerar documento.");
    return dados.texto;
}

async function lerCodigo(arquivoImagem) {
    const form = new FormData();
    form.append("imagem", arquivoImagem);
 
    const resposta = await fetch(`${BACKEND_URL}/codigo`, {
        method: "POST",
        body: form,
    });
 
    const dados = await resposta.json();
    if (!resposta.ok || dados.erro) throw new Error(dados.erro || "Erro ao ler código.");
    return { linguagem: dados.linguagem, codigo: dados.codigo };
}

async function traduzirLibras(arquivoVideo) {
    const form = new FormData();
    form.append("video", arquivoVideo);
 
    const resposta = await fetch(`${BACKEND_URL}/libras`, {
        method: "POST",
        body: form,
    });
 
    const dados = await resposta.json();
    if (!resposta.ok || dados.erro) throw new Error(dados.erro || "Erro ao traduzir Libras.");
    return dados.traducao;
}

window.gerarDocumento = gerarDocumento;
window.gerarFlashcards = gerarFlashcards;
window.lerCodigo = lerCodigo;
window.traduzirLibras = traduzirLibras;