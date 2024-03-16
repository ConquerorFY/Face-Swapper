/**
 * Resize image based on specified nax width and max height dimensions
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