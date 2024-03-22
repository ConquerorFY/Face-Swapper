/* File Uploads */
const baseImage = document.getElementById('baseImageUpload');
const targetImage = document.getElementById('targetImageUpload');

/* Tabs */
const outputImageTab = document.getElementById('tabOutputImage');
const faceImageTab = document.getElementById('tabFaceImage');

/* Modals */
const modalContainer = document.getElementById('modalContainer');
const modalContent = document.getElementById('modalContent');

/* Notifications */
const notificationContainer = document.getElementById('notificationContainer');

/* Action Buttons */
const btnSave = document.getElementById('btnSave');
const btnClear = document.getElementById('btnClear');
const btnCrop = document.getElementById('btnCrop');

/* Modal Buttons */
const btnCancel = document.getElementById('btnCancel');
const btnConfirm = document.getElementById('btnConfirm');

/* Image Inputs */
let baseImageInput;
let targetImageInput;
let targetImageCropInput;

/* Image Drawing Containers */
let divContainer;
let selectedImage;
let outputCanvas;

/* Others */
const outputContainer = document.getElementById('output');
let selectedTab;
let boundingBoxes = [];