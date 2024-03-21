/**
 * Calculate center and radius of circle
 */
function calcCenterRadius(point1, point2, point3, point4) {
    // Calculate center coordinates
    const centerX = (point1.x + point2.x + point3.x + point4.x) / 4;
    const centerY = (point1.y + point2.y + point3.y + point4.y) / 4;

    // Calculate radius
    const dx = point1.x - centerX;
    const dy = point1.y - centerY;
    const radius = Math.sqrt(dx * dx + dy * dy);

    return {
        center: {
            x: centerX,
            y: centerY
        },
        radius
    };
}