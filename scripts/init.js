/**
 * Start loading the models and init other essential functions
 */
function start() {
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('./assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./assets/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/models')
    ]).then(() => {
        baseImage.addEventListener('change', (event) => {
            baseImageInput = event.target.files[0];
            selectTab('output');
        });
        targetImage.addEventListener('change', (event) => {
            targetImageInput = event.target.files[0];
            selectTab(selectedTab ?? "face");
        });

        outputImageTab.addEventListener('click', () => selectTab('output', true));
        faceImageTab.addEventListener('click', () => selectTab('face'));
        btnCancel.addEventListener('click', closeModal);
        btnConfirm.addEventListener('click', confirmCroppedFace);
        btnClear.addEventListener('click', handleClearImage);
        btnToggle.addEventListener('click', handleToggleBoundingBox);
        btnSave.addEventListener('click', handleSaveOutputImage);

        selectTab('output');
    })
}

start();