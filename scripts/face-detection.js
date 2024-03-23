/**
 * Detect faces in image
 */
async function detectFaces(saveBoundingBox = false) {
  if (baseImageInput) {
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    if (selectedImage) selectedImage.remove();
    if (outputCanvas) outputCanvas.remove();
    const resizedFile = await resizeImage(baseImageInput);
    selectedImage = await faceapi.bufferToImage(resizedFile);
    outputCanvas = faceapi.createCanvasFromMedia(selectedImage);
    const displaySize = { width: selectedImage.width, height: selectedImage.height };
    faceapi.matchDimensions(outputCanvas, displaySize);

    const detections = await faceapi.detectAllFaces(selectedImage).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

    generateOutput(results, resizedDetections, saveBoundingBox);
    drawImageOnBoundingBoxes();
  }
}

/**
 * Load labeled images (to provide label for images during detection)
 */
function loadLabeledImages() {
  const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark'];
  return Promise.all(
    labels.map(async label => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./assets/labeled_images/${label}/${i}.jpg`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  )
}
