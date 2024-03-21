const baseImage = document.getElementById('baseImageUpload');
const targetImage = document.getElementById('targetImageUpload');
const outputContainer = document.getElementById('output');
const outputImageTab = document.getElementById('tabOutputImage');
const faceImageTab = document.getElementById('tabFaceImage');
const modalContainer = document.getElementById('modalContainer');
const modalContent = document.getElementById('modalContent');

const btnSave = document.getElementById('btnSave');
const btnClear = document.getElementById('btnClear');
const btnCrop = document.getElementById('btnCrop');
const btnCancel = document.getElementById('btnCancel');
const btnConfirm = document.getElementById('btnConfirm');

let baseImageInput;
let targetImageInput;
let targetImageCropInput;

let divContainer;
let selectedImage;
let outputCanvas;
let selectedTab;
let boundingBoxes = [];