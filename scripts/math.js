/**
 * Calculate center and radius of circle
 */
function calcCenterRadius(p1, p2, p3, p4) {
    // Calculate center coordinates
    const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
    const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;

    // Calculate radius
    const dx = p1.x - centerX;
    const dy = p1.y - centerY;
    const radius = Math.sqrt(dx * dx + dy * dy);

    return {
        center: {
            x: centerX,
            y: centerY
        },
        radius
    };
}

/**
 * Function to calculate the distance between two points
 */
function distance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}