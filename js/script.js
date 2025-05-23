const pixelBoard = document.getElementById("pixel-board");
const colorPalette = document.getElementById("colour-palette");
const clearBtn = document.getElementById("clear-board");
const gridSizeInput = document.getElementById("grid-size");
const applyGridSizeBtn = document.getElementById("apply-size");
const exportBtn = document.getElementById("download-board");
const exportCanvas = document.getElementById("export-canvas");
const toggleGrid = document.getElementById("toggle-grid");
const rainbowMode = document.getElementById("rinbow-mode");
const colorHistoryContainer = document.getElementById("colour-history");
const drawBtn = document.getElementById("draw");
const eraserBtn = document.getElementById("eraser");

let isDrawing = false;
let gridSize = 16;
let colorHistory = [];
let isErasing = false;