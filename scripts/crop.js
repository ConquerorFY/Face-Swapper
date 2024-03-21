/**
 * Function to get rounded crop box (used for cropping face)
 */
function getRoundedCropBox(sourceCanvas) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
}

/**
 * Function to handle croppings
 */
function handleCropping(image) {
    let croppable = false;
    let cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        ready: function () {
            croppable = true;
        },
    });

    btnCrop.onclick = function () {
        let croppedCanvas;
        let roundedCanvas;
        let roundedImage;

        if (!croppable) return;

        // Crop
        croppedCanvas = cropper.getCroppedCanvas();

        // Round
        roundedCanvas = getRoundedCropBox(croppedCanvas);

        // Show
        roundedImage = new Image(400, 400);
        roundedImage.src = roundedCanvas.toDataURL()
        modalContent.innerHTML = '';
        modalContent.appendChild(roundedImage);
        openModal();
    };
}

/**
 * Function to confirm cropped face
 */
async function confirmCroppedFace() {
    const croppedFace = modalContent.children[0];
    targetImageCropInput = await imageToFile(croppedFace);
    closeModal();
}