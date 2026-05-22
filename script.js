let scene;
let policeList = [];
let animationRunning = false;
let animationFrame;
let currentTarget = null;

const corridorLeft = 250;
const corridorRight = 350;
const corridorCenter = 290; // Centraliza o guarda (300px - metade da largura dele)
const spacing = 16;
const cellSpacing = 60;
const cellStart = 180;

const queue = ["E", "12", "SP", "C", "1", "2", "3", "4", "5", "6", "SP2"];

function createCells() {
    for (let i = 1; i <= 10; i++) {
        let cell = document.createElement("div");
        cell.className = "cell"; 
        // Garantimos que o ID seja exatamente cell-1, cell-2, etc.
        cell.id = "cell-" + i;
        cell.innerText = "Cela " + i;

        let row = Math.ceil(i / 2);
        // Cálculo da posição vertical baseado na linha
        let y = scene.offsetHeight - (cellStart + row * cellSpacing);

        if (i % 2 === 1) {
            cell.style.left = corridorRight + "px";
        } else {
            cell.style.left = (corridorLeft - 216) + "px";
        }

        cell.style.top = y + "px";
        scene.appendChild(cell);
    }
}

function createPolice() {
    let startY = scene.offsetHeight - 120;

    queue.forEach((label, index) => {
        let p = document.createElement("div");
        p.className = "police";
        p.innerText = label;
        p.dataset.label = label;
        p.dataset.state = "fila";

        if (["E", "12", "SP", "C"].includes(label)) {
            p.speed = 1.2;
        } else {
            p.speed = 0.8;
        }

        if (["E", "12", "SP"].includes(label) && currentTarget !== null) {
            p.targetCell = currentTarget;
        } else if (label === "C") {
            p.targetCell = 8;
        } else if (label === "SP2") {
            p.targetCell = 5;
        } else {
            p.targetCell = Number(label);
        }

        p.x = corridorCenter;
        p.y = startY + index * spacing;
        p.style.left = p.x + "px";
        p.style.top = p.y + "px";

        scene.appendChild(p);
        policeList.push(p);
    });
}

function getFinalOffset(label, target) {
    // Equipe de elite se espalha em frente ao alvo definido
    if (target === currentTarget) {
        if (label === "SP") return -30;
        if (label === "12") return 0;
        if (label === "E") return 28;
    }
    if (target === 5) {
        if (label === "SP2") return -15;
        if (label === "5") return 15;
    }
    return 0;
}

function animate() {
    if (!animationRunning) return;

    policeList.forEach(p => {
        let label = p.dataset.label;
        let target = p.targetCell;
        let row = Math.ceil(target / 2);
        let targetY = scene.offsetHeight - (cellStart + row * cellSpacing);

        // Se não houver alvo para este guarda, ele não se move
        if (!target) {
            p.dataset.state = "parado";
            return;
        }

        if (p.dataset.state === "fila") {
            p.y -= p.speed;
            if (p.y <= targetY) {
                p.dataset.state = "lateral";
            }
        }

        if (p.dataset.state === "lateral") {
            let baseX = (target % 2 === 1) ? corridorRight - 26 : corridorLeft;
            baseX += getFinalOffset(label, target);

            if (p.x < baseX) p.x += p.speed * 2;
            if (p.x > baseX) p.x -= p.speed * 2;

            if (Math.abs(p.x - baseX) < 2) {
                p.dataset.state = "parado";
            }
        }

        p.style.left = p.x + "px";
        p.style.top = p.y + "px";
    });

    animationFrame = requestAnimationFrame(animate);
}

function start() {
    if (animationRunning) return;
    animationRunning = true;
    animate();
}

function pause() {
    animationRunning = false;
    cancelAnimationFrame(animationFrame);
}

function resetScene() {
    pause();
    policeList.forEach(p => p.remove());
    policeList = [];
    createPolice();
}

function updateTarget() {
    const input = document.getElementById("targetInput");
    const val = parseInt(input.value.trim());

    if (isNaN(val) || val < 1 || val > 10) {
        alert("Por favor, insira um número de cela válido (1 a 10).");
        return;
    }

    currentTarget = val;

    // 1. Limpar destaques de todas as celas
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('targetCell'));

    // 2. Aplicar o destaque apenas na cela escolhida
    const targetCellEl = document.getElementById("cell-" + val);
    if (targetCellEl) targetCellEl.classList.add('targetCell');

    // 3. Resetar a posição dos guardas para que eles reconheçam o novo alvo
    resetScene();
}

function enableEdit() {
    const title = document.getElementById("main-title");
    title.contentEditable = "true";
    title.focus();
    // Move o cursor para o final do texto
    document.execCommand('selectAll', false, null);
    document.getSelection().collapseToEnd();
}

window.addEventListener('load', () => {
    scene = document.getElementById("scene");
    createCells();
    createPolice();
});