/* jshint esversion: 6 */

const pixelBoard = document.getElementById('pixel-board');
const gridSizeInput = document.getElementById('grid-size');
const applySizeBtn = document.getElementById('apply-size');
const colorPicker = document.getElementById('colour-palette');
const drawBtn = document.getElementById('draw');
const eraserBtn = document.getElementById('eraser');
const toggleGrid = document.getElementById('toggle-grid');
const rainbowToggle = document.getElementById('rainbow-toggle');
const clearBtn = document.getElementById('clear-board');
const downloadBtn = document.getElementById('download-board');
const exportCanvas = document.getElementById('export-canvas');

let currentColor = '#000000';
let isDrawing = false;
let drawMode = true;
let rainbowMode = false;
let hue = 0;

// Touch scroll detection
let isTouchScrolling = false;
let touchStartX = 0;
let touchStartY = 0;
const scrollThreshold = 10;

function createGrid(size) {
    pixelBoard.innerHTML = '';
    pixelBoard.style.display = 'grid';
    pixelBoard.style.gridTemplateColumns = `repeat(${size}, 20px)`;
    pixelBoard.style.gridTemplateRows = `repeat(${size}, 20px)`;

    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');

        // Mouse events
        pixel.addEventListener('mousedown', handleDraw);
        pixel.addEventListener('mouseover', (e) => {
            if (isDrawing) handleDraw(e);
        });

        // Touch events with scroll detection
        pixel.addEventListener('touchstart', (e) => {
            isTouchScrolling = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;

            handleTouchDraw(e); // draw on tap
        });

        pixel.addEventListener('touchmove', (e) => {
            const dx = Math.abs(e.touches[0].clientX - touchStartX);
            const dy = Math.abs(e.touches[0].clientY - touchStartY);

            if (dx > scrollThreshold || dy > scrollThreshold) {
                isTouchScrolling = true;
                return; // allow scrolling
            }

            handleTouchDraw(e);
        });

        pixelBoard.appendChild(pixel);
    }
}

// Drawing handler
function handleDraw(e) {
    if (e.buttons !== 1 && !e.type.includes('down')) return;
    const color = rainbowMode ? getRainbowColor() : currentColor;
    e.target.style.backgroundColor = drawMode ? color : '';
}

function handleTouchDraw(e) {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('pixel')) {
        const color = rainbowMode ? getRainbowColor() : currentColor;
        target.style.backgroundColor = drawMode ? color : '';
    }
}

function getRainbowColor() {
    const color = `hsl(${hue}, 100%, 50%)`;
    hue = (hue + 10) % 360;
    return color;
}

// Mode toggle
drawBtn.addEventListener('click', () => {
    drawMode = true;
    drawBtn.classList.add('active');
    eraserBtn.classList.remove('active');
});

eraserBtn.addEventListener('click', () => {
    drawMode = false;
    eraserBtn.classList.add('active');
    drawBtn.classList.remove('active');
});

// Color picker
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Grid resizing
applySizeBtn.addEventListener('click', () => {
    createGrid(gridSizeInput.value);
});

// Responsive max grid size
function updateGridSizeMax() {
    const isMobile = window.innerWidth <= 768;
    gridSizeInput.max = isMobile ? 50 : 120;

    if (parseInt(gridSizeInput.value) > parseInt(gridSizeInput.max)) {
        gridSizeInput.value = gridSizeInput.max;
    }

    const gridSizeValue = document.getElementById('grid-size-value');
    if (gridSizeValue) {
        gridSizeValue.textContent = gridSizeInput.value;
    }
}

// Grid toggle
toggleGrid.addEventListener('change', () => {
    pixelBoard.classList.toggle('show-grid', toggleGrid.checked);
});

// Rainbow toggle
rainbowToggle.addEventListener('change', () => {
    rainbowMode = rainbowToggle.checked;
});

// Clear board
clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.pixel').forEach(pixel => {
        pixel.style.backgroundColor = '';
    });
});

// Download board as image
downloadBtn.addEventListener('click', () => {
    const size = gridSizeInput.value;
    exportCanvas.width = exportCanvas.height = 600;
    const ctx = exportCanvas.getContext('2d');
    const pixels = document.querySelectorAll('.pixel');
    const cellSize = exportCanvas.width / size;

    pixels.forEach((pixel, i) => {
        const color = window.getComputedStyle(pixel).backgroundColor || 'white';
        ctx.fillStyle = color === 'rgba(0, 0, 0, 0)' ? '#ffffff' : color;
        ctx.fillRect((i % size) * cellSize, Math.floor(i / size) * cellSize, cellSize, cellSize);
    });

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = exportCanvas.toDataURL();
    link.click();
});

// Mouse down/up for draw tracking
pixelBoard.addEventListener('mousedown', () => isDrawing = true);
document.body.addEventListener('mouseup', () => isDrawing = false);

// Initialize
createGrid(gridSizeInput.value || 16);

// Set draw button as default active on load
window.addEventListener('DOMContentLoaded', () => {
    drawMode = true;
    drawBtn.classList.add('active');
    eraserBtn.classList.remove('active');
});

// Handle max grid size on load and resize
window.addEventListener('load', updateGridSizeMax);
window.addEventListener('resize', updateGridSizeMax);
