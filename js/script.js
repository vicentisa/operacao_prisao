let timer;
let policeY = 0;
let running = false;

// Função para criar as 10 celas dinamicamente
function createCells() {
    const scene = document.getElementById('scene');
    for (let i = 1; i <= 10; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        if (i === 7) {
            cell.classList.add('targetCell');
            // O texto "⚡ Cela 07" já vem do CSS (::after), então deixamos vazio aqui
        } else {
            cell.innerText = `Cela ${i.toString().padStart(2, '0')}`;
        }
        
        // Posicionamento: 1-5 na esquerda, 6-10 na direita
        if (i <= 5) {
            cell.style.left = '42px';
            cell.style.top = `${(i - 1) * 80 + 50}px`;
        } else {
            cell.style.left = '442px';
            cell.style.top = `${(i - 6) * 80 + 50}px`;
        }
        scene.appendChild(cell);
    }
}

// Função para criar o policial no corredor
function createPolice() {
    const scene = document.getElementById('scene');
    const police = document.createElement('div');
    police.id = 'police';
    police.className = 'police';
    police.innerText = 'P';
    // Centraliza no corredor (corredor começa em 300px e tem 100px de largura)
    police.style.left = '337px'; 
    police.style.top = '0px';
    scene.appendChild(police);
}

function start() {
    if (running) return;
    running = true;
    timer = setInterval(() => {
        const police = document.getElementById('police');
        if (police) {
            if (policeY < 670) { // Limite do fundo da cena
                policeY += 3;
                police.style.top = policeY + 'px';
            } else {
                pause();
            }
        }
    }, 30);
}

function pause() {
    clearInterval(timer);
    running = false;
}

function resetScene() {
    pause();
    const scene = document.getElementById('scene');
    scene.innerHTML = '<div id="corridor"></div><div id="gate"></div>';
    policeY = 0;
    createCells();
    createPolice();
}

// Inicializa o cenário quando a página carregar
window.onload = resetScene;