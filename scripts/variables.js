const baseImage = document.getElementById('baseImageUpload');
const targetImage = document.getElementById('targetImageUpload');
const outputContainer = document.getElementById('output');
const outputImageTab = document.getElementById('tabOutputImage');
const faceImageTab = document.getElementById('tabFaceImage');
const btnSave = document.getElementById('btnSave');
const btnClear = document.getElementById('btnClear');
const btnCrop = document.getElementById('btnCrop');

let baseImageInput;
let targetImageInput;

let divContainer;
let selectedImage;
let outputCanvas;
let selectedTab;
let boundingBoxes = [];