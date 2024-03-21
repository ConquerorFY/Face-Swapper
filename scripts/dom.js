/**
 * Resize image based on specified max width and max height dimensions
 */
function resizeImage(file, maxWidth = 640, maxHeight = 480) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let newWidth = img.width;
                let newHeight = img.height;
                if (newWidth > maxWidth || newHeight > maxHeight) {
                    const ratio = Math.min(maxWidth / newWidth, maxHeight / newHeight);
                    newWidth *= ratio;
                    newHeight *= ratio;
                }
                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                // Convert canvas to Blob
                canvas.toBlob(function (blob) {
                    resolve(blob);
                }, file.type);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Fill up points on bounding box
 */
function fillPointsBoundingBoxes(ctx, point1, point2, point3, point4) {
    const radius = 3;

    // Draw fill points
    ctx.fillStyle = 'darkblue';
    ctx.beginPath();
    ctx.arc(point1.x, point1.y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(point2.x, point2.y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(point3.x, point3.y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(point4.x, point4.y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

/**
 * Draw bounding boxes on canvas
 */
function drawBoundingBoxes() {
    const ctx = outputCanvas.getContext('2d');
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    ctx.strokeStyle = 'lightgreen';
    ctx.lineWidth = 3;
    for (let box of boundingBoxes) {
        const { topLeft, topRight, bottomLeft, bottomRight } = box;
        const { center, radius } = calcCenterRadius(topLeft, topRight, bottomLeft, bottomRight);
        // Draw circle
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        fillPointsBoundingBoxes(ctx, topLeft, topRight, bottomLeft, bottomRight);
    }
}

/**
 * Reset environment
 */
function reset() {
    /* Prevent memory leak */
    outputCanvas.removeEventListener('mousedown', handleCanvasMouseDown);
    outputCanvas.removeEventListener('mousemove', handleCanvasMouseMove);
    outputCanvas.removeEventListener('mouseup', handleCanvasMouseUp);

    const ctx = outputCanvas.getContext('2d');
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    boundingBoxes = [];
}

/**
 * Generate output
 */
function generateOutput(results, resizedDetections) {
    if (selectedTab === "output") {
        reset();
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            boundingBoxes.push({
                topLeft: {
                    x: box.topLeft.x,
                    y: box.topLeft.y,
                },
                topRight: {
                    x: box.topRight.x,
                    y: box.topRight.y,
                },
                bottomLeft: {
                    x: box.bottomLeft.x,
                    y: box.bottomLeft.y,
                },
                bottomRight: {
                    x: box.bottomRight.x,
                    y: box.bottomRight.y,
                },
                isDragging: false
            });
        });
        drawBoundingBoxes();

        if (divContainer) divContainer.remove();
        divContainer = document.createElement('div');
        divContainer.style.position = 'relative';
        divContainer.append(selectedImage);
        divContainer.append(outputCanvas);
        outputContainer.append(divContainer);

        outputCanvas.addEventListener('mousedown', handleCanvasMouseDown);
        outputCanvas.addEventListener('mousemove', handleCanvasMouseMove);
        outputCanvas.addEventListener('mouseup', handleCanvasMouseUp);
    }
}

/**
 * Function to check whether point is within range of +/- certain points
 */
function isPointWithinRange(val, target, offset = 10) {
    return val.x >= target.x - offset
        && val.x <= target.x + offset
        && val.y >= target.y - offset
        && val.y <= target.y + offset;
}

/**
 * Handle mouse down in canvas
 */
function handleCanvasMouseDown(event) {
    const currentPoint = {
        x: event.clientX - outputCanvas.getBoundingClientRect().left,
        y: event.clientY - outputCanvas.getBoundingClientRect().top
    };

    for (let i = 0; i < boundingBoxes.length; i++) {
        if (isPointWithinRange(currentPoint, boundingBoxes[i].topLeft)
            || isPointWithinRange(currentPoint, boundingBoxes[i].topRight)
            || isPointWithinRange(currentPoint, boundingBoxes[i].bottomLeft)
            || isPointWithinRange(currentPoint, boundingBoxes[i].bottomRight)
        ) {
            boundingBoxes[i].isDragging = true;
        }
    }
}

/**
 * Update points for resizing
 */
function updatePointResize(center, movedPoint, targetPoint) {
    // Calculate the new radius based on the distance from the center to the moved point
    const radius = distance(center, movedPoint);

    // Calculate the angle between the current point and the center
    const angle = Math.atan2(targetPoint.y - center.y, targetPoint.x - center.x);

    // Update the position of the current point based on the new radius and angle
    const updatedPointX = center.x + radius * Math.cos(angle);
    const updatedPointY = center.y + radius * Math.sin(angle);

    return {
        x: updatedPointX,
        y: updatedPointY
    }
}

/**
 * Handle mouse move in canvas
 */
function handleCanvasMouseMove(event) {
    const currentPoint = {
        x: event.clientX - outputCanvas.getBoundingClientRect().left,
        y: event.clientY - outputCanvas.getBoundingClientRect().top
    };
    for (let i = 0; i < boundingBoxes.length; i++) {
        if (boundingBoxes[i].isDragging) {
            const { center } = calcCenterRadius(
                boundingBoxes[i].topLeft,
                boundingBoxes[i].topRight,
                boundingBoxes[i].bottomLeft,
                boundingBoxes[i].bottomRight,
            );

            if (isPointWithinRange(currentPoint, boundingBoxes[i].topLeft)
                || isPointWithinRange(currentPoint, boundingBoxes[i].topRight)
                || isPointWithinRange(currentPoint, boundingBoxes[i].bottomLeft)
                || isPointWithinRange(currentPoint, boundingBoxes[i].bottomRight)
            ) {
                const topLeft = updatePointResize(center, currentPoint, boundingBoxes[i].topLeft);
                boundingBoxes[i].topLeft.x = topLeft.x;
                boundingBoxes[i].topLeft.y = topLeft.y;

                const topRight = updatePointResize(center, currentPoint, boundingBoxes[i].topRight);
                boundingBoxes[i].topRight.x = topRight.x;
                boundingBoxes[i].topRight.y = topRight.y;

                const bottomLeft = updatePointResize(center, currentPoint, boundingBoxes[i].bottomLeft);
                boundingBoxes[i].bottomLeft.x = bottomLeft.x;
                boundingBoxes[i].bottomLeft.y = bottomLeft.y;

                const bottomRight = updatePointResize(center, currentPoint, boundingBoxes[i].bottomRight);
                boundingBoxes[i].bottomRight.x = bottomRight.x;
                boundingBoxes[i].bottomRight.y = bottomRight.y;
            }

            drawBoundingBoxes();
        }
    }
}

/**
 * Handle mouse up in canvas
 */
function handleCanvasMouseUp() {
    for (let box of boundingBoxes) {
        box.isDragging = false;
    }
}

/**
 * Draw image on bounding boxes
 */
function drawImageOnBoundingBoxes() {
    const imageInput = targetImageCropInput ?? targetImageInput;
    if (imageInput) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const ctx = outputCanvas.getContext('2d');
                ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
                drawBoundingBoxes();

                // Draw image within bounding box
                for (let box of boundingBoxes) {
                    const { topLeft, topRight, bottomLeft, bottomRight } = box;
                    const { center, radius } = calcCenterRadius(topLeft, topRight, bottomLeft, bottomRight);

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.clip();

                    ctx.drawImage(img, center.x - radius, center.y - radius, radius * 2, radius * 2);
                    ctx.restore();
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageInput);
    }
}

/**
 * Edit target face
 */
function editTargetFace() {
    if (selectedTab === "face") {
        divContainer = document.createElement('div');
        divContainer.style.position = 'relative';
        outputContainer.appendChild(divContainer);

        if (targetImageInput) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image(640, 480);
                img.src = e.target.result;
                const divImg = document.createElement('div');
                divImg.appendChild(img);
                handleCropping(img);
                divContainer.appendChild(img);
            };
            reader.readAsDataURL(targetImageInput);
        }
    }
}

/**
 * Select tab
 */
function selectTab(type) {
    /* either output or face */
    if (selectedImage) selectedImage.remove();
    if (outputCanvas) outputCanvas.remove();
    if (divContainer) divContainer.remove();

    if (type === "output") {
        outputImageTab.style.textDecorationLine = 'underline';
        faceImageTab.style.textDecorationLine = 'initial';
        btnCrop.style.display = "none";
        btnSave.style.display = "initial";
        btnClear.style.display = "initial";
        selectedTab = "output";
        detectFaces();
    } else if (type === "face") {
        faceImageTab.style.textDecorationLine = 'underline';
        outputImageTab.style.textDecorationLine = 'initial';
        btnCrop.style.display = "initial";
        btnSave.style.display = "none";
        btnClear.style.display = "none";
        selectedTab = "face";
        editTargetFace();
    } else {
        throw new Error("Type is not defined!");
    }
}

/**
 * Convert img element to file
 */
async function imageToFile(image, fileName = 'cropped_img.png') {
    const fileBlob = await new Promise((resolve, reject) => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match image dimensions
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image onto canvas
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // Convert canvas content to blob
        canvas.toBlob(
            blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to convert image to blob'));
                }
            },
            'image/png', // Change this to match the desired file type
            1 // Quality (only applicable for 'image/jpeg' format)
        );
    });
    return new File([fileBlob], fileName, { type: fileBlob.type });
}